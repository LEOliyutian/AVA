#!/usr/bin/env node
/**
 * 高精度坡度/朝向分析计算脚本
 *
 * 基于 Horn 算法（3x3 加权差分）直接从 DEM 栅格计算：
 *   - slope.png: 坡度彩色可视化图（RGBA，透明度渐变）
 *   - aspect.png: 朝向彩色可视化图（8 方向色带）
 *   - slope-data.bin: Float32Array 原始坡度值（度，用于点查询）
 *   - aspect-data.bin: Float32Array 原始朝向值（度，用于点查询）
 *
 * 使用方式：
 *   node scripts/compute-terrain-analysis.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TERRAIN_DIR = path.resolve(__dirname, '../public/terrain');
const DEM_BIN = path.join(TERRAIN_DIR, 'jikepulin-dem.bin');
const DEM_JSON = path.join(TERRAIN_DIR, 'jikepulin-dem.json');

// ─── 读取 DEM 数据 ───────────────────────────────────────────

function loadDEM() {
  if (!fs.existsSync(DEM_BIN) || !fs.existsSync(DEM_JSON)) {
    console.error('错误: 找不到 DEM 数据文件，请先运行 node scripts/prepare-dem.mjs');
    process.exit(1);
  }

  const meta = JSON.parse(fs.readFileSync(DEM_JSON, 'utf-8'));
  const buffer = fs.readFileSync(DEM_BIN);
  const data = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);

  console.log(`DEM: ${meta.width}x${meta.height}, 高程范围 ${meta.minElevation.toFixed(0)}m - ${meta.maxElevation.toFixed(0)}m`);
  return { data, meta };
}

// ─── Horn 算法计算坡度和朝向 ─────────────────────────────────

/**
 * Horn 算法：使用 3x3 加权差分窗口计算坡度和朝向
 *
 * 窗口编号:
 *   a b c
 *   d e f
 *   g h i
 *
 * dz/dx = ((c + 2f + i) - (a + 2d + g)) / (8 * cellsize_x)
 * dz/dy = ((g + 2h + i) - (a + 2b + c)) / (8 * cellsize_y)
 *
 * slope = atan(sqrt(dz/dx^2 + dz/dy^2))
 * aspect = atan2(-dz/dy, dz/dx)  [从北顺时针]
 */
function computeSlopeAspect(data, width, height, meta) {
  // 将像素尺寸从度转换为米（考虑纬度校正）
  const centerLat = (meta.north + meta.south) / 2;
  const latRad = centerLat * Math.PI / 180;
  const metersPerDegLat = 111320; // 1度纬度 ≈ 111.32km
  const metersPerDegLon = 111320 * Math.cos(latRad);

  const cellSizeX = meta.pixelWidth * metersPerDegLon;  // 米
  const cellSizeY = meta.pixelHeight * metersPerDegLat;  // 米

  console.log(`像素尺寸: ${cellSizeX.toFixed(1)}m x ${cellSizeY.toFixed(1)}m (纬度校正: cos(${centerLat.toFixed(2)}°) = ${Math.cos(latRad).toFixed(4)})`);

  const slopeData = new Float32Array(width * height);
  const aspectData = new Float32Array(width * height);

  // 获取像素值（边界外使用最近边缘值）
  function getZ(row, col) {
    const r = Math.max(0, Math.min(height - 1, row));
    const c = Math.max(0, Math.min(width - 1, col));
    return data[r * width + c];
  }

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = row * width + col;

      // 3x3 窗口
      const a = getZ(row - 1, col - 1);
      const b = getZ(row - 1, col);
      const c = getZ(row - 1, col + 1);
      const d = getZ(row, col - 1);
      // e = getZ(row, col); // 中心像素，Horn 算法不直接使用
      const f = getZ(row, col + 1);
      const g = getZ(row + 1, col - 1);
      const h = getZ(row + 1, col);
      const i = getZ(row + 1, col + 1);

      // Horn 加权差分
      const dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * cellSizeX);
      const dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * cellSizeY);

      // 坡度（度）
      const slopeDeg = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy)) * 180 / Math.PI;
      slopeData[idx] = slopeDeg;

      // 朝向（度，从北顺时针 0-360）
      // 注意：DEM 行方向是北→南，所以 dzdy 的正方向是朝南
      // aspect = atan2(dzdx, -dzdy)，然后转为 0-360
      let aspectDeg = Math.atan2(dzdx, -dzdy) * 180 / Math.PI;
      if (aspectDeg < 0) aspectDeg += 360;

      // 平坦区域（坡度 < 0.5°）朝向设为 -1
      if (slopeDeg < 0.5) {
        aspectData[idx] = -1;
      } else {
        aspectData[idx] = aspectDeg;
      }
    }
  }

  // 统计
  let maxSlope = 0, slopeSum = 0;
  for (let j = 0; j < slopeData.length; j++) {
    if (slopeData[j] > maxSlope) maxSlope = slopeData[j];
    slopeSum += slopeData[j];
  }
  console.log(`坡度范围: 0° - ${maxSlope.toFixed(1)}°, 平均 ${(slopeSum / slopeData.length).toFixed(1)}°`);

  return { slopeData, aspectData };
}

