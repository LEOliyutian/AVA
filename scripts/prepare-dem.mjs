#!/usr/bin/env node
/**
 * Copernicus DEM 下载与准备脚本
 *
 * 自动完成全部流程：
 *   1. 从 AWS 下载 Copernicus GLO-30 DEM (30m, 免费)
 *   2. 使用 geotiff 读取并裁切吉克普林滑雪场区域
 *   3. 输出为浏览器可直接加载的二进制文件 + JSON 元数据
 *
 * 使用方式：
 *   node scripts/prepare-dem.mjs          # 下载 + 裁切 + 生成
 *   node scripts/prepare-dem.mjs --info   # 仅显示信息
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { fromFile } from 'geotiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 配置 ────────────────────────────────────────────────────────

// 吉克普林滑雪场中心坐标
const CENTER = { lat: 48.585, lng: 87.527 };

// 裁切范围：中心 ±0.15° (约 ±17km)，总覆盖 ~34km × 34km
const CROP_PADDING = 0.15;
const CROP_BOUNDS = {
  west: CENTER.lng - CROP_PADDING,    // 87.377
  east: CENTER.lng + CROP_PADDING,    // 87.677
  south: CENTER.lat - CROP_PADDING,   // 48.435
  north: CENTER.lat + CROP_PADDING,   // 48.735
};

// Copernicus GLO-30 GeoTIFF (AWS 公开数据)
const GEOTIFF_URL = 'https://copernicus-dem-30m.s3.eu-central-1.amazonaws.com/Copernicus_DSM_COG_10_N48_00_E087_00_DEM/Copernicus_DSM_COG_10_N48_00_E087_00_DEM.tif';
const GEOTIFF_NAME = 'Copernicus_DSM_COG_10_N48_00_E087_00_DEM.tif';

const CACHE_DIR = path.resolve(__dirname, '../server/data/dem');
const OUTPUT_DIR = path.resolve(__dirname, '../public/terrain');

// ─── 工具函数 ────────────────────────────────────────────────────

function printBanner() {
  console.log(`
========================================
  Copernicus DEM 地形数据准备工具
  吉克普林滑雪场 (${CENTER.lat}N, ${CENTER.lng}E)
========================================
`);
}

function printInfo() {
  console.log(`目标区域: 吉克普林滑雪场（新疆阿勒泰）
中心坐标: ${CENTER.lat}N, ${CENTER.lng}E
裁切范围: ${CROP_BOUNDS.west}E-${CROP_BOUNDS.east}E, ${CROP_BOUNDS.south}N-${CROP_BOUNDS.north}N

数据源: Copernicus GLO-30 (30m, 免费, 无需注册)
输出: public/terrain/jikepulin-dem.bin + .json

如需 10m 精度 (GLO-10):
  1. 注册 https://dataspace.copernicus.eu/
  2. 搜索 COP-DEM_GLO-10-DGED, 下载 N48E087 瓦片
  3. 放入 ${CACHE_DIR}/ 并重新运行此脚本
`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      const sizeMB = (fs.statSync(dest).size / 1024 / 1024).toFixed(1);
      console.log(`  已缓存: ${dest} (${sizeMB}MB)`);
      resolve(dest);
      return;
    }

    console.log(`  正在下载: ${url}`);
    const file = fs.createWriteStream(dest);
    let receivedBytes = 0;

    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
      response.pipe(file);
      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        if (totalBytes > 0) {
          const pct = ((receivedBytes / totalBytes) * 100).toFixed(0);
          const mb = (receivedBytes / 1024 / 1024).toFixed(1);
          process.stdout.write(`\r  下载进度: ${mb}MB (${pct}%)`);
        }
      });
      file.on('finish', () => {
        file.close();
        console.log(' - 完成');
        resolve(dest);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// ─── GeoTIFF 处理 ─────────────────────────────────────────────

async function processGeoTIFF(tifPath) {
  console.log('\n[2/3] 读取 GeoTIFF 并裁切区域...');

  const tiff = await fromFile(tifPath);
  const image = await tiff.getImage();

  const fullWidth = image.getWidth();
  const fullHeight = image.getHeight();

  // 使用 geotiff 内置方法获取地理参数
  const origin = image.getOrigin();       // [x, y] 左上角坐标
  const resolution = image.getResolution(); // [xRes, yRes] yRes 通常为负
  const originX = origin[0];
  const originY = origin[1];
  const scaleX = resolution[0];
  const scaleY = resolution[1]; // 负值（北→南）

  console.log(`  GeoTIFF: ${fullWidth}x${fullHeight}`);
  console.log(`  原点: (${originX}, ${originY}), 像素: (${scaleX}, ${scaleY})`);

  // 计算裁切像素范围
  const col0 = Math.max(0, Math.floor((CROP_BOUNDS.west - originX) / scaleX));
  const col1 = Math.min(fullWidth - 1, Math.ceil((CROP_BOUNDS.east - originX) / scaleX));
  const row0 = Math.max(0, Math.floor((CROP_BOUNDS.north - originY) / scaleY));  // scaleY 为负
  const row1 = Math.min(fullHeight - 1, Math.ceil((CROP_BOUNDS.south - originY) / scaleY));

  const cropWidth = col1 - col0 + 1;
  const cropHeight = row1 - row0 + 1;

  console.log(`  裁切范围: col=${col0}-${col1}, row=${row0}-${row1} (${cropWidth}x${cropHeight} pixels)`);

  // 读取裁切区域的高程数据
  const rasters = await image.readRasters({
    window: [col0, row0, col1 + 1, row1 + 1],
  });
  const elevData = rasters[0]; // 第一个波段

  // 计算裁切后的精确地理范围
  const actualWest = originX + col0 * scaleX;
  const actualNorth = originY + row0 * scaleY;
  const actualEast = originX + (col1 + 1) * scaleX;
  const actualSouth = originY + (row1 + 1) * scaleY;

  // 统计
  let minElev = Infinity, maxElev = -Infinity, sum = 0, count = 0;
  const nodata = image.getGDALNoData() ?? -9999;

  for (let i = 0; i < elevData.length; i++) {
    const v = elevData[i];
    if (v !== nodata && isFinite(v)) {
      if (v < minElev) minElev = v;
      if (v > maxElev) maxElev = v;
      sum += v;
      count++;
    }
  }

  const avgElev = count > 0 ? sum / count : 0;
  console.log(`  高程范围: ${minElev.toFixed(0)}m - ${maxElev.toFixed(0)}m (均值 ${avgElev.toFixed(0)}m)`);

  // 替换 nodata 为平均高程
  const output = new Float32Array(cropWidth * cropHeight);
  for (let i = 0; i < elevData.length; i++) {
    const v = elevData[i];
    output[i] = (v === nodata || !isFinite(v)) ? avgElev : v;
  }

  return {
    data: output,
    metadata: {
      width: cropWidth,
      height: cropHeight,
      west: actualWest,
      east: actualEast,
      south: actualSouth,
      north: actualNorth,
      pixelWidth: scaleX,
      pixelHeight: Math.abs(scaleY),
      minElevation: minElev,
      maxElevation: maxElev,
      avgElevation: Math.round(avgElev),
      nodata: avgElev, // 已替换为均值
      source: 'Copernicus GLO-30 (30m)',
      center: CENTER,
    },
  };
}

// ─── 输出 ─────────────────────────────────────────────────────

function saveOutput(result) {
  console.log('\n[3/3] 保存到 public/terrain/ ...');
  ensureDir(OUTPUT_DIR);

  // 保存二进制文件 (Float32Array, little-endian, row-major, north→south)
  const binPath = path.join(OUTPUT_DIR, 'jikepulin-dem.bin');
  const buffer = Buffer.from(result.data.buffer);
  fs.writeFileSync(binPath, buffer);
  const binMB = (buffer.length / 1024 / 1024).toFixed(2);
  console.log(`  ${binPath} (${binMB}MB)`);

  // 保存 JSON 元数据
  const jsonPath = path.join(OUTPUT_DIR, 'jikepulin-dem.json');
  fs.writeFileSync(jsonPath, JSON.stringify(result.metadata, null, 2));
  console.log(`  ${jsonPath}`);
}

// ─── 主流程 ────────────────────────────────────────────────────

async function main() {
  printBanner();

  if (process.argv.includes('--info')) {
    printInfo();
    return;
  }

  // Step 1: 下载 GeoTIFF
  console.log('[1/3] 下载 Copernicus GLO-30 DEM...');
  ensureDir(CACHE_DIR);
  const tifPath = path.join(CACHE_DIR, GEOTIFF_NAME);
  await downloadFile(GEOTIFF_URL, tifPath);

  // Step 2: 裁切处理
  const result = await processGeoTIFF(tifPath);

  // Step 3: 保存输出
  saveOutput(result);

  console.log(`
========================================
  DEM 数据准备完成！
  覆盖范围: ${CROP_BOUNDS.west.toFixed(3)}E - ${CROP_BOUNDS.east.toFixed(3)}E
            ${CROP_BOUNDS.south.toFixed(3)}N - ${CROP_BOUNDS.north.toFixed(3)}N
  分辨率: ~30m (Copernicus GLO-30)
  文件: public/terrain/jikepulin-dem.bin + .json
  地图将自动使用此数据，无需额外配置。
========================================
`);
}

main().catch((err) => {
  console.error('错误:', err.message || err);
  process.exit(1);
});
