import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.resolve(DATA_DIR, 'avalanche.db');
const WEATHER_SCHEMA_PATH = path.resolve(__dirname, 'weather-schema.sql');

// 站点预设
const STATION_PRESETS = [
  { name: '山顶气象站', elevation: 2847 },
  { name: 'C1缆车站', elevation: 2650 },
  { name: '中转站', elevation: 2400 },
  { name: '雪道入口', elevation: 2200 },
  { name: '基地营', elevation: 1850 },
];

// 随机选择
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 随机范围整数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机范围小数
function randomFloat(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

// 云量选项
const CLOUD_COVERS = ['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'X'];
const PRECIPITATIONS = ['无', '小雪', '中雪', '大雪', '', ''];
const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const SNOW_TYPES = ['PP', 'DF', 'RG', 'FC', 'DH', 'SH', 'MF', 'IF', 'CR'];
const BLOWING_SNOWS = ['无', '轻度', '中度', '强烈', ''];

// 记录员名字
const RECORDERS = ['张伟', '李明', '王芳', '刘洋', '陈静', '赵强'];

// 生成模拟数据
async function seedWeatherData() {
  console.log('开始生成气象观测模拟数据...');

  // 检查数据库是否存在
  if (!fs.existsSync(DB_PATH)) {
    console.error('数据库不存在，请先运行: npm run db:init');
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 确保表存在
  console.log('确保数据表存在...');
  const weatherSchema = fs.readFileSync(WEATHER_SCHEMA_PATH, 'utf-8');
  db.exec(weatherSchema);

  // 检查是否已有数据
  const existingCount = (db.prepare('SELECT COUNT(*) as count FROM weather_observation_records').get() as { count: number }).count;
  if (existingCount > 0) {
    console.log(`已存在 ${existingCount} 条气象观测记录，跳过生成`);
    db.close();
    return;
  }

  // 生成 15 条记录
  const insertObservation = db.prepare(`
    INSERT INTO weather_observation_records (date, recorder, temp_min, temp_max)
    VALUES (?, ?, ?, ?)
  `);

  const insertStation = db.prepare(`
    INSERT INTO weather_station_data (
      observation_id, name, elevation, observation_time, cloud_cover, precipitation,
      wind_direction, wind_speed, grain_size, surface_snow_type,
      temp_10cm, temp_surface, temp_air, blowing_snow, snow_depth, hst, h24, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date();

  for (let i = 0; i < 15; i++) {
    // 生成日期（过去15天）
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // 基础温度（随日期变化）
    const baseTempMax = randomInt(-5, 2);
    const baseTempMin = baseTempMax - randomInt(5, 12);

    // 插入主记录
    const result = insertObservation.run(
      dateStr,
      randomChoice(RECORDERS),
      baseTempMin,
      baseTempMax
    );
    const observationId = result.lastInsertRowid as number;

    // 随机选择 2-4 个站点
    const numStations = randomInt(2, 4);
    const selectedStations = [...STATION_PRESETS]
      .sort(() => Math.random() - 0.5)
      .slice(0, numStations)
      .sort((a, b) => b.elevation - a.elevation);

    selectedStations.forEach((stationPreset, index) => {
      // 海拔越高温度越低
      const elevationFactor = (stationPreset.elevation - 1850) / 1000;
      const tempAir = baseTempMax - elevationFactor * 6 + randomFloat(-2, 2);
      const tempSurface = tempAir - randomFloat(1, 4);
      const temp10cm = tempSurface - randomFloat(0.5, 2);

      // 雪深随海拔增加
      const baseSnowDepth = 80 + elevationFactor * 60;
      const snowDepth = randomInt(
        Math.floor(baseSnowDepth * 0.8),
        Math.floor(baseSnowDepth * 1.2)
      );

      // 观测时间
      const hour = randomInt(8, 11);
      const minute = randomInt(0, 59);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // 风速随海拔增加
      const windSpeed = randomInt(0, 20) + elevationFactor * 15;

      insertStation.run(
        observationId,
        stationPreset.name,
        stationPreset.elevation,
        timeStr,
        randomChoice(CLOUD_COVERS),
        randomChoice(PRECIPITATIONS),
        randomChoice(WIND_DIRECTIONS),
        windSpeed,
        randomFloat(0.5, 3.0),
        randomChoice(SNOW_TYPES),
        temp10cm,
        tempSurface,
        tempAir,
        randomChoice(BLOWING_SNOWS),
        snowDepth,
        randomInt(0, 1) ? randomInt(10, 50) : null,  // HST
        randomInt(0, 1) ? randomInt(5, 25) : null,   // H24
        index
      );
    });

    console.log(`  生成记录 ${i + 1}/15: ${dateStr}, ${selectedStations.length} 个站点`);
  }

  db.close();
  console.log('\n气象观测模拟数据生成完成！共 15 条记录');
}

seedWeatherData().catch(console.error);
