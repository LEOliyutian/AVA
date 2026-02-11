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

// 雪层观测位置和场景
const OBSERVATION_SITES = [
  { location: '吉克普林 山顶北坡', gps: '43.4521,87.1832', elevation: '2847', aspect: 'N', angle: '38' },
  { location: '吉克普林 C1缆车上方东面', gps: '43.4498,87.1856', elevation: '2720', aspect: 'NE', angle: '35' },
  { location: '吉克普林 山脊线西北', gps: '43.4510,87.1801', elevation: '2780', aspect: 'NW', angle: '40' },
  { location: '吉克普林 中转站上方', gps: '43.4475,87.1878', elevation: '2500', aspect: 'E', angle: '32' },
  { location: '吉克普林 雪道入口南面', gps: '43.4462,87.1890', elevation: '2250', aspect: 'SE', angle: '28' },
  { location: '吉克普林 林线以上凹地', gps: '43.4488,87.1845', elevation: '2400', aspect: 'N', angle: '30' },
  { location: '吉克普林 山顶南坡', gps: '43.4518,87.1840', elevation: '2800', aspect: 'S', angle: '36' },
  { location: '吉克普林 C1缆车下方沟谷', gps: '43.4490,87.1860', elevation: '2600', aspect: 'W', angle: '33' },
  { location: '吉克普林 山脊线东侧', gps: '43.4505,87.1820', elevation: '2750', aspect: 'E', angle: '42' },
  { location: '吉克普林 中转站北面树线', gps: '43.4480,87.1870', elevation: '2350', aspect: 'NW', angle: '25' },
  { location: '吉克普林 高山带开阔坡', gps: '43.4515,87.1815', elevation: '2820', aspect: 'NE', angle: '37' },
  { location: '吉克普林 西沟道', gps: '43.4492,87.1795', elevation: '2550', aspect: 'SW', angle: '34' },
];

// 雪晶体类型及其含义
// PP=新雪 DF=分解风化 RG=圆粒 FC=棱角面晶 DH=深霜 SH=表面霜 MF=融冻 IF=冰层 CR=冰壳
const CRYSTAL_TYPES = ['PP', 'DF', 'RG', 'FC', 'DH', 'SH', 'MF', 'IF', 'CR'];
const HARDNESS_LEVELS = ['F', 'F-4F', '4F', '4F-1F', '1F', '1F-P', 'P', 'P-K', 'K'];
const WETNESS_LEVELS = ['D', 'M', 'W', 'V', 'S'];
const WEATHER_CONDITIONS = ['晴', '多云', '阴', '小雪', '中雪', '大雪', '雾', '阵雪'];
const WIND_DESCRIPTIONS = ['静风', '微风 W 5km/h', '轻风 NW 15km/h', '强风 W 30km/h', '大风 NW 45km/h', '强风 SW 25km/h'];
const BLOWING_SNOW_LEVELS = ['无', '轻度', '中度', '强烈'];
const BOOT_PENETRATIONS = ['5cm', '10cm', '15cm', '20cm', '25cm', '30cm', '40cm', '50cm'];

// 稳定性测试类型
const TEST_TYPES = ['CT', 'ECT', 'RB'] as const;
const CT_RESULTS = ['CTV', 'CTH', 'CTM', 'CTE', 'CTN'];
const ECT_RESULTS = ['ECTPV', 'ECTP', 'ECTN', 'ECTX'];
const RB_RESULTS = ['RB1', 'RB2', 'RB3', 'RB4', 'RB5', 'RB6', 'RB7'];
const QUALITY_LEVELS = ['Q1', 'Q2', 'Q3'];
const WEAK_LAYER_TYPES = ['FC', 'DH', 'SH', 'CR', 'IF'];

// 雪崩预报相关
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
const PRECIPITATION_OPTIONS = ['无', '小雪', '中雪', '大雪', ''];
const BLOWING_SNOW_OPTIONS = ['无', '轻度', '中度', '强烈', ''];

const ELEVATION_BANDS = ['alp', 'tl', 'btl'] as const;
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

const TRENDS = ['steady', 'rising', 'falling'];

// =================== 雪层剖面生成 ===================

