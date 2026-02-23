#!/usr/bin/env node
/**
 * 将 Copernicus DEM GeoTIFF 上传到 Cesium Ion
 *
 * 使用方式:
 *   node scripts/upload-to-ion.mjs --token=YOUR_CESIUM_ION_TOKEN
 *
 * 获取 token:
 *   1. 注册/登录 https://ion.cesium.com/
 *   2. 进入 https://ion.cesium.com/tokens
 *   3. 创建 token，勾选 assets:read + assets:write
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEOTIFF_PATH = path.resolve(__dirname, '../server/data/dem/Copernicus_DSM_COG_10_N48_00_E087_00_DEM.tif');
const ENV_PATH = path.resolve(__dirname, '../.env');
const ION_API = 'https://api.cesium.com/v1';

// ─── 工具函数 ────────────────────────────────────────────

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w+)=(.+)$/);
    if (match) args[match[1]] = match[2];
  }
  return args;
}

function ionRequest(method, endpoint, token, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, ION_API);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`Ion API ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── 主流程 ────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const token = args.token;

  if (!token) {
    console.error(`
使用方式: node scripts/upload-to-ion.mjs --token=YOUR_TOKEN

获取 Cesium Ion Access Token:
  1. 打开 https://ion.cesium.com/signup (免费注册)
  2. 登录后进入 https://ion.cesium.com/tokens
  3. 点击 "Create token"
  4. 勾选权限: assets:read, assets:write
  5. 复制生成的 token
`);
    process.exit(1);
  }

  // 检查 GeoTIFF 文件
  if (!fs.existsSync(GEOTIFF_PATH)) {
    console.error('GeoTIFF 文件不存在，请先运行: node scripts/prepare-dem.mjs');
    process.exit(1);
  }

  const fileSize = fs.statSync(GEOTIFF_PATH).size;
  console.log(`文件: ${GEOTIFF_PATH} (${(fileSize / 1024 / 1024).toFixed(1)}MB)\n`);

  // Step 1: 创建资产
  console.log('[1/4] 在 Cesium Ion 创建资产...');
  const asset = await ionRequest('POST', '/v1/assets', token, {
    name: 'Jikepulin-Copernicus-DEM-30m',
    description: '吉克普林滑雪场 Copernicus GLO-30 DEM (N48E087)',
    type: 'TERRAIN',
    options: {
      sourceType: 'TERRAIN_RASTER',
      toMeters: 1.0,
    },
  });

  const assetId = asset.assetMetadata.id;
  const upload = asset.uploadLocation;
  console.log(`  Asset ID: ${assetId}`);
  console.log(`  S3 Bucket: ${upload.bucket}`);
  console.log(`  S3 Prefix: ${upload.prefix}`);

  // Step 2: 上传到 S3
  console.log('\n[2/4] 上传 GeoTIFF 到 Cesium Ion S3...');
  const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: upload.endpoint,
    credentials: {
      accessKeyId: upload.accessKey,
      secretAccessKey: upload.secretAccessKey,
      sessionToken: upload.sessionToken,
    },
    forcePathStyle: true,
  });

  const fileBuffer = fs.readFileSync(GEOTIFF_PATH);
  const key = `${upload.prefix}Copernicus_DSM_COG_10_N48_00_E087_00_DEM.tif`;

  await s3.send(new PutObjectCommand({
    Bucket: upload.bucket,
    Key: key,
    Body: fileBuffer,
    ContentLength: fileSize,
  }));
  console.log('  上传完成');

  // Step 3: 通知上传完成
  console.log('\n[3/4] 通知 Cesium Ion 开始处理...');
  await ionRequest('POST', `/v1/assets/${assetId}/uploadComplete`, token);
  console.log('  处理已启动');

  // Step 4: 等待处理完成
  console.log('\n[4/4] 等待 Cesium Ion 处理地形瓦片...');
  let status = 'AWAITING_FILES';
  let attempts = 0;
  const maxAttempts = 60; // 最多等 10 分钟

  while (status !== 'COMPLETE' && status !== 'ERROR' && attempts < maxAttempts) {
    await sleep(10000); // 每 10 秒查询
    attempts++;
    const info = await ionRequest('GET', `/v1/assets/${assetId}`, token);
    status = info.status;
    const pct = info.percentComplete || 0;
    process.stdout.write(`\r  状态: ${status} (${pct}%) [${attempts * 10}s]`);
  }
  console.log('');

  if (status === 'COMPLETE') {
    console.log(`\n========================================`);
    console.log(`  Cesium Ion 处理完成！`);
    console.log(`  Asset ID: ${assetId}`);
    console.log(`  查看: https://ion.cesium.com/assets/${assetId}`);
    console.log(`========================================\n`);

    // 写入 .env
    const envLine = `VITE_CESIUM_TERRAIN_ASSET_ID=${assetId}`;
    if (fs.existsSync(ENV_PATH)) {
      let envContent = fs.readFileSync(ENV_PATH, 'utf-8');
      if (envContent.includes('VITE_CESIUM_TERRAIN_ASSET_ID')) {
        envContent = envContent.replace(/VITE_CESIUM_TERRAIN_ASSET_ID=.*/, envLine);
      } else {
        envContent += `\n${envLine}\n`;
      }
      fs.writeFileSync(ENV_PATH, envContent);
    } else {
      fs.writeFileSync(ENV_PATH, `${envLine}\n`);
    }
    console.log(`.env 已更新: ${envLine}`);
    console.log('重启开发服务器即可生效: npm run dev');
  } else {
    console.error(`\n处理失败，状态: ${status}`);
    console.error(`请到 https://ion.cesium.com/assets/${assetId} 查看详情`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('错误:', err.message || err);
  process.exit(1);
});