// ─── 色带映射函数 ─────────────────────────────────────────────

/**
 * 坡度色带：与 AvalancheMap.tsx 中的 createSlopeGradientImage() 一致
 * 0-20°: 绿色 (安全), 25-30°: 黄色 (注意), 35-40°: 红色 (高危), 45°+: 紫色 (极陡)
 */
function slopeToRGBA(slopeDeg) {
  const t = Math.min(slopeDeg / 90, 1); // 归一化到 0-1

  // 色带节点
  const stops = [
    { pos: 0,     r: 120, g: 200, b: 120, a: 128 }, // 0° 平地
    { pos: 0.222, r: 180, g: 220, b: 100, a: 153 }, // 20° 低风险
    { pos: 0.278, r: 255, g: 230, b: 0,   a: 191 }, // 25° 注意
    { pos: 0.333, r: 255, g: 180, b: 0,   a: 217 }, // 30° 起始
    { pos: 0.378, r: 255, g: 100, b: 30,  a: 230 }, // 34° 典型触发
    { pos: 0.389, r: 255, g: 50,  b: 30,  a: 235 }, // 35° 最高频
    { pos: 0.444, r: 220, g: 20,  b: 20,  a: 235 }, // 40° 高危
    { pos: 0.5,   r: 180, g: 0,   b: 180, a: 230 }, // 45° 极陡
    { pos: 0.667, r: 140, g: 0,   b: 140, a: 217 }, // 60° 悬崖
    { pos: 1.0,   r: 100, g: 0,   b: 120, a: 204 }, // 90° 垂直
  ];

  // 查找区间并插值
  for (let k = 0; k < stops.length - 1; k++) {
    if (t >= stops[k].pos && t <= stops[k + 1].pos) {
      const ratio = (t - stops[k].pos) / (stops[k + 1].pos - stops[k].pos);
      const s0 = stops[k], s1 = stops[k + 1];
      return {
        r: Math.round(s0.r + (s1.r - s0.r) * ratio),
        g: Math.round(s0.g + (s1.g - s0.g) * ratio),
        b: Math.round(s0.b + (s1.b - s0.b) * ratio),
        a: Math.round(s0.a + (s1.a - s0.a) * ratio),
      };
    }
  }
  const last = stops[stops.length - 1];
  return { r: last.r, g: last.g, b: last.b, a: last.a };
}

/**
 * 朝向色带：8 方向色环（与 AvalancheMap.tsx 中 createAspectGradientImage() 一致）
 * N(0°)=蓝, NE(45°)=浅蓝, E(90°)=白, SE(135°)=暖色, S(180°)=橙,
 * SW(225°)=棕, W(270°)=深灰, NW(315°)=深蓝, 回到 N(360°)=蓝
 */
