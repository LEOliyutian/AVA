import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy questions (20)
  {
    id: 'ct-001',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '新降雪晶体的主要特征是什么？',
    options: [
      { id: 'a', text: '棱角分明、枝状结构' },
      { id: 'b', text: '圆润光滑' },
      { id: 'c', text: '大颗粒结晶' },
      { id: 'd', text: '结冰硬壳' }
    ],
    correctAnswer: 'a',
    explanation: '新雪晶体刚降落时保持原始的星状、针状或板状结构，棱角分明。',
    keyTakeaway: '新雪具有复杂的枝状结构和尖锐的棱角',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-002',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '圆粒雪比新雪晶体更稳定。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '等温变质过程使雪晶棱角圆化，颗粒间结合增强，积雪变得更加稳定。',
    keyTakeaway: '圆化过程增强积雪稳定性',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-003',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '深霜（depth hoar）通常形成于雪层的哪个位置？',
    options: [
      { id: 'a', text: '雪层表面' },
      { id: 'b', text: '雪层底部' },
      { id: 'c', text: '雪层中部' },
      { id: 'd', text: '随机分布' }
    ],
    correctAnswer: 'b',
    explanation: '深霜在雪层底部形成，因为地面温度较高，造成强烈的温度梯度。',
    keyTakeaway: '深霜形成于雪层底部',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-004',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '表面霜（surface hoar）的形成条件是？',
    options: [
      { id: 'a', text: '降雪期间' },
      { id: 'b', text: '晴朗夜晚的辐射冷却' },
      { id: 'c', text: '强风天气' },
      { id: 'd', text: '暴雨过后' }
    ],
    correctAnswer: 'b',
    explanation: '表面霜在晴朗、无风的夜晚，通过辐射冷却和水汽凝华在雪面形成。',
    keyTakeaway: '表面霜需要晴朗无风的夜晚形成',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-005',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '风壳（wind crust）是由风吹压实雪面形成的硬壳层。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '风壳由强风机械压实和破碎雪晶，在雪表面形成坚硬的壳层。',
    keyTakeaway: '风壳由风力机械作用形成',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-006',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '温度梯度变质（TG metamorphism）需要什么条件？',
    options: [
      { id: 'a', text: '雪层内温度均匀' },
      { id: 'b', text: '雪层内存在温度差异' },
      { id: 'c', text: '雪层完全冻结' },
      { id: 'd', text: '雪层正在融化' }
    ],
    correctAnswer: 'b',
    explanation: '温度梯度变质需要雪层内部存在温度梯度（通常>10°C/m），驱动水汽迁移。',
    keyTakeaway: '温度梯度是TG变质的驱动力',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-007',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '等温变质（ET metamorphism）的主要特征是？',
    options: [
      { id: 'a', text: '雪晶棱角圆化' },
      { id: 'b', text: '形成棱角雪' },
      { id: 'c', text: '形成深霜' },
      { id: 'd', text: '雪层融化' }
    ],
    correctAnswer: 'a',
    explanation: '等温变质在温度梯度较小时发生，使雪晶棱角逐渐圆化，形成圆粒雪。',
    keyTakeaway: '等温变质使雪晶圆化',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-008',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '雨壳（rain crust）是雨水渗入雪层后重新冻结形成的。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雨壳由液态降水渗入雪层，随后气温下降重新冻结形成坚硬的冰壳。',
    keyTakeaway: '雨壳由雨水冻结形成',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-009',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '棱角雪（faceted crystals）的主要危险是？',
    options: [
      { id: 'a', text: '增强积雪稳定性' },
      { id: 'b', text: '形成持久性弱层' },
      { id: 'c', text: '加速雪层融化' },
      { id: 'd', text: '防止雪崩发生' }
    ],
    correctAnswer: 'b',
    explanation: '棱角雪颗粒间结合力弱，容易形成持久性弱层，增加雪崩风险。',
    keyTakeaway: '棱角雪形成危险的弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-010',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '冻融壳（melt-freeze crust）形成的典型季节是？',
    options: [
      { id: 'a', text: '深冬' },
      { id: 'b', text: '初秋' },
      { id: 'c', text: '春季或日温差大的时期' },
      { id: 'd', text: '盛夏' }
    ],
    correctAnswer: 'c',
    explanation: '冻融壳在白天融化、夜间冻结的循环中形成，常见于春季或日温差大的时期。',
    keyTakeaway: '冻融壳形成于融化-冻结循环',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-011',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '颗粒越大的雪晶通常强度越高。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '雪晶强度主要取决于颗粒间的结合（烧结），而非颗粒大小。大颗粒如深霜反而很弱。',
    keyTakeaway: '颗粒大小不等于强度',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-012',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '雪晶的烧结（sintering）过程指的是？',
    options: [
      { id: 'a', text: '雪晶融化' },
      { id: 'b', text: '雪晶破碎' },
      { id: 'c', text: '雪晶颗粒间形成连接' },
      { id: 'd', text: '雪晶蒸发' }
    ],
    correctAnswer: 'c',
    explanation: '烧结是雪晶颗粒间通过水汽迁移和重结晶形成固态连接的过程，增强积雪强度。',
    keyTakeaway: '烧结增强颗粒间结合',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-013',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '以下哪种雪晶类型最容易形成弱层？',
    options: [
      { id: 'a', text: '圆粒雪' },
      { id: 'b', text: '深霜' },
      { id: 'c', text: '冻融壳' },
      { id: 'd', text: '风板' }
    ],
    correctAnswer: 'b',
    explanation: '深霜是最典型的持久性弱层，颗粒大、棱角尖、结合弱，可持续数月。',
    keyTakeaway: '深霜是最危险的弱层类型',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-014',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '新雪的密度通常比圆粒雪低。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '新雪结构疏松，密度约50-150 kg/m³，而圆粒雪经过压实和变质，密度更高。',
    keyTakeaway: '新雪密度较低',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-015',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '表面霜被埋藏后会发生什么？',
    options: [
      { id: 'a', text: '立即消失' },
      { id: 'b', text: '转变为圆粒雪' },
      { id: 'c', text: '形成持久性弱层' },
      { id: 'd', text: '增强雪层稳定性' }
    ],
    correctAnswer: 'c',
    explanation: '表面霜结构脆弱，被新雪埋藏后保持低强度，成为危险的持久性弱层。',
    keyTakeaway: '埋藏的表面霜是危险弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-016',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '雪粒的硬度通常用什么工具测量？',
    options: [
      { id: 'a', text: '温度计' },
      { id: 'b', text: '手或铅笔等硬度级' },
      { id: 'c', text: '天平' },
      { id: 'd', text: '尺子' }
    ],
    correctAnswer: 'b',
    explanation: '雪层硬度用手或工具（拳、指、铅笔、刀）按压的阻力分级，这是雪剖面观测的标准方法。',
    keyTakeaway: '硬度用手/工具分级测量',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-017',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '温度梯度越大，形成棱角雪的速度越快。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '温度梯度驱动水汽迁移速度，梯度越大（>20°C/m），棱角雪形成越快。',
    keyTakeaway: '高温度梯度加速棱角雪形成',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-018',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '以下哪种情况最可能导致深霜形成？',
    options: [
      { id: 'a', text: '厚雪层覆盖' },
      { id: 'b', text: '薄雪层覆盖在冷地面上' },
      { id: 'c', text: '持续降雪' },
      { id: 'd', text: '雪层完全融化' }
    ],
    correctAnswer: 'b',
    explanation: '薄雪层无法隔热，地面热量向上传递，形成强温度梯度，利于深霜发育。',
    keyTakeaway: '薄雪层易形成深霜',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-019',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '雪晶粒径通常用什么单位表示？',
    options: [
      { id: 'a', text: '米（m）' },
      { id: 'b', text: '毫米（mm）' },
      { id: 'c', text: '厘米（cm）' },
      { id: 'd', text: '微米（μm）' }
    ],
    correctAnswer: 'b',
    explanation: '雪晶粒径通常在0.2-5毫米范围，用mm表示最方便。深霜可达5-20mm。',
    keyTakeaway: '雪晶粒径用毫米表示',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-020',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'easy',
    question: '所有的雪壳（crusts）都会增强雪层稳定性。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '雪壳本身很硬，但其上下界面可能成为滑动面，且壳下可能有弱层。',
    keyTakeaway: '雪壳可能形成滑动界面',
    relatedPage: '/safety/crystal-types'
  },

  // Medium questions (25)
  {
    id: 'ct-021',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '等温变质过程中，小雪晶和大雪晶之间会发生什么？',
    options: [
      { id: 'a', text: '小雪晶生长，大雪晶缩小' },
      { id: 'b', text: '大雪晶生长，小雪晶缩小' },
      { id: 'c', text: '所有雪晶同步生长' },
      { id: 'd', text: '雪晶大小不变' }
    ],
    correctAnswer: 'b',
    explanation: '等温变质遵循开尔文效应：曲率大的小晶体升华，水汽在曲率小的大晶体上凝华，实现能量最小化。',
    keyTakeaway: '等温变质中大雪晶吞噬小雪晶',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-022',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '以下哪些因素会加速温度梯度变质？（多选）',
    options: [
      { id: 'a', text: '薄雪层' },
      { id: 'b', text: '厚雪层' },
      { id: 'c', text: '寒冷气温' },
      { id: 'd', text: '温暖地面' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: '薄雪层隔热差，寒冷气温和温暖地面增大温差，都会增强温度梯度，加速TG变质。',
    keyTakeaway: '薄雪层、大温差加速TG变质',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-023',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '雪剖面显示：雪层底部20cm为1-2mm圆粒雪，上部30cm为新雪，中间有5cm的4-6mm杯状晶体层。',
    question: '这个杯状晶体层最可能是如何形成的？',
    options: [
      { id: 'a', text: '等温变质形成' },
      { id: 'b', text: '风力作用形成' },
      { id: 'c', text: '温度梯度变质形成的深霜或棱角雪' },
      { id: 'd', text: '雨水冻结形成' }
    ],
    correctAnswer: 'c',
    explanation: '杯状晶体（4-6mm大颗粒）是典型的温度梯度变质产物，说明该层经历了强烈的TG变质。',
    keyTakeaway: '大颗粒杯状晶体指示TG变质',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-024',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '表面霜的典型晶体形态是？',
    options: [
      { id: 'a', text: '球形颗粒' },
      { id: 'b', text: '羽毛状或杯状' },
      { id: 'c', text: '板状' },
      { id: 'd', text: '针状' }
    ],
    correctAnswer: 'b',
    explanation: '表面霜通过水汽直接凝华形成，呈现羽毛状、树枝状或杯状的大型晶体结构。',
    keyTakeaway: '表面霜呈羽毛或杯状',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-025',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '温度梯度多大时会发生明显的TG变质？',
    options: [
      { id: 'a', text: '>5°C/m' },
      { id: 'b', text: '>10°C/m' },
      { id: 'c', text: '>20°C/m' },
      { id: 'd', text: '>50°C/m' }
    ],
    correctAnswer: 'b',
    explanation: '当温度梯度超过10°C/m时，TG变质开始明显；超过20°C/m时，深霜快速形成。',
    keyTakeaway: '临界梯度约10°C/m',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-026',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '1月初连续晴朗无风，夜间气温-15°C，白天-5°C。雪面观察到大量羽毛状晶体。',
    question: '三天后降雪30cm，这个羽毛状晶体层的雪崩危险如何？',
    options: [
      { id: 'a', text: '无危险，会迅速强化' },
      { id: 'b', text: '中等危险，需要观察' },
      { id: 'c', text: '高危险，形成明显弱层' },
      { id: 'd', text: '危险随时间增加' }
    ],
    correctAnswer: 'c',
    explanation: '埋藏的表面霜（羽毛状晶体）是典型的持久性弱层，新雪荷载会在此界面触发雪崩。',
    keyTakeaway: '埋藏的表面霜是高危弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-027',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '冻融壳上新降雪的主要危险是？',
    options: [
      { id: 'a', text: '壳层破碎' },
      { id: 'b', text: '壳面形成滑动面' },
      { id: 'c', text: '雪层过重' },
      { id: 'd', text: '温度升高' }
    ],
    correctAnswer: 'b',
    explanation: '光滑的冻融壳面与上层新雪结合差，容易成为滑动面，触发面层雪崩。',
    keyTakeaway: '壳面是潜在滑动界面',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-028',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '深霜一旦形成，即使后续温度稳定也很难强化。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '深霜的大颗粒棱角结构很难通过烧结强化，可作为弱层持续整个冬季。',
    keyTakeaway: '深霜是持久性弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-029',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '以下哪些雪晶类型属于温度梯度变质产物？（多选）',
    options: [
      { id: 'a', text: '深霜' },
      { id: 'b', text: '圆粒雪' },
      { id: 'c', text: '棱角雪' },
      { id: 'd', text: '表面霜' }
    ],
    correctAnswer: ['a', 'c'],
    explanation: '深霜和棱角雪都是温度梯度变质的产物；圆粒雪来自等温变质；表面霜是表面凝华。',
    keyTakeaway: 'TG变质产生深霜和棱角雪',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-030',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '雪晶的"动力学形态"（kinetic growth）指的是？',
    options: [
      { id: 'a', text: '风力作用下的形态' },
      { id: 'b', text: '温度梯度下快速生长的棱角形态' },
      { id: 'c', text: '融化后的形态' },
      { id: 'd', text: '压实后的形态' }
    ],
    correctAnswer: 'b',
    explanation: '动力学生长发生在强温度梯度下，水汽快速迁移形成棱角分明的晶体结构。',
    keyTakeaway: '动力学生长形成棱角雪',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-031',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '雪剖面测得雪层底部温度-5°C，雪面温度-25°C，雪深50cm。',
    question: '这个雪层的温度梯度约为多少？是否利于深霜形成？',
    options: [
      { id: 'a', text: '10°C/m，不利于深霜形成' },
      { id: 'b', text: '20°C/m，有利于深霜形成' },
      { id: 'c', text: '40°C/m，非常利于深霜形成' },
      { id: 'd', text: '5°C/m，不会形成深霜' }
    ],
    correctAnswer: 'c',
    explanation: '温度梯度 = (25-5)°C / 0.5m = 40°C/m，远超20°C/m临界值，深霜会快速形成。',
    keyTakeaway: '计算温度梯度判断TG变质',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-032',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '风板（wind slab）与风壳（wind crust）的主要区别是？',
    options: [
      { id: 'a', text: '形成时间不同' },
      { id: 'b', text: '硬度不同，风壳更硬' },
      { id: 'c', text: '位置不同' },
      { id: 'd', text: '颜色不同' }
    ],
    correctAnswer: 'b',
    explanation: '风板是压实但仍可穿透的雪层；风壳是表面极硬、难以穿透的薄壳。',
    keyTakeaway: '风壳比风板硬得多',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-033',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '雪晶的"平衡形态"（equilibrium growth）发生在？',
    options: [
      { id: 'a', text: '强温度梯度下' },
      { id: 'b', text: '弱温度梯度或等温条件下' },
      { id: 'c', text: '融化过程中' },
      { id: 'd', text: '降雪时' }
    ],
    correctAnswer: 'b',
    explanation: '平衡生长发生在等温或弱梯度条件下，形成圆化的、能量最小化的形态。',
    keyTakeaway: '等温条件下平衡生长',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-034',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '晴朗夜晚的辐射冷却可以在雪面以下形成近地表棱角雪。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '辐射冷却使雪面温度骤降，在雪面下数厘米形成强温度梯度，产生近地表棱角雪。',
    keyTakeaway: '辐射冷却可形成近地表弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-035',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '以下哪些是持久性弱层的典型特征？（多选）',
    options: [
      { id: 'a', text: '大颗粒尺寸' },
      { id: 'b', text: '棱角形态' },
      { id: 'c', text: '颗粒间弱结合' },
      { id: 'd', text: '圆润形态' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '持久性弱层通常具有大颗粒、棱角形态和弱结合，如深霜、表面霜、棱角雪。',
    keyTakeaway: '大、棱角、弱结合=持久弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-036',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '春季白天气温+5°C，雪面开始融化；夜间降至-8°C。',
    question: '这种条件下最可能形成什么结构？',
    options: [
      { id: 'a', text: '深霜' },
      { id: 'b', text: '冻融壳' },
      { id: 'c', text: '表面霜' },
      { id: 'd', text: '风壳' }
    ],
    correctAnswer: 'b',
    explanation: '日间融化-夜间冻结的循环是冻融壳形成的典型条件，常见于春季。',
    keyTakeaway: '融化-冻结循环形成冻融壳',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-037',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '雪晶粒径从0.5mm增长到5mm通常需要多长时间（在强TG条件下）？',
    options: [
      { id: 'a', text: '数小时' },
      { id: 'b', text: '1-2天' },
      { id: 'c', text: '1-2周' },
      { id: 'd', text: '1-2月' }
    ],
    correctAnswer: 'c',
    explanation: '即使在强温度梯度下，深霜从小颗粒生长到大颗粒也需要1-2周时间。',
    keyTakeaway: '深霜生长需数周时间',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-038',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '雪层硬度分级中，"4F"（Four Finger）表示？',
    options: [
      { id: 'a', text: '非常软，拳头易穿透' },
      { id: 'b', text: '软，四指可穿透' },
      { id: 'c', text: '中等，一指可穿透' },
      { id: 'd', text: '硬，铅笔可穿透' }
    ],
    correctAnswer: 'b',
    explanation: '4F表示需要四指用力才能穿透的雪层，属于中等偏软硬度。',
    keyTakeaway: '硬度分级：拳→4指→1指→铅笔→刀',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-039',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '观察到雪剖面中有一层2-3mm的棱角雪，形成于两周前的寒流之后。',
    question: '这层棱角雪最可能的危险期是？',
    options: [
      { id: 'a', text: '形成后立即危险' },
      { id: 'b', text: '形成后1-3天最危险' },
      { id: 'c', text: '当上方有新增荷载时危险' },
      { id: 'd', text: '已经完全稳定，无危险' }
    ],
    correctAnswer: 'c',
    explanation: '棱角雪形成后相对稳定，但当上方新增雪荷载或受到扰动时，易在此弱层破坏。',
    keyTakeaway: '弱层在新增荷载时最危险',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-040',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '湿雪变质过程会导致雪晶快速圆化和增大。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '当雪层含水后，液态水加速雪晶的圆化和聚合，形成大颗粒湿雪团聚体。',
    keyTakeaway: '湿雪变质加速圆化',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-041',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '阴坡和阳坡的雪晶变质速度差异主要因为？',
    options: [
      { id: 'a', text: '风速不同' },
      { id: 'b', text: '接受太阳辐射不同' },
      { id: 'c', text: '降雪量不同' },
      { id: 'd', text: '海拔不同' }
    ],
    correctAnswer: 'b',
    explanation: '阳坡接受更多太阳辐射，温度更高且波动大，影响变质类型和速度；阴坡更冷，利于TG变质。',
    keyTakeaway: '坡向影响雪晶变质类型',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-042',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '以下哪些观测可以判断存在深霜？（多选）',
    options: [
      { id: 'a', text: '雪剖面中颗粒尺寸>5mm' },
      { id: 'b', text: '杯状或棱柱状晶体' },
      { id: 'c', text: '雪层底部糖粒状质感' },
      { id: 'd', text: '圆润光滑颗粒' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '深霜特征：大颗粒（>5mm）、杯状/棱柱状、糖粒质感、弱结合、位于雪层底部。',
    keyTakeaway: '深霜：大、杯状、糖粒感',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-043',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '新雪变质为圆粒雪通常需要多长时间（在0°C附近等温条件下）？',
    options: [
      { id: 'a', text: '数小时' },
      { id: 'b', text: '1-3天' },
      { id: 'c', text: '1-2周' },
      { id: 'd', text: '1-2月' }
    ],
    correctAnswer: 'b',
    explanation: '在0°C附近的等温条件下，新雪的棱角圆化较快，通常1-3天可观察到明显圆化。',
    keyTakeaway: '等温变质需数天至数周',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-044',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'medium',
    scenarioContext: '雪剖面显示一个光滑的冰壳层，厚约2cm，上方20cm为疏松新雪。',
    question: '进行雪崩评估时应特别关注什么？',
    options: [
      { id: 'a', text: '冰壳的厚度' },
      { id: 'b', text: '冰壳上下界面的结合强度' },
      { id: 'c', text: '新雪的密度' },
      { id: 'd', text: '冰壳的形成时间' }
    ],
    correctAnswer: 'b',
    explanation: '冰壳与上方新雪的界面是关键：光滑的壳面可能成为滑动面，触发面层雪崩。',
    keyTakeaway: '冰壳界面是关键弱点',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-045',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'medium',
    question: '森林地带与开阔地相比，深霜发育程度通常？',
    options: [
      { id: 'a', text: '森林地带深霜更发达' },
      { id: 'b', text: '开阔地深霜更发达' },
      { id: 'c', text: '两者无差异' },
      { id: 'd', text: '森林地带不会形成深霜' }
    ],
    correctAnswer: 'b',
    explanation: '开阔地雪深较浅（风吹）、辐射冷却强，温度梯度更大，深霜更发达。森林保温隔热。',
    keyTakeaway: '开阔地利于深霜形成',
    relatedPage: '/safety/crystal-types'
  },

  // Hard questions (15)
  {
    id: 'ct-046',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'hard',
    scenarioContext: '雪剖面观测：0-30cm新雪（1mm颗粒），30-35cm表面霜层（8mm羽毛状），35-80cm圆粒雪（0.5mm），80-100cm底部深霜（10mm杯状）。压缩测试CT18@35cm SP。',
    question: '这个雪层结构中，哪个界面的雪崩风险最高？',
    options: [
      { id: 'a', text: '0-30cm新雪层内' },
      { id: 'b', text: '30cm处的表面霜层' },
      { id: 'c', text: '35-80cm圆粒雪层' },
      { id: 'd', text: '80cm处的深霜层' }
    ],
    correctAnswer: 'b',
    explanation: 'CT18（18次轻敲破坏）SP（突然平面破坏）表明35cm表面霜层是活跃弱层，当前最危险。底部深霜虽弱但埋藏深、荷载大，需更强触发。',
    keyTakeaway: '稳定性测试定位活跃弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-047',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '温度梯度变质过程中水汽迁移的驱动机制包括？（多选）',
    options: [
      { id: 'a', text: '温度梯度导致的饱和蒸汽压差' },
      { id: 'b', text: '曲率效应（开尔文效应）' },
      { id: 'c', text: '重力作用' },
      { id: 'd', text: '孔隙空气对流' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'TG变质的驱动包括：温度梯度引起的蒸汽压差（主要）、曲率差异、孔隙空气对流。重力不直接驱动水汽迁移。',
    keyTakeaway: 'TG变质有多重物理机制',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-048',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '以下哪种情况最可能导致"近地表棱角雪"转变回圆粒雪？',
    options: [
      { id: 'a', text: '降雪增厚雪层' },
      { id: 'b', text: '气温升高至接近0°C' },
      { id: 'c', text: '持续晴朗天气' },
      { id: 'd', text: '强风天气' }
    ],
    correctAnswer: 'b',
    explanation: '当气温升高至0°C附近，温度梯度减小，等温变质主导，棱角雪可能缓慢圆化。但实际中这个逆转过程很慢。',
    keyTakeaway: '温暖等温条件可能逆转TG变质',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-049',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'hard',
    scenarioContext: '两个观测点距离500m，海拔相同。A点阳坡雪深40cm，B点阴坡雪深60cm。两处都有初冬早期降雪形成的基底雪层。',
    question: '哪个点更可能发育出危险的深霜弱层？',
    options: [
      { id: 'a', text: 'A点（阳坡，薄雪层）' },
      { id: 'b', text: 'B点（阴坡，厚雪层）' },
      { id: 'c', text: '两者相同' },
      { id: 'd', text: '都不会形成深霜' }
    ],
    correctAnswer: 'a',
    explanation: 'A点雪薄（温度梯度大）且阳坡温度波动大（夜间冷却强），利于深霜形成。B点雪厚（隔热好），梯度较小。',
    keyTakeaway: '薄雪层+辐射冷却=深霜高发',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-050',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '雪晶的"烧结速率"与以下哪个因素关系最密切？',
    options: [
      { id: 'a', text: '雪晶颜色' },
      { id: 'b', text: '温度（接近熔点时最快）' },
      { id: 'c', text: '雪层厚度' },
      { id: 'd', text: '风速' }
    ],
    correctAnswer: 'b',
    explanation: '烧结速率与温度呈指数关系，在-5°C到0°C之间最快，因为水汽压和分子扩散速率增加。',
    keyTakeaway: '接近0°C时烧结最快',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-051',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '评估埋藏的表面霜层危险性时，应考虑哪些因素？（多选）',
    options: [
      { id: 'a', text: '表面霜晶体尺寸' },
      { id: 'b', text: '埋藏深度' },
      { id: 'c', text: '上覆雪荷载大小' },
      { id: 'd', text: '埋藏后经过的时间' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '所有因素都重要：晶体越大越弱；浅层更易触发；荷载大剪应力大；但时间久也可能缓慢强化或深埋难触发。',
    keyTakeaway: '弱层评估需综合多因素',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-052',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'hard',
    scenarioContext: '3月中旬连续晴天，白天气温+8°C，夜间-6°C。雪面有3-5cm融化层。',
    question: '数天后形成的冻融壳对后续降雪的稳定性影响最可能是？',
    options: [
      { id: 'a', text: '显著增强稳定性' },
      { id: 'b', text: '短期降低稳定性（滑动面），但中期可能增强' },
      { id: 'c', text: '无影响' },
      { id: 'd', text: '持续降低稳定性' }
    ],
    correctAnswer: 'b',
    explanation: '冻融壳初期光滑，与新雪结合差，形成滑动面（面层雪崩）。但壳层本身硬，若新雪与之融合，可提供支撑。',
    keyTakeaway: '冻融壳影响分阶段',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-053',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '在雪剖面观测中，发现某弱层的"有效弹性模量"很低。这意味着？',
    options: [
      { id: 'a', text: '该层密度很大' },
      { id: 'b', text: '该层在受力时容易变形，抗剪强度低' },
      { id: 'c', text: '该层非常稳定' },
      { id: 'd', text: '该层正在融化' }
    ],
    correctAnswer: 'b',
    explanation: '低弹性模量表示材料"软"，易变形、强度低，典型于深霜、表面霜等弱层。',
    keyTakeaway: '低弹性模量=弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-054',
    type: 'truefalse',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '雪晶的"配位数"（coordination number）越高，雪层强度越大。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '配位数指每个雪晶与相邻晶体的连接数。配位数越高，结合越强，抗剪强度越大。深霜配位数低（~2-3），圆粒雪高（~6-8）。',
    keyTakeaway: '配位数反映颗粒间结合',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-055',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'hard',
    scenarioContext: '雪剖面中发现一层1cm厚的近地表棱角雪，形成于1月初的寒流，现在是2月底。上方积雪已达120cm，该层深度100cm。',
    question: '这个深埋弱层的主要风险是？',
    options: [
      { id: 'a', text: '极高风险，随时雪崩' },
      { id: 'b', text: '中等风险，大荷载或强触发可能破坏' },
      { id: 'c', text: '低风险，但可能导致大型雪崩' },
      { id: 'd', text: '无风险，已完全稳定' }
    ],
    correctAnswer: 'c',
    explanation: '深埋弱层（1m深）难以触发（需强触发如爆破、地震），但一旦破坏，上方荷载大，会导致大规模深板雪崩。',
    keyTakeaway: '深埋弱层=低概率、高后果',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-056',
    type: 'multiple',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '以下哪些微观过程参与雪晶的等温变质？（多选）',
    options: [
      { id: 'a', text: '表面扩散（surface diffusion）' },
      { id: 'b', text: '体积扩散（volume diffusion）' },
      { id: 'c', text: '水汽传输（vapor transport）' },
      { id: 'd', text: '蒸发-凝华' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '等温变质涉及多种微观机制：表面和体积的分子扩散、孔隙空气中的水汽传输、局部蒸发-凝华，共同实现能量最小化。',
    keyTakeaway: '等温变质有多种微观机制',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-057',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '"手硬度测试"（hand hardness test）中，"Knife"（K）级别对应的抗压强度范围约为？',
    options: [
      { id: 'a', text: '10-50 kPa' },
      { id: 'b', text: '100-500 kPa' },
      { id: 'c', text: '500-1000 kPa' },
      { id: 'd', text: '>1000 kPa' }
    ],
    correctAnswer: 'c',
    explanation: 'K（刀）级硬度对应约500-1000 kPa抗压强度，是非常硬的雪，如冰壳、老风板。',
    keyTakeaway: '硬度分级对应力学强度',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-058',
    type: 'scenario',
    category: 'crystal-types',
    difficulty: 'hard',
    scenarioContext: '使用雪晶卡观察，发现某弱层晶体呈现"阶梯状"生长台阶和空心柱状结构。',
    question: '这种形态特征指示什么变质类型和条件？',
    options: [
      { id: 'a', text: '等温变质，温度接近0°C' },
      { id: 'b', text: '温度梯度变质，中等到强梯度（>15°C/m）' },
      { id: 'c', text: '融化变质' },
      { id: 'd', text: '风力机械破碎' }
    ],
    correctAnswer: 'b',
    explanation: '阶梯状生长台阶和空心结构是典型的动力学生长形态，指示强温度梯度下的快速水汽传输和不均匀生长。',
    keyTakeaway: '晶体微观形态揭示变质历史',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-059',
    type: 'single',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '雪晶的"颈部生长"（neck growth）对雪层强度的影响是？',
    options: [
      { id: 'a', text: '减弱强度' },
      { id: 'b', text: '无影响' },
      { id: 'c', text: '显著增强抗剪和抗拉强度' },
      { id: 'd', text: '只影响密度不影响强度' }
    ],
    correctAnswer: 'c',
    explanation: '颈部生长是烧结的直接结果，在颗粒接触点形成固态连接（冰桥），是雪层获得强度的关键机制。',
    keyTakeaway: '颈部生长是强度来源',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'ct-060',
    type: 'image',
    category: 'crystal-types',
    difficulty: 'hard',
    question: '雪晶照片显示：颗粒直径8-12mm，呈现明显的杯状和柱状几何形态，阶梯状生长面，颗粒间几乎无颈部连接。这是什么雪晶类型？其形成环境如何？',
    options: [
      { id: 'a', text: '圆粒雪，等温环境' },
      { id: 'b', text: '风碎雪晶，风力作用' },
      { id: 'c', text: '深霜或发达的棱角雪，强温度梯度（>20°C/m）' },
      { id: 'd', text: '融化雪粒，温度在0°C以上' }
    ],
    correctAnswer: 'c',
    explanation: '大尺寸（>8mm）、杯状/柱状、阶梯面、无颈部连接，都是典型的深霜特征，形成于强温度梯度下的动力学生长。',
    keyTakeaway: '深霜的综合形态学特征',
    relatedPage: '/safety/crystal-types'
  }
];

export default questions;