function generateSnowLayers(totalDepth: number): any[] {
  const layers: any[] = [];
  let currentDepth = 0;
  const numLayers = randomInt(4, 8);
  const avgThickness = totalDepth / numLayers;

  for (let i = 0; i < numLayers; i++) {
    const thickness = Math.max(5, randomInt(
      Math.floor(avgThickness * 0.5),
      Math.floor(avgThickness * 1.5)
    ));
    const endDepth = Math.min(currentDepth + thickness, totalDepth);

    // 深层通常更硬、更老
    const depthRatio = currentDepth / totalDepth;
    let crystalType: string;
    let hardness: string;

    if (depthRatio < 0.15) {
      // 表面层 - 新雪或分解
      crystalType = randomChoice(['PP', 'DF', 'RG']);
      hardness = randomChoice(['F', 'F-4F', '4F']);
    } else if (depthRatio < 0.4) {
      // 中上层 - 风化/圆粒
      crystalType = randomChoice(['DF', 'RG', 'FC']);
      hardness = randomChoice(['4F', '4F-1F', '1F']);
    } else if (depthRatio < 0.7) {
      // 中层 - 可能出现弱层
      crystalType = randomChoice(['RG', 'FC', 'DH', 'MF']);
      hardness = randomChoice(['1F', '1F-P', 'P', '4F']);
    } else {
      // 深层 - 圆粒/冰壳/深霜
      crystalType = randomChoice(['RG', 'FC', 'DH', 'MF', 'IF']);
      hardness = randomChoice(['P', 'P-K', 'K', '1F-P']);
    }

    // 硬度数值 (F=1, 4F=2, 1F=3, P=4, K=5)
    const hardnessMap: Record<string, number> = {
      'F': 1, 'F-4F': 1.5, '4F': 2, '4F-1F': 2.5,
      '1F': 3, '1F-P': 3.5, 'P': 4, 'P-K': 4.5, 'K': 5
    };
    const hardnessVal = hardnessMap[hardness] || 2;

    const temp = -2 - depthRatio * 8 + randomFloat(-1, 1);

    layers.push({
      start_depth: currentDepth,
      end_depth: endDepth,
      temperature: temp.toFixed(1),
      hardness,
      crystal_type: crystalType,
      grain_size: `${randomFloat(0.5, 3.0)}`,
      wetness: depthRatio > 0.6 ? randomChoice(['D', 'M']) : 'D',
      notes: i === 0 ? '表面层' :
             crystalType === 'DH' ? '深霜弱层' :
             crystalType === 'FC' ? '棱角面晶层' :
             crystalType === 'IF' ? '冰层' : '',
      hardness_top: hardnessVal + randomFloat(-0.3, 0.3),
      hardness_bottom: hardnessVal + randomFloat(-0.3, 0.3),
    });

    currentDepth = endDepth;
    if (currentDepth >= totalDepth) break;
  }

  return layers;
}

// =================== 温度剖面生成 ===================

function generateTemperaturePoints(totalDepth: number): any[] {
  const points: any[] = [];
  const numPoints = randomInt(5, 10);
  const surfaceTemp = randomFloat(-15, -3);
  const baseTemp = randomFloat(-5, -1);
  const gradient = (baseTemp - surfaceTemp) / totalDepth;

  for (let i = 0; i < numPoints; i++) {
    const depth = Math.round((totalDepth / (numPoints - 1)) * i);
    const temp = surfaceTemp + gradient * depth + randomFloat(-0.5, 0.5);
    points.push({
      depth: Math.min(depth, totalDepth),
      temperature: Number(temp.toFixed(1)),
    });
  }

  return points;
}

// =================== 稳定性测试生成 ===================

