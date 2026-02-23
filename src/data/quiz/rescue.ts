import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy Questions (rs-001 to rs-025)
  {
    id: 'rs-001',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩信标(Avalanche Beacon)的主要作用是什么?',
    options: [
      { id: 'a', text: '预测雪崩发生' },
      { id: 'b', text: '定位被埋者的位置' },
      { id: 'c', text: '测量雪层厚度' },
      { id: 'd', text: '报警提醒' }
    ],
    correctAnswer: 'b',
    explanation: '雪崩信标通过发射和接收457kHz电磁信号来定位被埋者,是伙伴救援中最重要的工具。',
    keyTakeaway: '雪崩信标是定位被埋者的核心设备',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-002',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '进入雪崩地形前,所有队员的雪崩信标都应设置为发射(Send)模式。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '出发前必须将所有信标设为发射模式,这样一旦发生雪崩,未被埋者可以立即切换到搜索(Search)模式进行定位。',
    keyTakeaway: '出发前检查所有信标处于发射模式',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-003',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩救援三件套(Avalanche Safety Gear)包括哪三件装备?',
    options: [
      { id: 'a', text: '信标、探杆、铲子' },
      { id: 'b', text: '信标、头盔、雪板' },
      { id: 'c', text: '探杆、铲子、绳索' },
      { id: 'd', text: '信标、急救包、GPS' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩救援三件套为:信标(Beacon)、探杆(Probe)、铲子(Shovel),这是伙伴救援的标准配置。',
    keyTakeaway: '信标、探杆、铲子是救援必备三件套',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-004',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '被雪崩掩埋后,生存时间会随着掩埋时间延长而急剧下降,所以速度是救援的关键。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '统计显示,被埋15分钟内生存率超过90%,35分钟后降至30%,因此快速救援至关重要。',
    keyTakeaway: '时间就是生命,快速救援是关键',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-005',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩信标的国际标准工作频率是多少?',
    options: [
      { id: 'a', text: '457 kHz' },
      { id: 'b', text: '27 MHz' },
      { id: 'c', text: '2.4 GHz' },
      { id: 'd', text: '900 MHz' }
    ],
    correctAnswer: 'a',
    explanation: '全球雪崩信标统一使用457kHz频率,确保不同品牌设备之间的兼容性。',
    keyTakeaway: '雪崩信标工作频率为457kHz',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-006',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '探杆(Probe)的主要作用是什么?',
    options: [
      { id: 'a', text: '测试雪层稳定性' },
      { id: 'b', text: '精确定位被埋者的深度和位置' },
      { id: 'c', text: '挖掘雪层' },
      { id: 'd', text: '测量雪温' }
    ],
    correctAnswer: 'b',
    explanation: '探杆用于在信标定位后精确确定被埋者的具体位置和掩埋深度,指导有效挖掘。',
    keyTakeaway: '探杆用于精确定位和测量埋深',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-007',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '发现队友被雪崩掩埋后,应立即下山寻求专业救援。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '伙伴救援是被埋者唯一的生存希望。下山寻求救援会浪费宝贵时间,必须立即开始现场搜救。',
    keyTakeaway: '立即进行伙伴救援,不要浪费时间下山',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-008',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '铲子在雪崩救援中的主要用途是什么?',
    options: [
      { id: 'a', text: '挖雪洞避难' },
      { id: 'b', text: '挖掘被埋者' },
      { id: 'c', text: '测试雪层' },
      { id: 'd', text: '清理滑雪道' }
    ],
    correctAnswer: 'b',
    explanation: '铲子是挖掘被埋者的必备工具,用手挖掘的速度只有用铲子的1/10。',
    keyTakeaway: '铲子是快速挖掘的关键工具',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-009',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '被雪崩掩埋时,应尽量制造气囊(Air Pocket)来延长生存时间。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '在雪崩停止前用手护住口鼻制造空气空间,可以提供氧气并防止窒息,显著提高生存率。',
    keyTakeaway: '制造气囊可以延长生存时间',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-010',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '标准的雪崩探杆长度通常是多少?',
    options: [
      { id: 'a', text: '1.5米' },
      { id: 'b', text: '2.4-3.2米' },
      { id: 'c', text: '4-5米' },
      { id: 'd', text: '0.8-1米' }
    ],
    correctAnswer: 'b',
    explanation: '标准探杆长度为2.4-3.2米(240-320cm),可以探测到大多数掩埋深度。',
    keyTakeaway: '标准探杆长度为2.4-3.2米',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-011',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩信标的有效搜索范围通常是多少米?',
    options: [
      { id: 'a', text: '10-20米' },
      { id: 'b', text: '40-60米' },
      { id: 'c', text: '100-150米' },
      { id: 'd', text: '200米以上' }
    ],
    correctAnswer: 'b',
    explanation: '现代三天线信标的有效搜索范围通常为40-60米,在此范围内可以接收到信号。',
    keyTakeaway: '信标有效搜索范围约40-60米',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-012',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '被雪崩卷入时,应尝试"游泳"动作保持在雪面附近。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '游泳动作可以帮助保持在雪流表面,减少被深埋的风险,提高生存和被发现的机会。',
    keyTakeaway: '雪崩中做游泳动作可减少埋深',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-013',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '以下哪项不是雪崩救援的关键原则?',
    options: [
      { id: 'a', text: '速度' },
      { id: 'b', text: '系统性搜索' },
      { id: 'c', text: '等待专业救援' },
      { id: 'd', text: '有效挖掘' }
    ],
    correctAnswer: 'c',
    explanation: '伙伴救援强调立即行动、快速搜索和有效挖掘,不能等待专业救援队到达。',
    keyTakeaway: '不要等待专业救援,立即进行伙伴救援',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-014',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: 'RECCO反射器可以替代雪崩信标进行伙伴救援。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: 'RECCO反射器是被动装置,需要专业救援队的探测器才能使用,不能用于伙伴救援。信标是必需的。',
    keyTakeaway: 'RECCO不能替代信标进行伙伴救援',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-015',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '被雪崩掩埋后,死亡的主要原因是什么?',
    options: [
      { id: 'a', text: '创伤' },
      { id: 'b', text: '窒息' },
      { id: 'c', text: '失温' },
      { id: 'd', text: '脱水' }
    ],
    correctAnswer: 'b',
    explanation: '约75%的雪崩死亡是由窒息导致,其次是创伤。窒息是被埋后最快的致死因素。',
    keyTakeaway: '窒息是雪崩掩埋的主要死因',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-016',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩信标电池应该使用什么类型?',
    options: [
      { id: 'a', text: '碱性电池' },
      { id: 'b', text: '锂电池' },
      { id: 'c', text: '镍氢充电电池' },
      { id: 'd', text: '任何电池都可以' }
    ],
    correctAnswer: 'a',
    explanation: '应使用碱性电池,因为它们在低温环境下性能稳定。锂电池性能更好但某些设备不兼容,充电电池不推荐。',
    keyTakeaway: '信标应使用碱性电池',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-017',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩气囊背包(Airbag)可以完全替代信标、探杆和铲子。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '气囊背包可以降低被埋概率,但不能完全防止掩埋,救援三件套仍然是必需装备。',
    keyTakeaway: '气囊背包不能替代救援三件套',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-018',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '在雪崩碎屑中搜索时,首先应该做什么?',
    options: [
      { id: 'a', text: '立即呼叫直升机' },
      { id: 'b', text: '进行目视搜索,寻找表面线索' },
      { id: 'c', text: '开始系统性信标搜索' },
      { id: 'd', text: '等待其他救援人员' }
    ],
    correctAnswer: 'b',
    explanation: '首先进行快速目视搜索,寻找暴露在外的装备、身体部位或"最后目击点",可能最快找到被埋者。',
    keyTakeaway: '搜索前先进行目视检查',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-019',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '被雪崩掩埋15分钟内的生存率大约是多少?',
    options: [
      { id: 'a', text: '50%' },
      { id: 'b', text: '70%' },
      { id: 'c', text: '90%以上' },
      { id: 'd', text: '30%' }
    ],
    correctAnswer: 'c',
    explanation: '统计数据显示,被埋15分钟内生存率超过90%,这就是为什么伙伴救援如此重要。',
    keyTakeaway: '15分钟内生存率超过90%',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-020',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '在进行信标搜索时,应该关闭手机和对讲机以避免干扰。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '电子设备可能干扰信标信号,搜索时应关闭或至少远离信标20厘米以上。',
    keyTakeaway: '搜索时关闭电子设备避免干扰',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-021',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '挖掘被埋者时,铲子相比徒手挖掘效率高多少?',
    options: [
      { id: 'a', text: '2倍' },
      { id: 'b', text: '5倍' },
      { id: 'c', text: '10倍' },
      { id: 'd', text: '没有区别' }
    ],
    correctAnswer: 'c',
    explanation: '使用铲子挖掘的效率是徒手的10倍,这就是为什么铲子是救援三件套之一。',
    keyTakeaway: '铲子挖掘效率是徒手的10倍',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-022',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '雪崩救援中,"黄金时间"通常指的是多长时间?',
    options: [
      { id: 'a', text: '5分钟' },
      { id: 'b', text: '15分钟' },
      { id: 'c', text: '1小时' },
      { id: 'd', text: '3小时' }
    ],
    correctAnswer: 'b',
    explanation: '前15分钟被称为"黄金时间",此时生存率最高,是伙伴救援的关键时间窗口。',
    keyTakeaway: '黄金救援时间为15分钟',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-023',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'easy',
    question: '所有雪崩信标都需要定期进行功能测试。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '每次出行前和整个雪季中应定期测试信标的发射和接收功能,确保设备正常工作。',
    keyTakeaway: '定期测试信标功能',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-024',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '发现被埋者后,挖掘的方向应该是?',
    options: [
      { id: 'a', text: '从正上方直接向下挖' },
      { id: 'b', text: '从下坡方向向上挖' },
      { id: 'c', text: '从上坡方向斜向下挖' },
      { id: 'd', text: '任何方向都可以' }
    ],
    correctAnswer: 'c',
    explanation: '应从上坡方向以1.5:1的比例斜向下挖掘,形成通道,这样更高效且更安全。',
    keyTakeaway: '从上坡方向斜向下挖掘',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-025',
    type: 'single',
    category: 'rescue',
    difficulty: 'easy',
    question: '以下哪项不是雪崩信标的基本组成部分?',
    options: [
      { id: 'a', text: '发射天线' },
      { id: 'b', text: '接收天线' },
      { id: 'c', text: 'GPS定位模块' },
      { id: 'd', text: '电池' }
    ],
    correctAnswer: 'c',
    explanation: '雪崩信标使用电磁信号,不需要GPS。基本组成包括天线、处理器、显示屏和电池。',
    keyTakeaway: '信标不依赖GPS,使用电磁信号',
    relatedPage: '/safety/rescue'
  },

  // Medium Questions (rs-026 to rs-050)
  {
    id: 'rs-026',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '信标搜索的三个阶段分别是什么?',
    options: [
      { id: 'a', text: '快速搜索、精确搜索、挖掘' },
      { id: 'b', text: '信号搜索、粗略搜索、精确搜索' },
      { id: 'c', text: '目视搜索、信标搜索、探杆搜索' },
      { id: 'd', text: '区域搜索、定点搜索、确认搜索' }
    ],
    correctAnswer: 'b',
    explanation: '信标搜索三阶段为:信号搜索(Signal Search,寻找初始信号)、粗略搜索(Coarse Search,接近信号源)、精确搜索(Fine Search,定位最小距离点)。',
    keyTakeaway: '信标搜索分为信号、粗略、精确三阶段',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-027',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '在进行探杆搜索时,以下哪些做法是正确的?(多选)',
    options: [
      { id: 'a', text: '探杆应垂直插入雪中' },
      { id: 'b', text: '感受探杆触碰到柔软物体的反馈' },
      { id: 'c', text: '按照系统性网格进行探测' },
      { id: 'd', text: '探杆插入后立即拔出继续下一点' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '探杆应垂直插入,仔细感受触感,按照25-30cm间距的网格系统性探测。插入后应稍作停留感受反馈。',
    keyTakeaway: '探杆搜索需垂直、系统、仔细感受',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-028',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '你应该如何处理?',
    scenarioContext: '你正在进行信标搜索,距离显示3.2米,但数字开始增大到3.5米。',
    options: [
      { id: 'a', text: '继续原方向前进' },
      { id: 'b', text: '停止,标记此点,转身180度反方向搜索' },
      { id: 'c', text: '向左或向右90度转向' },
      { id: 'd', text: '重新开始信号搜索' }
    ],
    correctAnswer: 'b',
    explanation: '距离增大说明你走过了最近点。应立即停止,标记该点,转身180度返回,这是"越界"(overshoot)时的标准处理。',
    keyTakeaway: '距离增大时立即转身返回',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-029',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '精确搜索(Fine Search)阶段,正确的操作方法是?',
    options: [
      { id: 'a', text: '在最小距离点周围快速移动信标' },
      { id: 'b', text: '将信标贴近雪面,进行十字交叉搜索找到最小距离点' },
      { id: 'c', text: '保持信标在胸前高度搜索' },
      { id: 'd', text: '停止移动,等待救援' }
    ],
    correctAnswer: 'b',
    explanation: '精确搜索时应将信标贴近雪面(距离雪面10-20cm),进行缓慢的十字交叉运动,找到最小距离读数点。',
    keyTakeaway: '精确搜索时信标贴近雪面十字交叉',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-030',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '以下哪些因素会影响被埋者的生存率?(多选)',
    options: [
      { id: 'a', text: '掩埋深度' },
      { id: 'b', text: '是否有气囊(Air Pocket)' },
      { id: 'c', text: '掩埋时间' },
      { id: 'd', text: '雪的密度' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '所有因素都会影响生存率:埋深越浅越好,气囊提供氧气,时间越短越好,雪密度低更容易呼吸。',
    keyTakeaway: '多种因素共同影响生存率',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-031',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '三天线信标相比单天线信标的主要优势是什么?',
    options: [
      { id: 'a', text: '搜索范围更大' },
      { id: 'b', text: '可以消除通量线(Flux Line)问题,提供更准确的方向指示' },
      { id: 'c', text: '电池寿命更长' },
      { id: 'd', text: '防水性能更好' }
    ],
    correctAnswer: 'b',
    explanation: '三天线信标可以同时接收三个方向的信号,解决单天线的"通量线陷阱"问题,提供更精确的方向和距离信息。',
    keyTakeaway: '三天线信标提供更精确的定位',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-032',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '最优的挖掘策略是什么?',
    scenarioContext: '探杆定位显示被埋者在1.8米深处,你有3名队员和3把铲子。',
    options: [
      { id: 'a', text: '所有人围绕探杆点挖一个垂直竖井' },
      { id: 'b', text: '1人挖掘,2人待命' },
      { id: 'c', text: '从上坡方向挖V型通道,多人轮换,搬运雪到两侧' },
      { id: 'd', text: '分散挖掘多个点' }
    ],
    correctAnswer: 'c',
    explanation: '应从上坡方向以1.5:1的斜率挖V型通道到达被埋者,多人配合:前面挖掘,后面搬运雪,轮换休息保持效率。',
    keyTakeaway: 'V型通道挖掘最高效',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-033',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'medium',
    question: '在精确搜索中找到最小距离点后,应该直接开始探杆搜索,不需要标记该点。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '找到最小距离点后应该用探杆或铲子标记该点,然后在该点垂直插入探杆,避免重复搜索浪费时间。',
    keyTakeaway: '标记最小距离点再探杆',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-034',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '多人掩埋(Multiple Burial)情况下,正确的搜索策略是?',
    options: [
      { id: 'a', text: '同时搜索所有信号' },
      { id: 'b', text: '使用信标的"标记"(Mark)功能,逐个搜索救援' },
      { id: 'c', text: '只救援信号最强的' },
      { id: 'd', text: '放弃伙伴救援,等待专业队伍' }
    ],
    correctAnswer: 'b',
    explanation: '多人掩埋时使用信标的"标记/屏蔽"功能,先救援最近的被埋者,救出后标记该信标继续搜索下一个。',
    keyTakeaway: '多人掩埋使用标记功能逐个救援',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-035',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '挖掘到达被埋者后,应该采取哪些措施?(多选)',
    options: [
      { id: 'a', text: '首先清理口鼻气道' },
      { id: 'b', text: '检查呼吸和心跳' },
      { id: 'c', text: '立即将其完全拖出' },
      { id: 'd', text: '保护颈椎,防止脊椎损伤' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '到达被埋者后:清理气道,检查生命体征,保护颈椎。不要粗暴拖拽,可能有脊椎损伤。完全暴露后再小心移出。',
    keyTakeaway: '清理气道、检查生命体征、保护颈椎',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-036',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '接下来最重要的行动是什么?',
    scenarioContext: '你救出被埋25分钟的队友,他没有呼吸和心跳。',
    options: [
      { id: 'a', text: '立即开始CPR(心肺复苏)' },
      { id: 'b', text: '先呼叫直升机再处理' },
      { id: 'c', text: '判定无法救治,继续搜索其他被埋者' },
      { id: 'd', text: '给伤者保暖' }
    ],
    correctAnswer: 'a',
    explanation: '无呼吸心跳时应立即CPR。雪崩掩埋导致的心脏骤停有复苏可能,特别是失温导致的"假死"状态。',
    keyTakeaway: '无心跳呼吸时立即CPR',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-037',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '信号搜索(Signal Search)阶段,搜索者之间的间距应该是多少?',
    options: [
      { id: 'a', text: '10米' },
      { id: 'b', text: '20米' },
      { id: 'c', text: '40米' },
      { id: 'd', text: '60米' }
    ],
    correctAnswer: 'c',
    explanation: '信号搜索阶段搜索者间距应为40米左右(不超过信标有效范围的2倍),确保覆盖整个雪崩碎屑区。',
    keyTakeaway: '信号搜索间距约40米',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-038',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: 'RECCO系统的工作原理是什么?',
    options: [
      { id: 'a', text: '主动发射无线电信号' },
      { id: 'b', text: '被动反射探测器发出的信号' },
      { id: 'c', text: '使用GPS定位' },
      { id: 'd', text: '使用卫星通讯' }
    ],
    correctAnswer: 'b',
    explanation: 'RECCO反射器是被动装置,反射专业救援队RECCO探测器发出的信号。不能用于伙伴救援,但可辅助专业救援。',
    keyTakeaway: 'RECCO是被动反射系统,需专业探测器',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-039',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'medium',
    question: '被埋者如果在35分钟后仍未被找到,生存率会降到30%左右。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '统计显示生存率曲线在35分钟左右出现显著下降,从90%降至约30%,这是窒息导致的"生存曲线"特征。',
    keyTakeaway: '35分钟后生存率降至约30%',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-040',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '正确的处理方式是?',
    scenarioContext: '信标搜索时,你的信标显示有2个信号源,距离分别为15米和32米。',
    options: [
      { id: 'a', text: '先救援32米的,因为埋得更深' },
      { id: 'b', text: '分队同时救援' },
      { id: 'c', text: '先救援15米的,救出后标记该信标,再救援32米的' },
      { id: 'd', text: '呼叫支援' }
    ],
    correctAnswer: 'c',
    explanation: '多人掩埋时先救最近的(最快能救出的),救出后使用标记功能屏蔽该信标,继续救援下一个。时间就是生命。',
    keyTakeaway: '多人掩埋先救最近的',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-041',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '以下哪些是雪崩掩埋后可能导致死亡的"致命三角"?(多选)',
    options: [
      { id: 'a', text: '窒息' },
      { id: 'b', text: '创伤' },
      { id: 'c', text: '失温' },
      { id: 'd', text: '饥饿' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '雪崩的"致命三角"是:窒息(最主要)、创伤(撞击和挤压)、失温(长时间掩埋)。',
    keyTakeaway: '窒息、创伤、失温是三大致命因素',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-042',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '探杆搜索时,网格间距通常应该是多少?',
    options: [
      { id: 'a', text: '10-15厘米' },
      { id: 'b', text: '25-30厘米' },
      { id: 'c', text: '50-75厘米' },
      { id: 'd', text: '1米' }
    ],
    correctAnswer: 'b',
    explanation: '标准探杆网格间距为25-30厘米,既能有效探测到被埋者,又不会过于耗时。',
    keyTakeaway: '探杆网格间距25-30厘米',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-043',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '你应该?',
    scenarioContext: '挖掘过程中,另一名队员的信标意外切换到搜索模式,干扰了你的搜索。',
    options: [
      { id: 'a', text: '继续搜索,忽略干扰' },
      { id: 'b', text: '让该队员立即将信标切回发射模式或关闭信标' },
      { id: 'c', text: '重新开始搜索' },
      { id: 'd', text: '所有人关闭信标' }
    ],
    correctAnswer: 'b',
    explanation: '只有搜索者应处于搜索模式,其他人必须保持发射模式。误切换会严重干扰搜索,应立即纠正。',
    keyTakeaway: '只有搜索者用搜索模式,其他人保持发射',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-044',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '失温(Hypothermia)患者的正确处理方式是?',
    options: [
      { id: 'a', text: '立即用热水浸泡四肢' },
      { id: 'b', text: '给予酒精饮料' },
      { id: 'c', text: '移除湿衣物,保温,给予温热(非烫)饮料(如清醒)' },
      { id: 'd', text: '剧烈按摩四肢促进血液循环' }
    ],
    correctAnswer: 'c',
    explanation: '失温处理:移除湿衣物,用干衣物/睡袋保温,如清醒可给温热饮料。避免热水、酒精和剧烈按摩。',
    keyTakeaway: '失温处理:保温、温饮,避免过热刺激',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-045',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '以下哪些情况下应该考虑终止搜救转为恢复遗体行动?(多选)',
    options: [
      { id: 'a', text: '持续搜救6小时仍未发现' },
      { id: 'b', text: '存在明显的二次雪崩危险威胁搜救人员安全' },
      { id: 'c', text: '夜幕降临' },
      { id: 'd', text: '被埋者救出时已有明显死亡特征且掩埋时间超过2小时' }
    ],
    correctAnswer: ['b', 'd'],
    explanation: '安全第一:二次雪崩危险时应撤离。医学判断:明显死亡特征+长时间掩埋可转为恢复。单纯时间长度或夜晚不是终止理由。',
    keyTakeaway: '安全威胁或明确死亡时考虑终止',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-046',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '粗略搜索(Coarse Search)阶段,正确的移动方式是?',
    options: [
      { id: 'a', text: '快速奔跑向信号源' },
      { id: 'b', text: '保持信标与身体同方向,稳定匀速前进,观察距离变化' },
      { id: 'c', text: '之字形移动' },
      { id: 'd', text: '停止不动,等待信号稳定' }
    ],
    correctAnswer: 'b',
    explanation: '粗略搜索时应保持信标方向,稳定前进,观察距离读数。距离减小说明方向正确,增大则需调整方向。',
    keyTakeaway: '粗略搜索稳定前进观察距离',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-047',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'medium',
    question: '雪崩信标的有效发射时间通常可以达到200-300小时。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '现代信标使用新电池可持续发射200-300小时,但应在电量降至50%时更换电池以确保可靠性。',
    keyTakeaway: '信标发射时间可达200-300小时',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-048',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'medium',
    question: '最可能的原因和解决方案是?',
    scenarioContext: '你在进行精确搜索,但最小距离显示在1.5米且无法进一步减小。',
    options: [
      { id: 'a', text: '被埋者在1.5米深,立即探杆定位' },
      { id: 'b', text: '信标故障,更换设备' },
      { id: 'c', text: '继续扩大搜索范围,可能被埋者偏离该点' },
      { id: 'd', text: '被埋者的信标电量耗尽' }
    ],
    correctAnswer: 'a',
    explanation: '当距离无法进一步减小时,显示的距离通常就是掩埋深度。此时应标记该点并使用探杆垂直探测确认。',
    keyTakeaway: '无法减小的距离通常等于埋深',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-049',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'medium',
    question: '有效的V型挖掘通道应该具备哪些特征?(多选)',
    options: [
      { id: 'a', text: '从上坡方向开始' },
      { id: 'b', text: '斜率约为1.5:1(水平:垂直)' },
      { id: 'c', text: '宽度足够1-2人同时工作' },
      { id: 'd', text: '垂直向下挖掘' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'V型通道从上坡方向以1.5:1斜率挖掘,宽度足够多人协作。垂直挖掘效率低且不安全。',
    keyTakeaway: 'V型通道:上坡、斜向、足够宽',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-050',
    type: 'single',
    category: 'rescue',
    difficulty: 'medium',
    question: '雪崩发生时如果无法逃脱,最后的自救动作应该是?',
    options: [
      { id: 'a', text: '双手抱头' },
      { id: 'b', text: '在雪停止前用一只手护住口鼻制造气囊,另一只手尽量向上伸' },
      { id: 'c', text: '团身蜷缩' },
      { id: 'd', text: '平躺放松' }
    ],
    correctAnswer: 'b',
    explanation: '雪崩停止前的关键动作:一手护住口鼻制造呼吸空间,另一手向上可能暴露在外或指示位置,显著提高生存和救援机会。',
    keyTakeaway: '一手护口鼻,一手向上',
    relatedPage: '/safety/rescue'
  },

  // Hard Questions (rs-051 to rs-070)
  {
    id: 'rs-051',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '最优的救援策略是?',
    scenarioContext: '你的3人团队遭遇雪崩,1人被埋。搜索15分钟后仍未找到,此时听到山上有异响,可能有二次雪崩风险。',
    options: [
      { id: 'a', text: '立即撤离到安全区域' },
      { id: 'b', text: '继续搜救,不放弃队友' },
      { id: 'c', text: '1人继续搜索,1人撤离呼救' },
      { id: 'd', text: '快速评估风险:如风险极高则撤离,如可控则继续快速搜救但保持警惕' }
    ],
    correctAnswer: 'd',
    explanation: '需要快速风险评估:如明确的二次雪崩征兆(大量积雪、裂缝、明显异响)必须撤离。如风险可控,可继续快速搜救但指定观察员监控山体。',
    keyTakeaway: '二次雪崩风险需要快速判断和决策',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-052',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '在多人掩埋场景中,正确的分诊(Triage)原则是?(多选)',
    options: [
      { id: 'a', text: '优先救援信号最强的' },
      { id: 'b', text: '优先救援最近/最快能救出的' },
      { id: 'c', text: '如有部分暴露的被埋者,优先处理' },
      { id: 'd', text: '评估所有被埋者位置后同时开始挖掘' }
    ],
    correctAnswer: ['b', 'c'],
    explanation: '多人掩埋分诊原则:优先最快能救出的(最近或部分暴露),最大化生存人数。救出一人后再救下一个,避免分散力量。',
    keyTakeaway: '优先最快能救出的,最大化生存人数',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-053',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '"通量线陷阱"(Flux Line Trap)是什么现象?',
    options: [
      { id: 'a', text: '信标电池耗尽导致信号消失' },
      { id: 'b', text: '单天线信标在某些角度接收不到信号,导致错误的方向指示' },
      { id: 'c', text: '多个信标信号互相干扰' },
      { id: 'd', text: '雪层密度导致信号衰减' }
    ],
    correctAnswer: 'b',
    explanation: '通量线陷阱是单天线信标的固有问题:当搜索者天线与发射者天线垂直时,信号最弱,可能给出错误方向。三天线信标解决了这个问题。',
    keyTakeaway: '通量线陷阱是单天线信标的方向错误',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-054',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '你应该如何处理?',
    scenarioContext: '你救出一名掩埋40分钟的患者,无呼吸无心跳,核心体温26°C(严重失温),面部有明显创伤。',
    options: [
      { id: 'a', text: '判定死亡,停止复苏' },
      { id: 'b', text: '进行CPR至少30分钟,同时复温,准备后送' },
      { id: 'c', text: '只进行保温,不做CPR' },
      { id: 'd', text: '简单CPR后立即后送' }
    ],
    correctAnswer: 'b',
    explanation: '严重失温患者可能处于"代谢冰箱"状态,心跳极慢难以察觉。应持续CPR并复温,有"没有温暖就没有死亡"(Not dead until warm and dead)原则。',
    keyTakeaway: '失温患者需持续CPR和复温,不轻易放弃',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-055',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '以下哪些因素可能导致雪崩信标的搜索距离显著缩短?(多选)',
    options: [
      { id: 'a', text: '被埋者的信标电量不足' },
      { id: 'b', text: '被埋者信标的天线方向不佳' },
      { id: 'c', text: '附近有金属矿藏或高压线' },
      { id: 'd', text: '雪层中含有大量水分' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '电量不足会降低发射功率,天线方向影响信号强度,湿雪会吸收电磁波。金属矿藏一般不影响457kHz低频信号。',
    keyTakeaway: '电量、天线方向、雪湿度影响信标距离',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-056',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '在组织化救援(Organized Rescue)到达前,伙伴救援团队的主要职责是?',
    options: [
      { id: 'a', text: '等待专业救援,保护现场' },
      { id: 'b', text: '尽快救出被埋者,进行急救,准备详细情况汇报' },
      { id: 'c', text: '下撤呼叫救援' },
      { id: 'd', text: '寻找更多人手' }
    ],
    correctAnswer: 'b',
    explanation: '伙伴救援是被埋者生存的关键,应立即搜救和急救。专业队到达前应准备汇报:被埋人数、已救出情况、雪崩特征等。',
    keyTakeaway: '立即救援,不等待专业队伍',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-057',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '最可能的原因和解决方案是?',
    scenarioContext: '你进行信标搜索,距离显示从8米减小到3米后,突然跳到25米,然后又回到5米,读数非常不稳定。',
    options: [
      { id: 'a', text: '你的信标故障,更换设备' },
      { id: 'b', text: '可能有多个被埋者,切换到多重掩埋模式' },
      { id: 'c', text: '信号干扰,关闭附近电子设备' },
      { id: 'd', text: '被埋者信标电量耗尽' }
    ],
    correctAnswer: 'b',
    explanation: '信号不稳定跳跃通常表示多个信标信号重叠。应使用信标的多重掩埋/标记功能,或更仔细地区分信号方向。',
    keyTakeaway: '读数跳跃提示多重掩埋',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-058',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '雪崩救援中的"黄金15分钟"后,生存曲线出现短暂平台期(约30-90分钟),主要原因是?',
    options: [
      { id: 'a', text: '统计误差' },
      { id: 'b', text: '有气囊的被埋者可以维持生存,而无气囊者已死亡' },
      { id: 'c', text: '救援队到达开始救援' },
      { id: 'd', text: '雪层变松容易呼吸' }
    ],
    correctAnswer: 'b',
    explanation: '生存曲线显示:15分钟后快速下降(无气囊窒息),30-90分钟有平台期(有气囊者生存),90分钟后再次下降(失温)。',
    keyTakeaway: '生存曲线反映气囊和失温的影响',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-059',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '以下哪些是有效的探杆搜索技巧?(多选)',
    options: [
      { id: 'a', text: '探杆应垂直于雪面插入' },
      { id: 'b', text: '快速插入并快速拔出以提高效率' },
      { id: 'c', text: '感受探杆触碰的反馈:柔软阻力可能是身体,硬阻力可能是岩石或冰' },
      { id: 'd', text: '在信标最小距离点周围呈螺旋状向外探测' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: '探杆技巧:垂直插入,仔细感受触感区分人体/岩石,从中心螺旋向外探测。不要过快,需要感受反馈。',
    keyTakeaway: '垂直、感受、螺旋探测',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-060',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '最优的急救措施是?',
    scenarioContext: '你救出的被埋者有呼吸但昏迷,右腿明显骨折,体温34°C(轻度失温),掩埋时间20分钟。',
    options: [
      { id: 'a', text: '立即固定骨折,然后后送' },
      { id: 'b', text: '保持侧卧位,保温,监测呼吸,简易固定骨折,呼叫救援准备后送' },
      { id: 'c', text: '让其平躺,大量饮水' },
      { id: 'd', text: '立即开始CPR' }
    ],
    correctAnswer: 'b',
    explanation: '昏迷但有呼吸者:侧卧位(复苏体位)防止窒息,保温处理失温,简易固定骨折,持续监测,准备专业后送。',
    keyTakeaway: '侧卧位、保温、固定、监测',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-061',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '直升机救援(HEMS)在雪崩救援中的主要作用是?',
    options: [
      { id: 'a', text: '快速运送救援人员到现场进行伙伴救援' },
      { id: 'b', text: '后送伤员和运送专业救援队,但通常无法在黄金15分钟内到达' },
      { id: 'c', text: '使用RECCO从空中搜索' },
      { id: 'd', text: '预防二次雪崩' }
    ],
    correctAnswer: 'b',
    explanation: '直升机主要用于伤员后送和运送专业救援队/设备,但调度和飞行时间通常超过黄金15分钟,无法替代伙伴救援。',
    keyTakeaway: '直升机用于后送和专业救援,非初期救援',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-062',
    type: 'truefalse',
    category: 'rescue',
    difficulty: 'hard',
    question: '如果被埋者掩埋超过2米深,即使有信标,伙伴救援的成功率也会显著降低。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '掩埋超过2米时挖掘时间显著增加(可能需要30-60分钟以上),生存率急剧下降。这强调了气囊背包的重要性(减少埋深)。',
    keyTakeaway: '超过2米埋深救援难度和时间显著增加',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-063',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '以下哪些情况可能导致信标搜索时的"幻影信号"或错误定位?(多选)',
    options: [
      { id: 'a', text: '被埋者携带多个信标' },
      { id: 'b', text: '信号反射(雪层或地形)' },
      { id: 'c', text: '搜索者的手机处于搜索模式' },
      { id: 'd', text: '被埋者的信标天线断裂但仍发射' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '幻影信号可能来自:多个信标(应只携带一个)、复杂地形的信号反射、天线损坏导致的不规则信号。手机不会处于搜索模式。',
    keyTakeaway: '多信标、反射、天线损坏会造成错误定位',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-064',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '正确的处理策略是?',
    scenarioContext: '5人团队遭遇雪崩,2人被埋,3人未埋。信标显示两个被埋者分别在18米和45米处。',
    options: [
      { id: 'a', text: '3人分成两组同时救援' },
      { id: 'b', text: '3人集中力量先救18米的,救出后再救45米的' },
      { id: 'c', text: '2人救18米的,1人救45米的' },
      { id: 'd', text: '先救45米的,因为可能埋得更深' }
    ],
    correctAnswer: 'b',
    explanation: '集中力量先救最近的(最快能救出):3人协同挖掘效率最高。救出一人后,该人恢复后可协助救第二人,最大化生存机会。',
    keyTakeaway: '集中力量逐个救援,不分散',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-065',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '探杆定位后,开始挖掘前应该做什么?',
    options: [
      { id: 'a', text: '立即开始垂直挖掘' },
      { id: 'b', text: '将探杆留在原位标记位置,评估埋深,规划V型挖掘通道,分配人员角色' },
      { id: 'c', text: '拔出探杆,标记该点' },
      { id: 'd', text: '呼叫更多人手' }
    ],
    correctAnswer: 'b',
    explanation: '探杆定位后:保留探杆标记位置和埋深,快速规划挖掘策略(方向、斜率、人员分工),然后高效执行。',
    keyTakeaway: '定位后规划挖掘策略再执行',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-066',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '什么是"战略性探杆搜索"(Strategic Probing)?',
    options: [
      { id: 'a', text: '在整个雪崩区域进行网格探杆搜索' },
      { id: 'b', text: '在可能的"捕捉点"(地形陷阱、树木周围)集中探杆搜索' },
      { id: 'c', text: '只在信标定位点探杆' },
      { id: 'd', text: '随机探杆' }
    ],
    correctAnswer: 'b',
    explanation: '战略性探杆指在无信标或信标失效时,根据雪崩动力学在高概率位置(地形凹陷、树木、岩石周围等)重点探测。',
    keyTakeaway: '战略性探杆针对高概率捕捉点',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-067',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '有效的救援团队组织应包括哪些角色分工?(多选)',
    options: [
      { id: 'a', text: '信标搜索者' },
      { id: 'b', text: '挖掘者和雪运输者' },
      { id: 'c', text: '安全观察员(监控二次雪崩)' },
      { id: 'd', text: '记录员(记录时间和过程)' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '完整的救援组织包括:搜索者、挖掘/运雪者、安全观察员、记录员(时间线对医疗很重要)。明确分工提高效率。',
    keyTakeaway: '明确角色分工提高救援效率',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-068',
    type: 'scenario',
    category: 'rescue',
    difficulty: 'hard',
    question: '你应该如何指导他?',
    scenarioContext: '你正在教新队员使用信标。他在精确搜索时总是找不到最小距离点,距离在1-2米之间波动。',
    options: [
      { id: 'a', text: '让他举高信标搜索' },
      { id: 'b', text: '指导他将信标贴近雪面,缓慢移动,进行十字交叉运动,仔细观察最小读数' },
      { id: 'c', text: '建议他更换信标' },
      { id: 'd', text: '告诉他直接开始探杆' }
    ],
    correctAnswer: 'b',
    explanation: '精确搜索技巧:信标贴近雪面(10-20cm),缓慢十字交叉运动,耐心寻找最小读数点。这是常见训练难点。',
    keyTakeaway: '精确搜索需要贴近雪面缓慢十字交叉',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-069',
    type: 'single',
    category: 'rescue',
    difficulty: 'hard',
    question: '在什么情况下,CPR可能对雪崩掩埋伤员弊大于利?',
    options: [
      { id: 'a', text: '掩埋时间超过1小时' },
      { id: 'b', text: '严重失温(核心体温<28°C)导致心室颤动,胸外按压可能诱发心脏骤停' },
      { id: 'c', text: '有骨折' },
      { id: 'd', text: 'CPR总是有益的' }
    ],
    correctAnswer: 'b',
    explanation: '严重失温时心脏极度敏感,粗暴移动或CPR可能诱发致命心律失常。需要轻柔处理,在专业医疗监控下复温。但野外环境下仍应CPR。',
    keyTakeaway: '严重失温CPR需谨慎,但野外环境仍应执行',
    relatedPage: '/safety/rescue'
  },
  {
    id: 'rs-070',
    type: 'multiple',
    category: 'rescue',
    difficulty: 'hard',
    question: '以下哪些是进行雪崩救援训练时的关键要点?(多选)',
    options: [
      { id: 'a', text: '在真实雪崩地形环境中进行' },
      { id: 'b', text: '计时训练,强调速度' },
      { id: 'c', text: '模拟多种场景(多人掩埋、深埋、设备故障)' },
      { id: 'd', text: '定期训练保持技能(每季至少一次)' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '有效训练包括:真实环境、计时(模拟压力)、多场景、定期重复。救援是肌肉记忆和团队协作,需要反复训练。',
    keyTakeaway: '真实环境、计时、多场景、定期训练',
    relatedPage: '/safety/rescue'
  }
];

export default questions;
