import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.resolve(DATA_DIR, 'avalanche.db');

// =================== 工具函数 ===================

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// =================== 常量定义 ===================

const OBSERVERS = ['张伟', '李明', '王芳', '刘洋', '陈静', '赵强'];

const AVALANCHE_TYPES = [
  '风板雪崩 (Wind Slab)',
  '新雪板状雪崩 (Storm Slab)',
  '持久层板状雪崩 (Persistent Slab)',
  '深层持久层雪崩 (Deep Persistent Slab)',
  '干松状雪崩 (Loose Dry)',
  '湿松状雪崩 (Loose Wet)',
  '湿板状雪崩 (Wet Slab)',
];

const SKY_CONDITIONS = [
  '☀️ 晴朗 CLR',
  '🌤 少量云 FEW',
  '⛅ 散云 SCT',
  '☁️ 多云 BKN',
  '☁️ 阴天 OVC',
  '🌫 无法观测 X',
];

const TRANSPORT_LEVELS = [
  '无风雪搬运 (None)',
  ' 轻度搬运 (Light)',
  ' 中度搬运 (Moderate)',
  ' 强烈搬运 (Intense)',
];

const WIND_DIRECTIONS_FULL = ['北 N', '东北 NE', '东 E', '东南 SE', '南 S', '西南 SW', '西 W', '西北 NW'];
const WIND_SPEEDS = ['静风 (Calm)', '微风 (Light)', '和风 (Moderate)', '强风 (Strong)', '烈风 (Extreme)'];
const WIND_DIR_SIMPLE = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const CLOUD_COVERS = ['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'X'];
const SNOW_TYPES_SURFACE = ['PP', 'DF', 'RG', 'FC', 'DH', 'SH', 'MF', 'IF', 'CR'];
const ELEVATION_BANDS = ['alp', 'tl', 'btl'] as const;
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

// =================== 扇区生成 ===================

function generateSectors(dangerLevel: number): string[] {
  const sectors: string[] = [];
  const numSectors = Math.min(dangerLevel * 4, 24);

  const primaryDirs = dangerLevel >= 3
    ? ['N', 'NE', 'NW', 'E']
    : ['N', 'NE'];

  for (const band of ELEVATION_BANDS) {
    for (const dir of DIRECTIONS) {
      if (primaryDirs.includes(dir) || Math.random() < dangerLevel * 0.08) {
        sectors.push(`${band}_${dir}`);
      }
    }
    if (sectors.length >= numSectors) break;
  }

  return sectors.slice(0, numSectors);
}

// =================== 主函数 ===================

async function seed5Forecasts() {
  console.log('=== 生成 5 份完整雪崩预报测试数据 ===\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('数据库不存在，请先运行: npm run db:init');
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 获取 forecaster 用户 ID
  const forecasterUser = db.prepare("SELECT id FROM users WHERE role IN ('forecaster', 'admin') LIMIT 1").get() as { id: number } | undefined;
  if (!forecasterUser) {
    console.error('没有找到预报员用户，请先运行 db:init');
    db.close();
    process.exit(1);
  }
  const userId = forecasterUser.id;

  // 清除现有预报及关联数据
  console.log('清除现有预报数据...');
  db.exec(`
    DELETE FROM station_observations WHERE weather_observation_id IN (SELECT id FROM weather_observations);
    DELETE FROM weather_observations;
    DELETE FROM weather_data;
    DELETE FROM forecasts;
  `);
  console.log('已清除\n');

  // Prepared statements
  const insertForecast = db.prepare(`
    INSERT INTO forecasts (
      forecast_date, forecaster_id, status,
      danger_alp, danger_tl, danger_btl,
      trend_alp, trend_tl, trend_btl,
      primary_type, primary_likelihood, primary_size, primary_sectors, primary_description,
      secondary_enabled, secondary_type, secondary_likelihood, secondary_size, secondary_sectors, secondary_description,
      snowpack_observation, activity_observation, summary,
      published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertWeatherData = db.prepare(`
    INSERT INTO weather_data (
      forecast_id, sky_condition, transport, temp_min, temp_max,
      wind_direction, wind_speed, hn24, hst, hs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertWeatherObs = db.prepare(`
    INSERT INTO weather_observations (forecast_id, observation_date, recorder, temp_min, temp_max)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertStationObs = db.prepare(`
    INSERT INTO station_observations (
      weather_observation_id, station_type, elevation, observation_time,
      cloud_cover, precipitation, wind_direction, wind_speed,
      grain_size, surface_snow_type, temp_10cm, temp_surface, temp_air,
      blowing_snow, snow_depth, hst, h24
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // =================== 5 份精心设计的预报场景 ===================
  // 模拟一个完整的天气周期：晴天 → 降温风起 → 暴雪高峰 → 风暴减弱 → 回稳
  const scenarios = [
    {
      // 预报 1：5 天前 — 稳定晴天，低风险
      daysBack: 5,
      dangerAlp: 1, dangerTl: 1, dangerBtl: 1,
      trendAlp: 'steady', trendTl: 'steady', trendBtl: 'steady',
      primaryType: '干松状雪崩 (Loose Dry)',
      primaryLikelihood: 1, primarySize: 1,
      secondaryEnabled: false,
      sky: '☀️ 晴朗 CLR',
      transport: '无风雪搬运 (None)',
      hn24: 0,
      windDir: '西 W', windSpeed: '微风 (Light)',
      tempMin: -14, tempMax: -5,
      snowpackObs: '积雪整体结构良好，经历多次融冻循环后表面形成坚硬冰壳。深层DH弱层活性降低。中海拔以下积雪经历日间升温，表面出现轻微湿润。高海拔区域仍为干燥寒冷条件，积雪深度在高海拔达到190cm。',
      activityObs: '过去24小时未观察到雪崩活动。雪面稳定，仅在极陡岩壁下有小型卸载痕迹。滑雪巡逻队确认所有区域稳定。',
      summary: '整体雪崩风险低。雪层结构稳定，仅在极端地形可能有小型松散雪崩。可正常开展滑雪活动，但仍需保持基本安全意识。',
    },
    {
      // 预报 2：4 天前 — 降温、西北风增强，风板开始形成
      daysBack: 4,
      dangerAlp: 2, dangerTl: 2, dangerBtl: 1,
      trendAlp: 'rising', trendTl: 'rising', trendBtl: 'steady',
      primaryType: '风板雪崩 (Wind Slab)',
      primaryLikelihood: 2, primarySize: 2,
      secondaryEnabled: false,
      sky: '⛅ 散云 SCT',
      transport: ' 轻度搬运 (Light)',
      hn24: 5,
      windDir: '西北 NW', windSpeed: '强风 (Strong)',
      tempMin: -18, tempMax: -9,
      snowpackObs: '西北风持续搬运积雪至东南向坡面，形成硬风板。背风面积雪厚度显著增加。在高海拔北向坡面发现新形成的风板，与旧雪面结合一般。林线以上可观察到明显的风蚀和风积痕迹。',
      activityObs: '在高海拔北向陡坡观察到2起小型风板雪崩（D1），推测为自然触发。东北向坡面也发现1处新裂纹。其余坡面稳定。',
      summary: '中等雪崩风险，主要问题为风板雪崩 (Wind Slab)。西北强风将积雪搬运至背风坡形成风板。在特定坡向的陡坡上可能被人为触发。建议避免东南向和东北向陡坡。',
    },
    {
      // 预报 3：3 天前 — 暴雪高峰，大量降雪+强风
      daysBack: 3,
      dangerAlp: 4, dangerTl: 3, dangerBtl: 2,
      trendAlp: 'rising', trendTl: 'rising', trendBtl: 'rising',
      primaryType: '新雪板状雪崩 (Storm Slab)',
      primaryLikelihood: 4, primarySize: 4,
      secondaryEnabled: true,
      secondaryType: '风板雪崩 (Wind Slab)',
      secondaryLikelihood: 3, secondarySize: 3,
      sky: '☁️ 阴天 OVC',
      transport: ' 强烈搬运 (Intense)',
      hn24: 35,
      windDir: '西北 NW', windSpeed: '烈风 (Extreme)',
      tempMin: -22, tempMax: -12,
      snowpackObs: '过去48小时累计降雪达55cm，雪荷载急剧增加。新雪与旧雪面之间存在SH弱层，ECT测试显示传播性断裂。高海拔北向坡面风险极高。西北烈风持续将雪搬运至东南方向，风板厚度急速增加。积雪深度达到230cm以上。',
      activityObs: '广泛雪崩活动。山脊线两侧多起D2-D3自然雪崩。爆破工作在每个控制点均触发了大型雪崩。雪崩碎屑到达沟底。C1缆车上方的大型自然风板雪崩（D3）阻断了巡逻路线。',
      summary: '高度危险！新雪板状雪崩 (Storm Slab)极为活跃，自然雪崩频发。过去48小时降雪55cm叠加强风，所有陡坡区域极不稳定。禁止在雪崩路径附近活动。建议关闭受影响区域。',
    },
    {
      // 预报 4：2 天前 — 降雪减弱，风力下降，但雪层仍不稳定
      daysBack: 2,
      dangerAlp: 3, dangerTl: 3, dangerBtl: 2,
      trendAlp: 'falling', trendTl: 'steady', trendBtl: 'steady',
      primaryType: '持久层板状雪崩 (Persistent Slab)',
      primaryLikelihood: 3, primarySize: 3,
      secondaryEnabled: true,
      secondaryType: '新雪板状雪崩 (Storm Slab)',
      secondaryLikelihood: 2, secondarySize: 2,
      sky: '☁️ 多云 BKN',
      transport: ' 中度搬运 (Moderate)',
      hn24: 8,
      windDir: '西 W', windSpeed: '强风 (Strong)',
      tempMin: -19, tempMax: -10,
      snowpackObs: '风暴后积雪深度达到240cm。积雪剖面显示在60-80cm深度存在FC弱层，CT测试在12-18次敲击时断裂。弱层分布较广泛。近期大量降雪在弱层之上形成了厚重的板状结构，人为触发可能性较高。',
      activityObs: '多处自然雪崩活动：山顶北坡D2风板雪崩1起，西北坡D1.5松散雪崩2起。爆破工作触发D2雪崩1起。过去24小时雪崩活动较前日有所减少，但仍有自然释放。',
      summary: '较高雪崩风险。持久层板状雪崩 (Persistent Slab)问题显著，多个坡向存在被人为触发的可能。虽然降雪减弱，但积雪内部弱层仍活跃。强烈建议避开所有雪崩路径和陡坡区域。',
    },
    {
      // 预报 5：1 天前（昨天）— 转晴回稳，中等风险
      daysBack: 1,
      dangerAlp: 2, dangerTl: 2, dangerBtl: 1,
      trendAlp: 'falling', trendTl: 'falling', trendBtl: 'falling',
      primaryType: '持久层板状雪崩 (Persistent Slab)',
      primaryLikelihood: 2, primarySize: 2,
      secondaryEnabled: false,
      sky: '🌤 少量云 FEW',
      transport: ' 轻度搬运 (Light)',
      hn24: 0,
      windDir: '西南 SW', windSpeed: '和风 (Moderate)',
      tempMin: -16, tempMax: -7,
      snowpackObs: '积雪深度在高海拔达到235cm，中海拔150cm。天气转晴后雪层开始经历沉降过程。新雪层与老雪面的结合逐步改善，但在60cm深度的FC弱层仍可在ECT测试中检测到。高海拔北向坡面弱层反应较前日减弱，整体趋势向稳定方向发展。',
      activityObs: '巡逻队报告在C1缆车上方发现1处新鲜雪崩碎屑，规模约D1.5。北向高海拔坡面仍有零星自然释放，但规模和频率显著下降。其余坡面未观察到活动。',
      summary: '中等雪崩风险，主要问题为持久层板状雪崩 (Persistent Slab)。风暴过后雪层正在沉降稳定，但深层弱层仍需时间恢复。在北向和东北向高海拔陡坡仍需谨慎。建议选择坡度较缓且日照良好的路线。',
    },
  ];

  // 逐条插入
  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const date = formatDate(daysAgo(s.daysBack));

    // 生成扇区
    const primarySectors = generateSectors(s.dangerAlp);
    const secondarySectors = s.secondaryEnabled ? generateSectors(Math.max(s.dangerAlp - 1, 1)) : [];

    const primaryDesc = `${s.primaryType}是当前主要雪崩问题。` +
      (s.hn24 > 10 ? `过去24小时降雪${s.hn24}cm显著增加了不稳定性。` : s.hn24 > 0 ? `过去24小时降雪${s.hn24}cm。` : '') +
      `高海拔北向和东北向坡面风险最高。建议关注背风坡和凸起地形。`;

    const secondaryDesc = s.secondaryEnabled
      ? `${s.secondaryType}作为次要问题存在，主要影响特定坡向。随着风力减弱，此问题有望逐步缓解，但需持续监测。`
      : null;

    // 插入预报
    const fResult = insertForecast.run(
      date,
      userId,
      'published',
      s.dangerAlp, s.dangerTl, s.dangerBtl,
      s.trendAlp, s.trendTl, s.trendBtl,
      s.primaryType,
      s.primaryLikelihood,
      s.primarySize,
      JSON.stringify(primarySectors),
      primaryDesc,
      s.secondaryEnabled ? 1 : 0,
      s.secondaryEnabled ? s.secondaryType! : null,
      s.secondaryEnabled ? s.secondaryLikelihood! : null,
      s.secondaryEnabled ? s.secondarySize! : null,
      s.secondaryEnabled ? JSON.stringify(secondarySectors) : null,
      secondaryDesc,
      s.snowpackObs,
      s.activityObs,
      s.summary,
      new Date(daysAgo(s.daysBack)).toISOString()
    );
    const forecastId = fResult.lastInsertRowid as number;

    // 插入天气数据
    const hst = s.hn24 > 0 ? s.hn24 + randomInt(10, 40) : randomInt(0, 15);
    const hs = randomInt(150, 240);

    insertWeatherData.run(
      forecastId,
      s.sky,
      s.transport,
      s.tempMin,
      s.tempMax,
      s.windDir,
      s.windSpeed,
      s.hn24,
      hst,
      hs
    );

    // 插入气象观测
    const recorder = randomChoice(OBSERVERS);
    const woResult = insertWeatherObs.run(
      forecastId,
      date,
      recorder,
      s.tempMin,
      s.tempMax
    );
    const weatherObsId = woResult.lastInsertRowid as number;

    // 上部站点 (山顶 2847m)
    const upperTempAir = s.tempMax - 6 + randomFloat(-2, 2);
    insertStationObs.run(
      weatherObsId,
      'upper',
      2847,
      `${randomInt(8, 10)}:${randomInt(0, 59).toString().padStart(2, '0')}`,
      randomChoice(CLOUD_COVERS),
      s.hn24 > 5 ? randomChoice(['小雪', '中雪', '大雪']) : randomChoice(['无', '', '小雪']),
      randomChoice(WIND_DIR_SIMPLE),
      randomFloat(10, 50),
      randomFloat(0.5, 3.0),
      randomChoice(SNOW_TYPES_SURFACE),
      upperTempAir - randomFloat(2, 4),
      upperTempAir - randomFloat(1, 3),
      upperTempAir,
      s.hn24 >= 20 ? randomChoice(['中度', '强烈']) : s.hn24 > 0 ? randomChoice(['轻度', '中度']) : randomChoice(['无', '轻度']),
      randomInt(160, 240),
      hst,
      s.hn24 > 0 ? s.hn24 : null
    );

    // 下部站点 (基地营 1850m)
    const lowerTempAir = s.tempMax + randomFloat(-1, 2);
    insertStationObs.run(
      weatherObsId,
      'lower',
      1850,
      `${randomInt(8, 10)}:${randomInt(0, 59).toString().padStart(2, '0')}`,
      randomChoice(CLOUD_COVERS),
      s.hn24 > 10 ? randomChoice(['小雪', '中雪']) : randomChoice(['无', '']),
      randomChoice(WIND_DIR_SIMPLE),
      randomFloat(0, 15),
      randomFloat(0.5, 2.0),
      randomChoice(SNOW_TYPES_SURFACE),
      lowerTempAir - randomFloat(1, 3),
      lowerTempAir - randomFloat(0.5, 2),
      lowerTempAir,
      randomChoice(['无', '轻度', '']),
      randomInt(60, 110),
      s.hn24 > 0 ? Math.max(s.hn24 - randomInt(5, 15), 0) : null,
      s.hn24 > 0 ? Math.max(s.hn24 - randomInt(3, 8), 0) : null
    );

    const dangerStr = `ALP:${s.dangerAlp} TL:${s.dangerTl} BTL:${s.dangerBtl}`;
    console.log(`  预报 ${i + 1}/5: ${date} | ${dangerStr} | ${s.primaryType}`);
  }

  db.close();
  console.log('\n5 份雪崩预报数据生成完成！');
}

seed5Forecasts().catch(console.error);