function generateStabilityTests(totalDepth: number): any[] {
  const numGroups = randomInt(1, 3);
  const groups: any[] = [];

  for (let g = 0; g < numGroups; g++) {
    // 弱层深度（通常在积雪中部或上中部）
    const depth = randomInt(Math.floor(totalDepth * 0.2), Math.floor(totalDepth * 0.7));
    const weakLayerType = randomChoice(WEAK_LAYER_TYPES);

    const tests: any[] = [];
    const numTests = randomInt(1, 3);

    for (let t = 0; t < numTests; t++) {
      const testType = randomChoice(TEST_TYPES);
      const test: any = {
        test_type: testType,
        quality: randomChoice(QUALITY_LEVELS),
        notes: '',
      };

      if (testType === 'CT') {
        const taps = randomInt(1, 30);
        test.taps = taps.toString();
        test.result = randomChoice(CT_RESULTS);
        test.notes = taps <= 10 ? '低敲击数，弱层反应活跃' :
                     taps <= 20 ? '中等敲击数' : '高敲击数，弱层较稳定';
      } else if (testType === 'ECT') {
        const taps = randomInt(1, 30);
        test.taps = taps.toString();
        test.result = randomChoice(ECT_RESULTS);
        test.propagation = test.result.includes('P') ? 'END' : '';
        test.notes = test.result === 'ECTPV' ? '极低敲击即传播，高度不稳定' :
                     test.result === 'ECTP' ? '传播性断裂' :
                     test.result === 'ECTN' ? '断裂但未传播' : '未断裂';
      } else if (testType === 'RB') {
        test.score = randomChoice(RB_RESULTS);
        const scoreNum = parseInt(test.score.replace('RB', ''));
        test.notes = scoreNum <= 2 ? '极不稳定' :
                     scoreNum <= 4 ? '中等稳定性' : '较稳定';
      }

      tests.push(test);
    }

    groups.push({
      depth,
      weak_layer_type: weakLayerType,
      weak_layer_grain_size: `${randomFloat(1.0, 3.0)}`,
      notes: `在${depth}cm深度发现${weakLayerType}弱层`,
      tests,
    });
  }

  return groups;
}

// =================== 结论生成 ===================

function generateConclusion(layers: any[], testGroups: any[], totalDepth: number): string {
  const hasWeakLayer = testGroups.some((g: any) =>
    g.tests.some((t: any) =>
      (t.test_type === 'CT' && parseInt(t.taps) <= 15) ||
      (t.test_type === 'ECT' && (t.result === 'ECTPV' || t.result === 'ECTP')) ||
      (t.test_type === 'RB' && parseInt(t.score?.replace('RB', '') || '7') <= 3)
    )
  );

  const weakLayerTypes = testGroups.map((g: any) => g.weak_layer_type).join('、');
  const depths = testGroups.map((g: any) => `${g.depth}cm`).join('、');

  if (hasWeakLayer) {
    return `雪层剖面总深度${totalDepth}cm。在${depths}深度发现${weakLayerTypes}型弱层，` +
      `稳定性测试显示弱层活跃，存在较高的雪崩风险。` +
      `建议避免在陡坡（>30°）进行活动，特别注意北向和东北向坡面。` +
      `近期降雪和风力搬运增加了风板雪崩的可能性。`;
  } else {
    return `雪层剖面总深度${totalDepth}cm。雪层结构整体较为均匀，` +
      `稳定性测试显示弱层反应不活跃，整体稳定性中等偏好。` +
      `但仍需注意高海拔陡坡区域的风板雪崩风险，` +
      `建议在陡峭地形保持谨慎。`;
  }
}

// =================== 预报摘要生成 ===================

function generateForecastSummary(dangerAlp: number, dangerTl: number, dangerBtl: number, primaryType: string): string {
  const maxDanger = Math.max(dangerAlp, dangerTl, dangerBtl);
  const summaries: Record<number, string[]> = {
    1: [
      '整体雪崩风险低。雪层结构稳定，仅在极端地形可能有小型松散雪崩。可正常开展滑雪活动。',
      '当前危险等级低，积雪整体稳定。注意极陡地形的自然松散雪崩可能。',
    ],
    2: [
      `中等雪崩风险，主要问题为${primaryType}。在特定坡向的陡坡上可能被人为触发。建议避免极端地形，选择坡度较缓的路线。`,
      `存在${primaryType}问题，特别是在高海拔的北向和东北向坡面。谨慎选择路线，避免陡峭凸起地形。`,
    ],
    3: [
      `较高雪崩风险。${primaryType}问题显著，多个坡向存在被人为触发的可能。强烈建议避开所有雪崩路径和陡坡区域。`,
      `当日危险等级较高，${primaryType}在高海拔带尤为活跃。近期降雪和强风增加了不稳定性。限制活动范围至缓坡安全区域。`,
    ],
    4: [
      `高度危险！${primaryType}极为活跃，自然雪崩频发。所有陡坡区域极不稳定，禁止在雪崩路径附近活动。建议关闭受影响区域。`,
      `严重雪崩风险，自然触发和人为触发均极为可能。大范围雪崩活动预期。强烈建议暂停野外活动。`,
    ],
    5: [
      `极度危险！广泛的自然雪崩活动，大型甚至特大型雪崩预期。所有野外活动必须暂停。远离所有雪崩地形。`,
    ],
  };

  return randomChoice(summaries[maxDanger] || summaries[3]);
}

