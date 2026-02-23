import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy Single Choice Questions (1-15)
  {
    id: 'we-001',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '在雪崩预报中,哪个风速级别被认为是开始形成风板的临界点?',
    options: [
      { id: 'a', text: '1-2级(轻风)' },
      { id: 'b', text: '3-4级(微风到和风)' },
      { id: 'c', text: '5-6级(清劲风到强风)' },
      { id: 'd', text: '7级以上(疾风)' }
    ],
    correctAnswer: 'b',
    explanation: '当风速达到3-4级(约5-8米/秒)时,风开始有能力搬运和重新分布雪粒,形成风板。更强的风会形成更硬更厚的风板。',
    keyTakeaway: '3-4级风是风板形成的起始阈值',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-002',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '24小时内降雪量超过多少厘米被认为是雪崩危险的临界值?',
    options: [
      { id: 'a', text: '10厘米' },
      { id: 'b', text: '20厘米' },
      { id: 'c', text: '30厘米' },
      { id: 'd', text: '50厘米' }
    ],
    correctAnswer: 'c',
    explanation: '24小时内降雪量超过30厘米是一个重要的雪崩预警阈值。这种快速积雪会导致雪层应力迅速增加,尤其是在弱层上方时极其危险。',
    keyTakeaway: '24小时降雪>30cm为雪崩临界阈值',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-003',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '下列哪种天气现象会最快速地增加雪崩危险?',
    options: [
      { id: 'a', text: '持续低温' },
      { id: 'b', text: '雨雪转换(降雨在雪上)' },
      { id: 'c', text: '晴朗无风' },
      { id: 'd', text: '轻微降雪' }
    ],
    correctAnswer: 'b',
    explanation: '雨雪转换是最危险的天气现象之一。雨水渗入雪层会增加重量、降低强度、破坏雪粒间的结合,并可能在弱层上形成润滑层,快速触发雪崩。',
    keyTakeaway: '降雨在雪上是最危险的天气现象',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-004',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '风向与坡向的关系中,最容易形成风板的是哪个方位?',
    options: [
      { id: 'a', text: '迎风坡' },
      { id: 'b', text: '背风坡' },
      { id: 'c', text: '侧风坡' },
      { id: 'd', text: '所有坡向相同' }
    ],
    correctAnswer: 'b',
    explanation: '背风坡是风板形成的主要位置。风将雪从迎风坡吹过山脊,在背风坡沉积形成超载的风板,这些风板通常比原始雪层硬3-5倍且易碎。',
    keyTakeaway: '背风坡最易形成危险风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-005',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '温度逆温层对雪层有什么影响?',
    options: [
      { id: 'a', text: '加速雪层稳定' },
      { id: 'b', text: '促进深霜形成' },
      { id: 'c', text: '增加雪层密度' },
      { id: 'd', text: '没有影响' }
    ],
    correctAnswer: 'b',
    explanation: '逆温层(上暖下冷)会在雪面附近形成强温度梯度,促进深霜(面霜)晶体的生长。这些松散的晶体形成持久的弱层。',
    keyTakeaway: '逆温促进深霜弱层形成',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-006',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '太阳辐射对南坡雪层最直接的影响是什么?',
    options: [
      { id: 'a', text: '使雪层变硬' },
      { id: 'b', text: '加速雪层升温' },
      { id: 'c', text: '增加雪密度' },
      { id: 'd', text: '减少雪崩危险' }
    ],
    correctAnswer: 'b',
    explanation: '太阳辐射直接加热南坡(北半球)雪层表面,导致温度升高。虽然适度升温可以促进稳定,但快速或过度升温会减弱雪粒结合,增加湿雪崩风险。',
    keyTakeaway: '太阳辐射加速南坡雪层升温',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-007',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '在Beaufort风级中,5级风的特征是什么?',
    options: [
      { id: 'a', text: '树叶微动' },
      { id: 'b', text: '小树摇摆,水面有波峰' },
      { id: 'c', text: '大树摇摆,步行困难' },
      { id: 'd', text: '可折断树枝' }
    ],
    correctAnswer: 'b',
    explanation: 'Beaufort 5级风(清劲风,8-10.7米/秒)的特征是小树开始摇摆,内陆水面有明显波峰。这个风速足以搬运大量雪并形成显著风板。',
    keyTakeaway: 'Beaufort 5级:小树摇摆,可形成风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-008',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '快速升温事件通常定义为多少小时内温度上升超过10°C?',
    options: [
      { id: 'a', text: '6小时' },
      { id: 'b', text: '12小时' },
      { id: 'c', text: '24小时' },
      { id: 'd', text: '48小时' }
    ],
    correctAnswer: 'c',
    explanation: '24小时内温度上升超过10°C被定义为快速升温事件。这会迅速改变雪层强度,特别是在早春时节,可能导致大规模湿雪崩。',
    keyTakeaway: '24小时升温>10°C为快速升温事件',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-009',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '下列哪种降水类型最有利于雪层稳定?',
    options: [
      { id: 'a', text: '冻雨' },
      { id: 'b', text: '湿雪' },
      { id: 'c', text: '干冷粉雪' },
      { id: 'd', text: '雨夹雪' }
    ],
    correctAnswer: 'c',
    explanation: '干冷粉雪在低温下降落,雪粒间可以逐渐烧结形成良好结合。相比之下,湿雪、冻雨和雨夹雪都会带来额外水分和重量,增加不稳定性。',
    keyTakeaway: '干冷粉雪最有利于雪层稳定',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-010',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '云层覆盖对夜间雪面温度的主要影响是什么?',
    options: [
      { id: 'a', text: '加速降温' },
      { id: 'b', text: '减缓降温' },
      { id: 'c', text: '没有影响' },
      { id: 'd', text: '导致升温' }
    ],
    correctAnswer: 'b',
    explanation: '云层像毯子一样阻挡地面长波辐射的散失,减缓夜间雪面降温。晴朗无云的夜晚雪面会快速冷却,形成强温度梯度和面霜。',
    keyTakeaway: '云层减缓夜间雪面降温',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-011',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '风雪堆积最常见的地形位置是?',
    options: [
      { id: 'a', text: '山脊迎风侧' },
      { id: 'b', text: '山脊背风侧和凹陷地形' },
      { id: 'c', text: '平坦开阔地' },
      { id: 'd', text: '密林深处' }
    ],
    correctAnswer: 'b',
    explanation: '风将雪吹过山脊后,在背风侧、檐口下方、沟槽和碗状地形中沉积形成风板。这些位置的积雪厚度可能是周围区域的数倍。',
    keyTakeaway: '背风侧和凹陷地形是风雪堆积区',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-012',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '降雪强度达到每小时多少厘米被认为是"强降雪"?',
    options: [
      { id: 'a', text: '>1厘米/小时' },
      { id: 'b', text: '>2.5厘米/小时' },
      { id: 'c', text: '>5厘米/小时' },
      { id: 'd', text: '>10厘米/小时' }
    ],
    correctAnswer: 'b',
    explanation: '降雪强度超过2.5厘米/小时被认为是强降雪。这种快速加载会使雪层应力迅速增加,尤其危险的是持续数小时的强降雪。',
    keyTakeaway: '强降雪定义为>2.5cm/小时',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-013',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '温度梯度超过多少会促进深霜晶体快速生长?',
    options: [
      { id: 'a', text: '5°C/m' },
      { id: 'b', text: '10°C/m' },
      { id: 'c', text: '15°C/m' },
      { id: 'd', text: '20°C/m' }
    ],
    correctAnswer: 'b',
    explanation: '当雪层中温度梯度超过10°C/m时,水汽会快速从暖端向冷端迁移,促进深霜(杯状或柱状)晶体生长,形成持久弱层。',
    keyTakeaway: '温度梯度>10°C/m促进深霜生长',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-014',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '在雪崩预报中,哪种云型通常预示着即将有降雪?',
    options: [
      { id: 'a', text: '卷云(Cirrus)' },
      { id: 'b', text: '积云(Cumulus)' },
      { id: 'c', text: '雨层云(Nimbostratus)' },
      { id: 'd', text: '层积云(Stratocumulus)' }
    ],
    correctAnswer: 'c',
    explanation: '雨层云是厚重的灰色云层,通常带来持续的降雪或降雨。这是预报员监测的重要云型,因为它直接关系到降水量和雪崩风险。',
    keyTakeaway: '雨层云预示持续降雪',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-015',
    type: 'single',
    category: 'weather',
    difficulty: 'easy',
    question: '风吹雪的可见标志包括?',
    options: [
      { id: 'a', text: '山脊上的雪羽' },
      { id: 'b', text: '完全静止的雪面' },
      { id: 'c', text: '均匀的雪层' },
      { id: 'd', text: '深厚的积雪' }
    ],
    correctAnswer: 'a',
    explanation: '山脊上的雪羽(雪旗)是风吹雪的明显标志,表明风正在积极搬运雪并可能在背风坡形成风板。这是野外观察风雪堆积的重要指标。',
    keyTakeaway: '雪羽是风吹雪的可见标志',
    relatedPage: '/safety/terrain'
  },

  // Easy True/False Questions (16-20)
  {
    id: 'we-016',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'easy',
    question: '北风意味着风从北方吹来。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。气象学中风向定义为风的来向,北风表示风从北方吹来,将雪堆积在南坡(背风坡)。这与日常语言习惯一致。',
    keyTakeaway: '风向表示风的来向',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-017',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'easy',
    question: '温暖的天气总是会减少雪崩危险。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。虽然缓慢适度的升温可以促进雪层稳定,但快速升温、春季温暖或接近0°C的温度会导致湿雪崩,有时比冬季干板雪崩更大更具破坏性。',
    keyTakeaway: '温暖天气可能增加湿雪崩危险',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-018',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'easy',
    question: '风板只在暴风雪期间形成。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。即使在晴朗的日子里,只要有足够的风(3-4级以上)和可搬运的雪(松散的表层雪),就可以形成风板。暴风雪后的大风天气特别容易形成风板。',
    keyTakeaway: '晴天有风也可形成风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-019',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'easy',
    question: '云量增加会减少夜间地面辐射冷却。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。云层反射地面向上的长波辐射,起到保温作用,减缓夜间降温速度。这会减少雪面温度梯度,降低面霜形成的可能性。',
    keyTakeaway: '云层减少夜间辐射冷却',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-020',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'easy',
    question: '降雨后立即结冰会在雪层中形成坚硬的冰壳。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。雨水渗入雪层后,如果温度快速下降到冰点以下,会形成冰壳或冰层。这些冰层可以成为滑动面,或在其下方促进深霜生长形成弱层。',
    keyTakeaway: '降雨后结冰形成危险冰壳',
    relatedPage: '/safety/terrain'
  },

  // Medium Single Choice Questions (21-33)
  {
    id: 'we-021',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '在一个典型的风雪堆积场景中,如果主导风向是西风,哪个坡向最可能形成危险风板?',
    options: [
      { id: 'a', text: '西坡' },
      { id: 'b', text: '东坡' },
      { id: 'c', text: '南坡' },
      { id: 'd', text: '北坡' }
    ],
    correctAnswer: 'b',
    explanation: '西风从西方吹来,东坡是背风坡,会接收风吹来的雪堆积形成风板。同时,东南到东北扇形范围内的坡向都可能受影响,需要特别注意近山脊区域。',
    keyTakeaway: '西风导致东坡形成风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-022',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '春季典型的"冻融循环"中,一天中哪个时段雪层最稳定?',
    options: [
      { id: 'a', text: '清晨日出前' },
      { id: 'b', text: '上午10点' },
      { id: 'c', text: '下午2点' },
      { id: 'd', text: '傍晚日落后' }
    ],
    correctAnswer: 'a',
    explanation: '清晨日出前雪层经过夜间重新冻结,形成坚硬稳定的表面。随着白天太阳加热,雪层逐渐软化失去强度。春季应在清晨出发,正午前返回。',
    keyTakeaway: '春季清晨雪层最稳定',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-023',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '持续3天的暴风雪后,天气转晴,风停。此时雪崩危险如何变化?',
    options: [
      { id: 'a', text: '立即消失' },
      { id: 'b', text: '在数小时内快速下降' },
      { id: 'c', text: '保持高位数天' },
      { id: 'd', text: '立即增加' }
    ],
    correctAnswer: 'c',
    explanation: '暴风雪期间快速加载的雪层需要时间来稳定。即使天气转好,风板和新雪层仍然不稳定,可能需要几天甚至一周才能充分沉降和烧结。这个时期仍需保持警惕。',
    keyTakeaway: '暴风雪后危险持续数天',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-024',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '雪层中0°C等温线上升到2500米,这对雪崩危险意味着什么?',
    options: [
      { id: 'a', text: '2500米以下湿雪崩风险增加' },
      { id: 'b', text: '2500米以上湿雪崩风险增加' },
      { id: 'c', text: '所有海拔风险下降' },
      { id: 'd', text: '只影响北坡' }
    ],
    correctAnswer: 'a',
    explanation: '0°C等温线以下的雪层开始融化,水分渗入导致湿雪崩风险显著增加。这在春季或暖锋过境时特别危险,需要关注等温线高度变化。',
    keyTakeaway: '0°C线以下湿雪崩风险增加',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-025',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '在相同的降雪量下,哪种条件会产生最危险的风板?',
    options: [
      { id: 'a', text: '降雪时无风,降雪后强风' },
      { id: 'b', text: '降雪时强风,降雪后无风' },
      { id: 'c', text: '全程无风' },
      { id: 'd', text: '风向不断变化' }
    ],
    correctAnswer: 'a',
    explanation: '降雪时无风产生松散的低密度雪,降雪后的强风可以轻易搬运这些雪,在背风坡形成厚重坚硬的风板。这种"先雪后风"的模式特别危险。',
    keyTakeaway: '"先雪后风"形成最危险风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-026',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '温度从-15°C升至-5°C对雪层稳定性的影响是?',
    options: [
      { id: 'a', text: '总是增加稳定性' },
      { id: 'b', text: '总是降低稳定性' },
      { id: 'c', text: '短期内可能降低稳定性,长期有助于稳定' },
      { id: 'd', text: '没有影响' }
    ],
    correctAnswer: 'c',
    explanation: '温度上升初期,雪层内部应力重新分配可能暂时降低稳定性。但在-5°C附近,雪粒烧结速度加快,长期有助于雪层稳定。这是一个复杂的动态过程。',
    keyTakeaway: '升温对稳定性影响是动态过程',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-027',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '观察到山脊北侧有雪羽,南侧光滑,这表明?',
    options: [
      { id: 'a', text: '南风正在吹' },
      { id: 'b', text: '北风正在吹' },
      { id: 'c', text: '东风正在吹' },
      { id: 'd', text: '无法判断风向' }
    ],
    correctAnswer: 'b',
    explanation: '雪羽出现在背风侧。北侧有雪羽说明北侧是背风侧,因此是北风(从北向南吹)。南侧光滑是因为作为迎风坡,雪被吹走了。',
    keyTakeaway: '雪羽出现在背风侧',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-028',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '在一次降雪事件中,气温从-8°C降至-15°C,雪的特性会如何变化?',
    options: [
      { id: 'a', text: '从湿粘雪变为干粉雪' },
      { id: 'b', text: '从干粉雪变为湿粘雪' },
      { id: 'c', text: '保持不变' },
      { id: 'd', text: '形成冰粒' }
    ],
    correctAnswer: 'a',
    explanation: '随着温度下降,雪晶含水量减少,从较湿较重的雪变为干燥轻盈的粉雪。冷粉雪密度更低,更容易被风搬运,但烧结速度也更慢。',
    keyTakeaway: '降温使雪从湿变干',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-029',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '云层突然散开,夜间晴空,对第二天早晨的雪况影响是?',
    options: [
      { id: 'a', text: '雪面会很硬,可能有面霜' },
      { id: 'b', text: '雪面会变软' },
      { id: 'c', text: '没有变化' },
      { id: 'd', text: '雪会融化' }
    ],
    correctAnswer: 'a',
    explanation: '晴朗夜空导致强辐射冷却,雪面温度快速下降,表面重新冻结变硬。同时强温度梯度促进面霜晶体生长,可能形成新的弱层。',
    keyTakeaway: '晴夜导致雪面硬化和面霜',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-030',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '在相同风速下,哪种雪最容易被风搬运形成风板?',
    options: [
      { id: 'a', text: '湿重的雪' },
      { id: 'b', text: '新降的干冷粉雪' },
      { id: 'c', text: '已烧结的旧雪' },
      { id: 'd', text: '冰壳' }
    ],
    correctAnswer: 'b',
    explanation: '新降的干冷粉雪密度低、颗粒松散,最容易被风搬运。风将这些雪吹到背风坡后压实成风板,密度可达原来的3-5倍。',
    keyTakeaway: '干冷粉雪最易被风搬运',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-031',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '降雪率从1cm/小时突然增加到5cm/小时,持续6小时,最可能导致?',
    options: [
      { id: 'a', text: '雪层逐渐稳定' },
      { id: 'b', text: '雪崩活动周期' },
      { id: 'c', text: '风板消失' },
      { id: 'd', text: '深霜层愈合' }
    ],
    correctAnswer: 'b',
    explanation: '强降雪率(5cm/小时)持续6小时会带来30cm新雪,这种快速加载超过临界阈值,很可能触发自然雪崩周期,特别是存在弱层时。',
    keyTakeaway: '强降雪导致雪崩周期',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-032',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '暖锋过境通常会带来什么样的降水和温度变化?',
    options: [
      { id: 'a', text: '短暂强降雪,温度骤降' },
      { id: 'b', text: '持续降雪/雨,温度上升' },
      { id: 'c', text: '无降水,温度下降' },
      { id: 'd', text: '阵性降雪,温度不变' }
    ],
    correctAnswer: 'b',
    explanation: '暖锋过境带来较持续的降水,温度逐渐上升。这可能导致雨雪转换,是最危险的情况之一。需要密切监测0°C等温线高度。',
    keyTakeaway: '暖锋带来持续降水和升温',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-033',
    type: 'single',
    category: 'weather',
    difficulty: 'medium',
    question: '风向在24小时内从北风转为南风,对雪崩地形的影响是?',
    options: [
      { id: 'a', text: '只有北坡危险' },
      { id: 'b', text: '只有南坡危险' },
      { id: 'c', text: '南北坡都可能有新的风板' },
      { id: 'd', text: '风向变化不影响雪崩' }
    ],
    correctAnswer: 'c',
    explanation: '风向变化意味着不同坡向会在不同时间成为背风坡。北风时南坡形成风板,南风时北坡形成风板。这种交叉加载使更多坡向变得危险。',
    keyTakeaway: '风向变化导致多坡向风板',
    relatedPage: '/safety/terrain'
  },

  // Medium True/False Questions (34-38)
  {
    id: 'we-034',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'medium',
    question: '在高山环境中,风速通常随海拔升高而增加。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。由于摩擦力减少和地形效应,高海拔区域风速通常更大。林线以上的开阔高山区域风速可能是山谷的2-3倍,风板形成更普遍。',
    keyTakeaway: '高海拔风速更大',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-035',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'medium',
    question: '雪层温度达到0°C时会立即变成水。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。雪在0°C时可以保持固态(等温雪层),需要持续的能量输入(太阳辐射或温暖空气)才会融化。0°C的雪层仍然可以保持一定强度。',
    keyTakeaway: '0°C雪层不会立即融化',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-036',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'medium',
    question: '树枝上的雾凇(rime)形成表明空气中有过冷水滴。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。雾凇由过冷水滴碰撞物体后立即冻结形成。这表明云中存在液态水,温度在0°C以下。这种条件下降雪往往较湿,粘性强。',
    keyTakeaway: '雾凇表明过冷水滴存在',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-037',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'medium',
    question: '风速稳定的持续风比阵风更容易形成均匀的风板。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。稳定的持续风会形成更均匀、连续的风板。阵风虽然可能瞬时风速更大,但形成的风板往往不均匀,有硬有软,这种不均匀性也可能带来问题。',
    keyTakeaway: '持续风形成均匀风板',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-038',
    type: 'truefalse',
    category: 'weather',
    difficulty: 'medium',
    question: '南坡(北半球)在冬季正午接收的太阳辐射总是比北坡多。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。北半球冬季太阳位于南方天空,南坡接收直射或大角度入射的太阳辐射,而北坡大部分时间处于阴影中。这导致南北坡温度和雪况差异显著。',
    keyTakeaway: '南坡接收更多太阳辐射',
    relatedPage: '/safety/terrain'
  },

  // Medium Multiple Choice Questions (39-43)
  {
    id: 'we-039',
    type: 'multiple',
    category: 'weather',
    difficulty: 'medium',
    question: '以下哪些因素会加速雪层表面融化?(选择所有适用项)',
    options: [
      { id: 'a', text: '强烈的太阳辐射' },
      { id: 'b', text: '温暖的风' },
      { id: 'c', text: '降雨' },
      { id: 'd', text: '晴朗的夜空' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '太阳辐射、温暖的风和降雨都会向雪层输入热量导致融化。晴朗夜空会导致辐射冷却,使雪层冻结而非融化。这三种加热源可以单独或共同作用。',
    keyTakeaway: '辐射、暖风、降雨加速融化',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-040',
    type: 'multiple',
    category: 'weather',
    difficulty: 'medium',
    question: '风板的典型特征包括?(选择所有适用项)',
    options: [
      { id: 'a', text: '比周围雪层更硬' },
      { id: 'b', text: '发出空洞的"咚咚"声' },
      { id: 'c', text: '表面有射击裂纹' },
      { id: 'd', text: '完全松软' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '风板由于风的压实作用变硬,踩踏时发出空洞声,受力时可能产生射击裂纹(快速传播的裂缝)。这些都是风板的警告信号,松软是相反的特征。',
    keyTakeaway: '风板特征:硬、空洞声、射击裂纹',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-041',
    type: 'multiple',
    category: 'weather',
    difficulty: 'medium',
    question: '以下哪些气象条件有利于深霜(面霜)的形成?(选择所有适用项)',
    options: [
      { id: 'a', text: '晴朗无云的夜晚' },
      { id: 'b', text: '薄雪层(浅雪)' },
      { id: 'c', text: '寒冷的气温' },
      { id: 'd', text: '厚云层' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '晴夜辐射冷却、薄雪层(地热易传导)和寒冷气温都会产生大温度梯度,促进深霜生长。厚云层会减少辐射冷却,降低温度梯度。',
    keyTakeaway: '晴夜、薄雪、寒冷促进深霜',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-042',
    type: 'multiple',
    category: 'weather',
    difficulty: 'medium',
    question: '监测雪崩天气时,预报员应密切关注哪些参数?(选择所有适用项)',
    options: [
      { id: 'a', text: '降雪强度和累计量' },
      { id: 'b', text: '风速和风向' },
      { id: 'c', text: '气温和0°C线高度' },
      { id: 'd', text: '湿度' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '所有这些参数都至关重要:降雪量决定加载,风决定分布,温度影响雪型和稳定性,湿度影响雪晶类型和粘性。综合监测才能准确评估。',
    keyTakeaway: '降雪、风、温度、湿度都需监测',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-043',
    type: 'multiple',
    category: 'weather',
    difficulty: 'medium',
    question: '以下哪些是"雨雪转换"事件的危险因素?(选择所有适用项)',
    options: [
      { id: 'a', text: '增加雪层重量' },
      { id: 'b', text: '减弱雪粒间结合' },
      { id: 'c', text: '在弱层上形成润滑层' },
      { id: 'd', text: '促进雪层烧结' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '雨水渗入雪层会增加重量、破坏雪粒结合、在界面形成润滑层,这些都极度危险。雨水不会促进烧结,反而会破坏已有的烧结结构。',
    keyTakeaway: '降雨增重、减弱结合、润滑层',
    relatedPage: '/safety/terrain'
  },

  // Hard Single Choice Questions (44-48)
  {
    id: 'we-044',
    type: 'single',
    category: 'weather',
    difficulty: 'hard',
    question: '一个复杂的天气情景:48小时内发生以下事件:(1)降雪40cm,温度-12°C;(2)西风6级持续12小时;(3)天晴,温度降至-18°C;(4)温度回升至-5°C。在这个序列结束时,最危险的坡向和问题类型是?',
    options: [
      { id: 'a', text: '西坡,风板问题' },
      { id: 'b', text: '东坡,风板问题' },
      { id: 'c', text: '南坡,湿雪问题' },
      { id: 'd', text: '北坡,持久板层问题' }
    ],
    correctAnswer: 'b',
    explanation: '分析:40cm新雪+西风6级→东坡形成厚重风板;随后降温→风板冻结变硬但未稳定;最后升温至-5°C→风板应力调整,短期不稳定加剧。东坡风板是主要危险。',
    keyTakeaway: '复杂天气需逐步分析演变',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-045',
    type: 'single',
    category: 'weather',
    difficulty: 'hard',
    question: '在雪崩气象学中,"upside-down storm"(倒置风暴)指的是什么,为什么危险?',
    options: [
      { id: 'a', text: '风向突然反转的风暴' },
      { id: 'b', text: '降雪期间温度上升,高密度雪在低密度雪上' },
      { id: 'c', text: '降雪期间温度下降,低密度雪在高密度雪上' },
      { id: 'd', text: '降雪从山谷向山顶移动' }
    ],
    correctAnswer: 'b',
    explanation: '"倒置风暴"指降雪开始时温度低(轻粉雪),结束时温度升高(重湿雪),形成"头重脚轻"的不稳定结构。正常情况应该是下重上轻,这种倒置极易雪崩。',
    keyTakeaway: '倒置风暴形成头重脚轻结构',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-046',
    type: 'single',
    category: 'weather',
    difficulty: 'hard',
    question: '地形性抬升降雪(orographic precipitation)在雪崩预报中的意义是什么?',
    options: [
      { id: 'a', text: '山谷比山顶降雪多' },
      { id: 'b', text: '迎风坡比背风坡降雪多,加上风板双重加载' },
      { id: 'c', text: '降雪均匀分布' },
      { id: 'd', text: '只影响温度不影响降雪' }
    ],
    correctAnswer: 'b',
    explanation: '湿气流遇山脉抬升,迎风坡降雪量可达背风坡的2-3倍。同时,强风将部分雪吹到背风坡形成风板。这种不均匀分布导致局地雪崩危险差异巨大。',
    keyTakeaway: '地形抬升导致降雪不均匀',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-047',
    type: 'single',
    category: 'weather',
    difficulty: 'hard',
    question: '在春季,当雪面出现"pinwheeling"(雪球自然滚落)现象时,这指示着什么?',
    options: [
      { id: 'a', text: '雪层完全稳定' },
      { id: 'b', text: '表层开始融化,湿雪崩危险上升' },
      { id: 'c', text: '深层弱层激活' },
      { id: 'd', text: '风板形成' }
    ],
    correctAnswer: 'b',
    explanation: 'Pinwheeling(雪球自然滚下坡)是雪层表面融化的明确信号,表明有足够的液态水含量使雪变得粘稠。这是湿雪崩即将发生的经典预警,应立即撤离陡坡。',
    keyTakeaway: '雪球滚落预示湿雪崩即将发生',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-048',
    type: 'single',
    category: 'weather',
    difficulty: 'hard',
    question: '"Foehn wind"(焚风)效应对雪崩危险的影响主要通过什么机制?',
    options: [
      { id: 'a', text: '降低温度,增加雪层稳定性' },
      { id: 'b', text: '快速升温和低湿度,加速雪层蜕变' },
      { id: 'c', text: '增加降雪量' },
      { id: 'd', text: '没有影响' }
    ],
    correctAnswer: 'b',
    explanation: '焚风是越过山脉下沉的暖干气流,可在数小时内使温度上升10-20°C。这种快速升温加上低湿度(促进升华),会迅速改变雪层强度,触发大规模雪崩。',
    keyTakeaway: '焚风快速升温触发雪崩',
    relatedPage: '/safety/terrain'
  },

  // Hard Scenario Questions (49-50)
  {
    id: 'we-049',
    type: 'scenario',
    category: 'weather',
    difficulty: 'hard',
    scenarioContext: '你是雪崩预报员,收到以下72小时天气预报:第1天:降雪30cm,温度-10°C,东风4级;第2天:降雪20cm,温度-6°C,东风转西风6级;第3天:晴,温度-2°C,西风3级。基础雪层稳定,无明显弱层。',
    question: '第3天结束时,哪个海拔带和坡向组合面临最高雪崩危险?',
    options: [
      { id: 'a', text: '林线以下东坡' },
      { id: 'b', text: '林线附近西坡' },
      { id: 'c', text: '高山带东坡近山脊区域' },
      { id: 'd', text: '高山带南坡' }
    ],
    correctAnswer: 'c',
    explanation: '分析:第1天东风在西坡形成风板;第2天风向转变,西风在东坡形成第二层风板,且风更强(6级)。高山带风速最大,近山脊风板最厚。50cm总降雪+交叉加载+升温=-高危险东坡高山带。',
    keyTakeaway: '交叉风向导致多层风板叠加',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'we-050',
    type: 'scenario',
    category: 'weather',
    difficulty: 'hard',
    scenarioContext: '一个持续2周的高压系统控制山区,天气晴朗寒冷,夜间温度-20°C,白天-8°C,无降雪。雪层深度50cm。随后一个快速移动的暖锋带来12小时内30cm降雪,温度从-8°C升至+2°C,降雨持续6小时。',
    question: '这个情景中最主要的雪崩问题是什么?',
    options: [
      { id: 'a', text: '风板问题' },
      { id: 'b', text: '新雪问题' },
      { id: 'c', text: '降雨在深霜弱层上形成的板层问题' },
      { id: 'd', text: '湿松散雪崩' }
    ],
    correctAnswer: 'c',
    explanation: '关键分析:2周晴冷天气在50cm雪层中形成深度深霜弱层;30cm新雪+降雨带来巨大加载;雨水润滑弱层界面。这是极端危险的组合,可能产生大型深层板层雪崩。',
    keyTakeaway: '长期晴冷后降雨是极危险组合',
    relatedPage: '/safety/terrain'
  }
];

export default questions;