function aspectToRGBA(aspectDeg) {
  // 平坦区域（-1）=> 全透明
  if (aspectDeg < 0) return { r: 0, g: 0, b: 0, a: 0 };

  const t = (aspectDeg % 360) / 360; // 归一化到 0-1

  const stops = [
    { pos: 0,     r: 0,   g: 100, b: 255 }, // N
    { pos: 0.125, r: 100, g: 200, b: 255 }, // NE
    { pos: 0.25,  r: 240, g: 240, b: 240 }, // E
    { pos: 0.375, r: 255, g: 200, b: 150 }, // SE
    { pos: 0.5,   r: 255, g: 140, b: 0   }, // S
    { pos: 0.625, r: 160, g: 80,  b: 40  }, // SW
    { pos: 0.75,  r: 60,  g: 60,  b: 60  }, // W
    { pos: 0.875, r: 40,  g: 60,  b: 160 }, // NW
    { pos: 1.0,   r: 0,   g: 100, b: 255 }, // N (闭合)
  ];

  for (let k = 0; k < stops.length - 1; k++) {
    if (t >= stops[k].pos && t <= stops[k + 1].pos) {
      const ratio = (t - stops[k].pos) / (stops[k + 1].pos - stops[k].pos);
      const s0 = stops[k], s1 = stops[k + 1];
      return {
        r: Math.round(s0.r + (s1.r - s0.r) * ratio),
        g: Math.round(s0.g + (s1.g - s0.g) * ratio),
        b: Math.round(s0.b + (s1.b - s0.b) * ratio),
        a: 178, // 0.7 alpha
      };
    }
  }
  return { r: 0, g: 100, b: 255, a: 178 };
}

// ─── 生成 PNG 图像 ───────────────────────────────────────────

async function generateSlopePNG(slopeData, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < slopeData.length; i++) {
    const c = slopeToRGBA(slopeData[i]);
    const off = i * 4;
    rgba[off] = c.r;
    rgba[off + 1] = c.g;
    rgba[off + 2] = c.b;
    rgba[off + 3] = c.a;
  }

  const outPath = path.join(TERRAIN_DIR, 'slope.png');
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 6 })
    .toFile(outPath);

  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`  slope.png (${sizeMB} MB)`);
}

async function generateAspectPNG(aspectData, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < aspectData.length; i++) {
    const c = aspectToRGBA(aspectData[i]);
    const off = i * 4;
    rgba[off] = c.r;
    rgba[off + 1] = c.g;
    rgba[off + 2] = c.b;
    rgba[off + 3] = c.a;
  }

  const outPath = path.join(TERRAIN_DIR, 'aspect.png');
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 6 })
    .toFile(outPath);

  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`  aspect.png (${sizeMB} MB)`);
}

// ─── 保存二进制数据 ──────────────────────────────────────────

function saveBinaryData(slopeData, aspectData) {
  const slopePath = path.join(TERRAIN_DIR, 'slope-data.bin');
  const aspectPath = path.join(TERRAIN_DIR, 'aspect-data.bin');

  fs.writeFileSync(slopePath, Buffer.from(slopeData.buffer));
  fs.writeFileSync(aspectPath, Buffer.from(aspectData.buffer));

  const slopeMB = (fs.statSync(slopePath).size / 1024 / 1024).toFixed(2);
  const aspectMB = (fs.statSync(aspectPath).size / 1024 / 1024).toFixed(2);
  console.log(`  slope-data.bin (${slopeMB} MB)`);
  console.log(`  aspect-data.bin (${aspectMB} MB)`);
}

// ─── 主流程 ──────────────────────────────────────────────────

async function main() {
  console.log(`
========================================
  高精度坡度/朝向分析计算
  Horn 算法 (3x3 加权差分)
========================================
`);

  // 1. 加载 DEM
  console.log('[1/3] 加载 DEM 数据...');
  const { data, meta } = loadDEM();

  // 2. 计算坡度和朝向
  console.log('\n[2/3] 计算坡度和朝向 (Horn 算法)...');
  const { slopeData, aspectData } = computeSlopeAspect(data, meta.width, meta.height, meta);

  // 3. 生成输出
  console.log('\n[3/3] 生成输出文件...');
  await generateSlopePNG(slopeData, meta.width, meta.height);
  await generateAspectPNG(aspectData, meta.width, meta.height);
  saveBinaryData(slopeData, aspectData);

  console.log(`
========================================
  分析完成！输出文件:
  - public/terrain/slope.png (坡度可视化)
  - public/terrain/aspect.png (朝向可视化)
  - public/terrain/slope-data.bin (坡度原始数据)
  - public/terrain/aspect-data.bin (朝向原始数据)
========================================
`);
}

main().catch((err) => {
  console.error('错误:', err.message || err);
  process.exit(1);
});