function generateSnowpackObs(dangerLevel: number): string {
  const observations = [
    '近期降雪在高海拔风向坡面形成风板，与老雪面的结合不良。林线以上可观察到明显的风蚀和风积痕迹。',
    '积雪剖面显示在60-80cm深度存在FC弱层，CT测试在12-18次敲击时断裂。弱层分布较广泛。',
    '新雪层与老雪面之间存在SH弱层，ECT测试显示传播性断裂。高海拔北向坡面风险最高。',
    '积雪整体结构良好，经历多次融冻循环后表面形成坚硬冰壳。深层DH弱层活性降低。',
    '过去48小时降雪30-45cm，雪荷载显著增加。新雪与旧雪面结合差，表面雪质松散。',
    '持续寒冷天气促进了近地面深霜的发育。积雪底部DH层厚度增加，潜在不稳定因素持续。',
    '中海拔以下积雪经历日间升温，表面出现轻微湿润。高海拔区域仍为干燥寒冷条件。',
    '西北风持续搬运积雪至东南向坡面，形成硬风板。背风面积雪厚度显著增加。',
    '积雪深度在高海拔达到180-220cm，中海拔120-150cm。整体积雪条件良好，但局部弱层需关注。',
    '高海拔区域表面风蚀明显，裸露的旧雪面上覆盖了薄层新雪。树线以下积雪较为均匀。',
  ];
  return randomChoice(observations);
}

function generateActivityObs(dangerLevel: number): string {
  const observations: Record<number, string[]> = {
    1: [
      '过去24小时未观察到雪崩活动。雪面稳定，仅在极陡岩壁下有小型卸载痕迹。',
      '无明显雪崩活动记录。雪面光滑完整，表面出现日照形成的表面霜。',
    ],
    2: [
      '在高海拔北向陡坡观察到2起小型风板雪崩（D1），推测为自然触发。其余坡面稳定。',
      '巡逻队报告在C1缆车上方发现1处新鲜雪崩碎屑，规模约D1.5。人为触发风险存在。',
    ],
    3: [
      '多处自然雪崩活动：山顶北坡D2风板雪崩1起，西北坡D1.5松散雪崩2起。爆破工作触发D2雪崩1起。',
      '过去24小时内观察到4-6起自然雪崩，主要集中在高海拔北向和东北向坡面。最大规模D2.5。爆破未触发额外雪崩。',
    ],
    4: [
      '广泛雪崩活动。山脊线两侧多起D2-D3自然雪崩。爆破工作在每个控制点均触发了大型雪崩。雪崩碎屑到达沟底。',
      '大范围自然雪崩频发，多起达到D3级别。雪崩路径中可见大量碎屑堆积。路线封闭中。',
    ],
    5: [
      '极端雪崩活动。特大型自然雪崩(D4)从高海拔一直延伸到谷底。所有方向均有活动。',
    ],
  };
  return randomChoice(observations[dangerLevel] || observations[3]);
}

// =================== 扇区生成 ===================

function generateSectors(dangerLevel: number): string[] {
  const sectors: string[] = [];
  const numSectors = Math.min(dangerLevel * 4, 24);

  // 根据危险等级选择受影响的方向
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

async function seedData() {
  console.log('开始生成雪层观测和雪崩预报模拟数据...\n');

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

  // =================== 生成雪层观测记录 ===================

  const existingObs = (db.prepare('SELECT COUNT(*) as count FROM observations').get() as { count: number }).count;
  if (existingObs > 0) {
    console.log(`已存在 ${existingObs} 条雪层观测记录，跳过生成`);
  } else {
    console.log('=== 生成雪层观测记录 ===\n');

    const insertObs = db.prepare(`
      INSERT INTO observations (
        record_id, location_description, observer, observation_date,
        gps_coordinates, elevation, slope_aspect, slope_angle,
        total_snow_depth, air_temperature, weather, boot_penetration,
        wind, blowing_snow, conclusion, diagram_x_axis_side,
        diagram_y_axis_direction, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertLayer = db.prepare(`
      INSERT INTO snow_layers (
        observation_id, start_depth, end_depth, temperature, hardness,
        crystal_type, grain_size, wetness, notes, hardness_top,
        hardness_bottom, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTempPoint = db.prepare(`
      INSERT INTO temperature_points (observation_id, depth, temperature, sort_order)
      VALUES (?, ?, ?, ?)
    `);

    const insertTestGroup = db.prepare(`
      INSERT INTO stability_test_groups (
        observation_id, depth, weak_layer_type, weak_layer_grain_size,
        notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTest = db.prepare(`
      INSERT INTO stability_tests (
        group_id, test_type, taps, result, quality, cut, length,
        propagation, score, notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const numObservations = 12;

    for (let i = 0; i < numObservations; i++) {
      const site = OBSERVATION_SITES[i % OBSERVATION_SITES.length];
      const date = formatDate(daysAgo(i));
      const observer = randomChoice(OBSERVERS);
      const totalDepth = randomInt(100, 230);
      const airTemp = randomFloat(-18, -3);
      const weather = randomChoice(WEATHER_CONDITIONS);
      const wind = randomChoice(WIND_DESCRIPTIONS);
      const blowingSnow = randomChoice(BLOWING_SNOW_LEVELS);
      const bootPen = randomChoice(BOOT_PENETRATIONS);

      // 生成雪层、温度和稳定性测试
      const layers = generateSnowLayers(totalDepth);
      const tempPoints = generateTemperaturePoints(totalDepth);
      const testGroups = generateStabilityTests(totalDepth);
      const conclusion = generateConclusion(layers, testGroups, totalDepth);

      const recordId = `SP-${date.replace(/-/g, '')}-${(i + 1).toString().padStart(3, '0')}`;

      // 插入主记录
      const result = insertObs.run(
        recordId,
        site.location,
        observer,
        date,
        site.gps,
        site.elevation,
        site.aspect,
        site.angle,
        `${totalDepth}cm`,
        `${airTemp}°C`,
        weather,
        bootPen,
        wind,
        blowingSnow,
        conclusion,
        'left',
        'down',
        userId
      );
      const obsId = result.lastInsertRowid as number;

      // 插入雪层
      layers.forEach((layer, idx) => {
        insertLayer.run(
          obsId,
          layer.start_depth, layer.end_depth, layer.temperature,
          layer.hardness, layer.crystal_type, layer.grain_size,
          layer.wetness, layer.notes, layer.hardness_top,
          layer.hardness_bottom, idx
        );
      });

      // 插入温度点
      tempPoints.forEach((pt, idx) => {
        insertTempPoint.run(obsId, pt.depth, pt.temperature, idx);
      });

      // 插入稳定性测试
      testGroups.forEach((group, gIdx) => {
        const gResult = insertTestGroup.run(
          obsId,
          group.depth,
          group.weak_layer_type,
          group.weak_layer_grain_size,
          group.notes,
          gIdx
        );
        const groupId = gResult.lastInsertRowid as number;

        group.tests.forEach((test: any, tIdx: number) => {
          insertTest.run(
            groupId,
            test.test_type,
            test.taps || null,
            test.result || null,
            test.quality || null,
            test.cut || null,
            test.length || null,
            test.propagation || null,
            test.score || null,
            test.notes || null,
            tIdx
          );
        });
      });

      console.log(`  观测 ${i + 1}/${numObservations}: ${recordId} | ${site.location} | ${date} | ${layers.length}层 | ${testGroups.length}组测试`);
    }

    console.log(`\n雪层观测记录生成完成！共 ${numObservations} 条\n`);
  }

  // =================== 生成雪崩预报记录 ===================

  const existingForecasts = (db.prepare('SELECT COUNT(*) as count FROM forecasts').get() as { count: number }).count;
  if (existingForecasts > 0) {
    console.log(`已存在 ${existingForecasts} 条预报记录，跳过生成`);
  } else {
    console.log('=== 生成雪崩预报记录 ===\n');

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

    // 设计 12 天的预报场景（模拟一个风暴周期）
    const scenarios = [
      // 风暴前期 - 低风险
      { daysBack: 11, dangerAlp: 1, dangerTl: 1, dangerBtl: 1, sky: 0, transport: 0, hn24: 0, primaryIdx: 4 },
      { daysBack: 10, dangerAlp: 2, dangerTl: 1, dangerBtl: 1, sky: 1, transport: 0, hn24: 2, primaryIdx: 0 },
      // 风暴来临
      { daysBack: 9, dangerAlp: 2, dangerTl: 2, dangerBtl: 1, sky: 3, transport: 1, hn24: 8, primaryIdx: 1 },
      { daysBack: 8, dangerAlp: 3, dangerTl: 2, dangerBtl: 2, sky: 4, transport: 2, hn24: 15, primaryIdx: 1 },
      // 风暴高峰
      { daysBack: 7, dangerAlp: 3, dangerTl: 3, dangerBtl: 2, sky: 4, transport: 3, hn24: 25, primaryIdx: 0 },
      { daysBack: 6, dangerAlp: 4, dangerTl: 3, dangerBtl: 2, sky: 4, transport: 3, hn24: 30, primaryIdx: 0 },
      // 风暴减弱
      { daysBack: 5, dangerAlp: 3, dangerTl: 3, dangerBtl: 2, sky: 3, transport: 2, hn24: 12, primaryIdx: 2 },
      { daysBack: 4, dangerAlp: 3, dangerTl: 2, dangerBtl: 2, sky: 2, transport: 1, hn24: 5, primaryIdx: 2 },
      // 恢复期
      { daysBack: 3, dangerAlp: 2, dangerTl: 2, dangerBtl: 1, sky: 1, transport: 1, hn24: 0, primaryIdx: 2 },
      { daysBack: 2, dangerAlp: 2, dangerTl: 2, dangerBtl: 1, sky: 0, transport: 0, hn24: 0, primaryIdx: 2 },
      // 新周期
      { daysBack: 1, dangerAlp: 2, dangerTl: 1, dangerBtl: 1, sky: 2, transport: 1, hn24: 3, primaryIdx: 0 },
      { daysBack: 0, dangerAlp: 3, dangerTl: 2, dangerBtl: 1, sky: 3, transport: 2, hn24: 10, primaryIdx: 1 },
    ];

    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i];
      const date = formatDate(daysAgo(s.daysBack));
      const isPublished = s.daysBack > 0; // 过去的都已发布
      const status = isPublished ? 'published' : 'draft';

      const primaryType = AVALANCHE_TYPES[s.primaryIdx];
      const primaryLikelihood = Math.min(s.dangerAlp, 5) as 1 | 2 | 3 | 4 | 5;
      const primarySize = Math.min(Math.max(s.dangerAlp - 1, 1), 5) as 1 | 2 | 3 | 4 | 5;
      const primarySectors = generateSectors(s.dangerAlp);

      // 次要问题（危险等级 >= 3 时启用）
      const secondaryEnabled = s.dangerAlp >= 3;
      const secondaryType = secondaryEnabled ? AVALANCHE_TYPES[(s.primaryIdx + 2) % AVALANCHE_TYPES.length] : null;
      const secondaryLikelihood = secondaryEnabled ? Math.max(primaryLikelihood - 1, 1) : null;
      const secondarySize = secondaryEnabled ? Math.max(primarySize - 1, 1) : null;
      const secondarySectors = secondaryEnabled ? generateSectors(s.dangerAlp - 1) : [];

      const primaryDesc = `${primaryType}是当前主要雪崩问题。` +
        (s.hn24 > 10 ? `过去24小时降雪${s.hn24}cm增加了不稳定性。` : '') +
        `高海拔北向和东北向坡面风险最高。`;

      const secondaryDesc = secondaryEnabled
        ? `${secondaryType}作为次要问题存在，主要影响特定坡向。需持续监测。`
        : null;

      const summary = generateForecastSummary(s.dangerAlp, s.dangerTl, s.dangerBtl, primaryType);
      const snowpackObs = generateSnowpackObs(s.dangerAlp);
      const activityObs = generateActivityObs(s.dangerAlp);

      // 趋势
      const trendAlp = i > 0 && scenarios[i - 1].dangerAlp < s.dangerAlp ? 'rising' :
                       i > 0 && scenarios[i - 1].dangerAlp > s.dangerAlp ? 'falling' : 'steady';
      const trendTl = i > 0 && scenarios[i - 1].dangerTl < s.dangerTl ? 'rising' :
                      i > 0 && scenarios[i - 1].dangerTl > s.dangerTl ? 'falling' : 'steady';
      const trendBtl = i > 0 && scenarios[i - 1].dangerBtl < s.dangerBtl ? 'rising' :
                       i > 0 && scenarios[i - 1].dangerBtl > s.dangerBtl ? 'falling' : 'steady';

      // 插入预报
      const fResult = insertForecast.run(
        date,
        userId,
        status,
        s.dangerAlp,
        s.dangerTl,
        s.dangerBtl,
        trendAlp,
        trendTl,
        trendBtl,
        primaryType,
        primaryLikelihood,
        primarySize,
        JSON.stringify(primarySectors),
        primaryDesc,
        secondaryEnabled ? 1 : 0,
        secondaryType,
        secondaryLikelihood,
        secondarySize,
        secondaryEnabled ? JSON.stringify(secondarySectors) : null,
        secondaryDesc,
        snowpackObs,
        activityObs,
        summary,
        isPublished ? new Date(daysAgo(s.daysBack)).toISOString() : null
      );
      const forecastId = fResult.lastInsertRowid as number;

      // 插入天气数据
      const tempMax = randomInt(-5, 2);
      const tempMin = tempMax - randomInt(5, 12);
      const hst = s.hn24 > 0 ? s.hn24 + randomInt(10, 40) : randomInt(0, 20);
      const hs = randomInt(100, 220);

      insertWeatherData.run(
        forecastId,
        SKY_CONDITIONS[s.sky],
        TRANSPORT_LEVELS[s.transport],
        tempMin,
        tempMax,
        randomChoice(WIND_DIRECTIONS_FULL),
        randomChoice(WIND_SPEEDS),
        s.hn24,
        hst,
        hs
      );

      // 插入气象观测
      const woResult = insertWeatherObs.run(
        forecastId,
        date,
        randomChoice(OBSERVERS),
        tempMin,
        tempMax
      );
      const weatherObsId = woResult.lastInsertRowid as number;

      // 上部站点 (山顶 2847m)
      const upperTempAir = tempMax - 6 + randomFloat(-2, 2);
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
        s.transport >= 2 ? randomChoice(['中度', '强烈']) : randomChoice(['无', '轻度']),
        randomInt(140, 220),
        hst,
        s.hn24 > 0 ? s.hn24 : null
      );

      // 下部站点 (基地营 1850m)
      const lowerTempAir = tempMax + randomFloat(-1, 2);
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
        randomInt(60, 100),
        s.hn24 > 0 ? Math.max(s.hn24 - randomInt(5, 15), 0) : null,
        s.hn24 > 0 ? Math.max(s.hn24 - randomInt(3, 8), 0) : null
      );

      const dangerStr = `ALP:${s.dangerAlp} TL:${s.dangerTl} BTL:${s.dangerBtl}`;
      console.log(`  预报 ${i + 1}/${scenarios.length}: ${date} | ${dangerStr} | ${status} | ${primaryType}`);
    }

    console.log(`\n雪崩预报记录生成完成！共 ${scenarios.length} 条\n`);
  }

  db.close();
  console.log('所有模拟数据生成完成！');
}

seedData().catch(console.error);
