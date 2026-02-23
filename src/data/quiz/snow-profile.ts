import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy Questions (15)
  {
    id: 'sp-001',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪坑剖面的主要目的是什么?',
    options: [
      { id: 'a', text: '观察雪层结构和弱层' },
      { id: 'b', text: '测量雪的深度' },
      { id: 'c', text: '收集雪样本' },
      { id: 'd', text: '制作雪雕' }
    ],
    correctAnswer: 'a',
    explanation: '雪坑剖面的主要目的是观察雪层结构、识别弱层、评估雪崩风险。通过观察不同雪层的特性、硬度、晶体类型等,可以判断雪层稳定性。',
    keyTakeaway: '雪坑剖面是识别弱层和评估雪崩风险的关键工具',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-002',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪坑应该挖在阴面,避免阳光直射影响观察。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪坑的观察面应该朝北(北半球)或背对阳光,避免阳光直射导致雪层表面融化或反光,影响雪晶体观察和层位识别。',
    keyTakeaway: '雪坑观察面应避免阳光直射以保证观察质量',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-003',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '手套测试(Fist Test)中,拳头可以轻松插入表示雪的硬度等级是?',
    options: [
      { id: 'a', text: 'F-(极软)' },
      { id: 'b', text: '4F(中等)' },
      { id: 'c', text: '1F(硬)' },
      { id: 'd', text: 'K(极硬)' }
    ],
    correctAnswer: 'a',
    explanation: '手硬度测试分级:F-(拳头轻松插入,极软)、F(拳头用力插入)、4F(四指插入)、1F(单指插入)、P(铅笔插入)、K(刀片插入)。',
    keyTakeaway: '拳头轻松插入代表雪层极软(F-)',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-004',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪坑的标准深度应该挖到什么位置?',
    options: [
      { id: 'a', text: '至地面或不可穿透的旧雪层' },
      { id: 'b', text: '50厘米深即可' },
      { id: 'c', text: '只需要挖到最新降雪层' },
      { id: 'd', text: '1米深度固定标准' }
    ],
    correctAnswer: 'a',
    explanation: '雪坑应该挖到地面或不可穿透的旧雪层(如冰层、深霜层),以观察完整的雪层结构,特别是深埋弱层。',
    keyTakeaway: '雪坑应挖至地面或不可穿透层以观察完整雪层结构',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-005',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '压缩测试(CT)的分数越小,表示雪层越不稳定。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: 'CT分数表示击打次数,CT1-CT10表示很容易破坏(高风险),CT11-CT20表示中等稳定性,CT21-CT30表示较难破坏(较稳定)。分数越小越危险。',
    keyTakeaway: 'CT分数越小表示弱层越容易破坏,风险越高',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-006',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '以下哪种雪晶体类型最容易形成持久性弱层?',
    options: [
      { id: 'a', text: '深霜(Depth Hoar)' },
      { id: 'b', text: '圆粒雪(Rounded Grains)' },
      { id: 'c', text: '新雪晶体(Precipitation Particles)' },
      { id: 'd', text: '融化再冻结雪(Melt-Freeze Crust)' }
    ],
    correctAnswer: 'a',
    explanation: '深霜是由温度梯度变质形成的大颗粒空心晶体,结合力极弱,是最危险的持久性弱层类型,可以持续数周甚至数月。',
    keyTakeaway: '深霜是最危险的持久性弱层类型',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-007',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: 'Extended Column Test(ECT)中,ECTP比ECTN更危险。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: 'ECTP(Propagation)表示断裂会在雪柱中传播,说明弱层可以支持大范围破坏,是雪崩的关键条件。ECTN(No propagation)表示断裂不传播,风险较低。',
    keyTakeaway: 'ECTP表示断裂传播,是雪崩的高风险信号',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-008',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪层硬度测试中,P等级表示什么?',
    options: [
      { id: 'a', text: '铅笔可以插入' },
      { id: 'b', text: '拳头可以插入' },
      { id: 'c', text: '单指可以插入' },
      { id: 'd', text: '刀片可以插入' }
    ],
    correctAnswer: 'a',
    explanation: 'P等级(Pencil)表示需要用铅笔才能插入的硬度,比1F(单指)更硬,但比K(刀片)软。硬度序列:F- < F < 4F < 1F < P < K < I(冰)。',
    keyTakeaway: 'P等级表示铅笔硬度,介于手指和刀片之间',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-009',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪坑的宽度一般应该是多少?',
    options: [
      { id: 'a', text: '至少90厘米(用于ECT)' },
      { id: 'b', text: '30厘米即可' },
      { id: 'c', text: '越宽越好,至少2米' },
      { id: 'd', text: '没有具体要求' }
    ],
    correctAnswer: 'a',
    explanation: 'ECT需要90cm宽的雪柱,CT需要30cm,Rutschblock需要更大空间。标准雪坑宽度应至少90cm以支持各类稳定性测试。',
    keyTakeaway: '雪坑宽度应至少90厘米以进行完整测试',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-010',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪温测量应该在雪坑挖好后立即进行,避免温度变化。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪坑暴露在空气中会导致温度快速变化,特别是表层。应该在挖好雪坑后立即测量雪温,每隔10cm记录一次,以获得准确的温度梯度数据。',
    keyTakeaway: '雪温测量应在雪坑挖好后立即进行',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-011',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '表面霜(Surface Hoar)被埋藏后会成为什么?',
    options: [
      { id: 'a', text: '持久性弱层' },
      { id: 'b', text: '坚硬的板层' },
      { id: 'c', text: '稳定的圆粒雪' },
      { id: 'd', text: '无害的雪层' }
    ],
    correctAnswer: 'a',
    explanation: '表面霜是晴朗寒冷夜晚在雪表面形成的羽毛状晶体,结合力极弱。被新雪覆盖后会成为危险的持久性弱层,可导致板层雪崩。',
    keyTakeaway: '埋藏的表面霜是危险的持久性弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-012',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪层中的冰壳(Ice Crust)总是能提高雪层稳定性。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '冰壳可以作为滑动面(床面),特别是当其上方有板层时。薄脆的冰壳也可能破碎。但厚实的冰壳可以阻止断裂传播,起到加固作用。需要具体分析。',
    keyTakeaway: '冰壳可能成为滑动面,不一定提高稳定性',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-013',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '雪水当量(SWE)测量的是什么?',
    options: [
      { id: 'a', text: '雪中含有的水分重量' },
      { id: 'b', text: '雪的温度' },
      { id: 'c', text: '雪的硬度' },
      { id: 'd', text: '雪晶体的大小' }
    ],
    correctAnswer: 'a',
    explanation: '雪水当量(Snow Water Equivalent)是指雪融化后的水的深度或重量,反映了雪中实际含水量。用于评估降水量、雪崩规模、融雪径流等。',
    keyTakeaway: '雪水当量测量雪中的实际含水量',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-014',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'easy',
    question: '观察雪晶体类型时,应该使用什么工具?',
    options: [
      { id: 'a', text: '放大镜或晶体卡' },
      { id: 'b', text: '温度计' },
      { id: 'c', text: '铲子' },
      { id: 'd', text: '不需要工具,肉眼即可' }
    ],
    correctAnswer: 'a',
    explanation: '雪晶体很小,需要使用8-10倍放大镜或专用的晶体观察卡(黑色网格背景)来准确识别晶体类型、大小和形态。',
    keyTakeaway: '需要放大镜或晶体卡来准确识别雪晶体类型',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-015',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'easy',
    question: 'Rutschblock测试需要在雪坑旁边的独立雪柱上进行。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: 'Rutschblock需要一个2m×1.5m的独立雪块,通过在上面施加不同重量(滑雪者)来测试稳定性。需要在雪坑旁边单独切割出来。',
    keyTakeaway: 'Rutschblock测试需要独立切割的大型雪块',
    relatedPage: '/safety/crystal-types'
  },

  // Medium Questions (20)
  {
    id: 'sp-016',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '在雪层剖面中发现温度梯度为15°C/m,这意味着什么?',
    options: [
      { id: 'a', text: '强烈的温度梯度变质正在发生,可能形成深霜' },
      { id: 'b', text: '温度梯度很小,雪层稳定' },
      { id: 'c', text: '雪层正在融化' },
      { id: 'd', text: '温度测量有误' }
    ],
    correctAnswer: 'a',
    explanation: '温度梯度>10°C/m被认为是强梯度,会导致动力学变质(温度梯度变质),促进深霜、棱角雪晶等弱层形成。梯度越大,弱层形成越快。',
    keyTakeaway: '强温度梯度(>10°C/m)会促进弱层形成',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-017',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'medium',
    scenarioContext: '你在海拔2500米的北坡挖了一个雪坑。在距表面40cm处发现一层硬度为1F的薄层(2cm厚),其上下都是4F硬度的雪层。进行CT测试,结果为CT12,断裂发生在该薄层。',
    question: '这个发现最可能表明什么?',
    options: [
      { id: 'a', text: '存在弱层,需要进一步测试传播性' },
      { id: 'b', text: '雪层完全稳定,可以安全滑行' },
      { id: 'c', text: '该层不会导致雪崩' },
      { id: 'd', text: '只是正常的雪层变化' }
    ],
    correctAnswer: 'a',
    explanation: 'CT12表示中等不稳定性,硬度突变(1F夹在4F之间)是典型的弱层特征。还需要进行ECT测试评估传播性,结合地形和气象因素做综合判断。',
    keyTakeaway: 'CT结果配合硬度突变可识别弱层,需进一步测试传播性',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-018',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '以下哪些因素会影响雪坑测试的代表性?(多选)',
    options: [
      { id: 'a', text: '坡向(阴坡/阳坡)' },
      { id: 'b', text: '海拔高度' },
      { id: 'c', text: '风的影响' },
      { id: 'd', text: '植被覆盖' },
      { id: 'e', text: '观察者的经验水平' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '雪层结构受坡向(日照)、海拔(温度)、风(吹雪堆积)、植被(地表粗糙度)等因素影响很大。同一区域不同位置的雪层可能差异显著。观察者经验影响解读,但不影响实际雪层状况。',
    keyTakeaway: '雪坑测试结果受地形和气象因素影响,需多点观察',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-019',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '在ECT测试中,第5次轻拍时从肘部断裂并传播,应该记录为?',
    options: [
      { id: 'a', text: 'ECTP5' },
      { id: 'b', text: 'ECTPV' },
      { id: 'c', text: 'ECTN5' },
      { id: 'd', text: 'ECTX' }
    ],
    correctAnswer: 'a',
    explanation: 'ECT记录格式:结果+击打次数。ECTP=传播,ECTN=不传播,ECTPV=释放柱子时就传播,ECTX=30次后无破坏。数字表示击打次数阶段(轻拍、手腕、肘部对应不同击打力度)。',
    keyTakeaway: 'ECT记录包括传播性和击打次数',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-020',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'medium',
    scenarioContext: '雪坑剖面显示:表层30cm新雪(F硬度),下方有5mm厚的表面霜层,再下方是50cm的旧雪(P硬度)。ECT结果为ECTP8。',
    question: '根据这个剖面,应该采取什么行动?',
    options: [
      { id: 'a', text: '避免陡坡,新雪-表面霜界面有高雪崩风险' },
      { id: 'b', text: '可以正常滑行,雪层稳定' },
      { id: 'c', text: '只需避开极陡坡段' },
      { id: 'd', text: '等待更多降雪后再评估' }
    ],
    correctAnswer: 'a',
    explanation: 'ECTP8是非常危险的信号:传播+低击打次数。软的新雪在硬的旧雪上,中间夹着弱的表面霜,是经典的板层雪崩结构。应该避免陡坡和凸起地形。',
    keyTakeaway: 'ECTP+低击打次数+明显弱层=高雪崩风险',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-021',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '雪密度为400 kg/m³的雪层属于什么类型?',
    options: [
      { id: 'a', text: '湿雪或旧雪' },
      { id: 'b', text: '新降雪' },
      { id: 'c', text: '粉雪' },
      { id: 'd', text: '冰层' }
    ],
    correctAnswer: 'a',
    explanation: '新雪密度通常50-100 kg/m³,沉降雪100-300 kg/m³,旧雪/湿雪300-500 kg/m³,冰接近917 kg/m³。400 kg/m³属于高密度雪,通常是旧雪或湿雪。',
    keyTakeaway: '高密度雪(>300 kg/m³)通常是旧雪或湿雪',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-022',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '在同一天内,不同坡向的雪坑可能显示完全不同的雪层结构。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '阳坡接受更多日照,可能有融化-再冻结层;阴坡温度较低,保留原始雪层结构;风向也会导致不同坡向的吹雪堆积差异。雪层结构有很强的空间变异性。',
    keyTakeaway: '雪层结构有强烈的空间变异性,需要多点观察',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-023',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '识别弱层时,应该关注哪些特征?(多选)',
    options: [
      { id: 'a', text: '硬度突然变化' },
      { id: 'b', text: '晶体类型(深霜、表面霜、棱角雪晶)' },
      { id: 'c', text: '雪层颜色' },
      { id: 'd', text: '晶体大小差异' },
      { id: 'e', text: '雪层厚度' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '弱层识别关键特征:硬度突变(软层夹在硬层间)、弱晶体类型(深霜、表霜、棱角晶等)、晶体大小差异、稳定性测试结果。颜色和厚度不是弱层的主要识别特征。',
    keyTakeaway: '弱层识别关注硬度变化、晶体类型和大小差异',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-024',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'medium',
    scenarioContext: '你在进行CT测试时,第一次轻拍(CT1)就在距表面60cm处发生突然断裂,断裂面非常平整光滑。',
    question: '这个结果最可能意味着什么?',
    options: [
      { id: 'a', text: '存在非常弱的层面,雪崩风险很高' },
      { id: 'b', text: '测试操作有误,需要重做' },
      { id: 'c', text: '该深度的雪层很硬' },
      { id: 'd', text: '雪层正常,可以安全活动' }
    ],
    correctAnswer: 'a',
    explanation: 'CT1表示极易破坏的弱层,平整光滑的断裂面表明晶体间结合力很弱(如深霜、表霜)。这是高风险信号,需要立即进行ECT测试评估传播性。',
    keyTakeaway: 'CT1-CT10表示极易破坏的危险弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-025',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '棱角雪晶(Faceted Crystals)主要通过什么过程形成?',
    options: [
      { id: 'a', text: '温度梯度变质' },
      { id: 'b', text: '压力变质' },
      { id: 'c', text: '融化再冻结' },
      { id: 'd', text: '风力作用' }
    ],
    correctAnswer: 'a',
    explanation: '棱角雪晶(包括深霜)通过温度梯度变质形成。雪层内温度梯度导致水蒸气从暖端向冷端迁移,原有雪晶失去枝杈,形成大颗粒、弱结合的棱角晶体。',
    keyTakeaway: '棱角雪晶由温度梯度变质形成,结合力弱',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-026',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: 'Rutschblock测试中,RB2表示什么?',
    options: [
      { id: 'a', text: '第二次跳跃时雪块滑落' },
      { id: 'b', text: '单膝跪上时滑落' },
      { id: 'c', text: '站上去时滑落' },
      { id: 'd', text: '切割时就滑落' }
    ],
    correctAnswer: 'a',
    explanation: 'Rutschblock分级:RB1=切割时滑落,RB2=缓慢站上后滑落,RB3=一次跳跃时滑落,RB4=二次跳跃时滑落,RB5=多次跳跃后滑落,RB6=不滑落。RB1-3表示不稳定。',
    keyTakeaway: 'Rutschblock RB1-3表示雪层不稳定',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-027',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'medium',
    scenarioContext: '雪坑深度120cm,地面温度-2°C,雪面温度-14°C。雪层中未发现明显的弱层晶体,但整体雪质较松散。',
    question: '这种情况下应该关注什么?',
    options: [
      { id: 'a', text: '高温度梯度可能正在形成弱层,需持续监测' },
      { id: 'b', text: '没有弱层就没有风险' },
      { id: 'c', text: '温度低所以很安全' },
      { id: 'd', text: '雪太浅不用担心' }
    ],
    correctAnswer: 'a',
    explanation: '温度梯度=(−2−(−14))/1.2=10°C/m,属于强梯度。即使现在未见明显弱层,温度梯度变质正在进行,可能在数日内形成棱角雪晶或深霜。需要持续观察。',
    keyTakeaway: '强温度梯度会持续促进弱层发展',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-028',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '雪层中的圆粒雪(Rounded Grains)总是表示稳定的雪层。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '圆粒雪通常较稳定,但如果圆粒雪层很软(低密度),而其上方有硬板层,仍可能作为弱层。稳定性评估需要综合考虑硬度对比、板层属性等因素。',
    keyTakeaway: '雪层稳定性需要综合评估,不能仅凭晶体类型判断',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-029',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '以下哪些是板层(Slab)的典型特征?(多选)',
    options: [
      { id: 'a', text: '相对较硬(P、4F或更硬)' },
      { id: 'b', text: '有一定内聚性,可以成块' },
      { id: 'c', text: '极软,无结合力' },
      { id: 'd', text: '厚度通常在20cm以上' },
      { id: 'e', text: '必须是新雪' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '板层特征:相对较硬、有内聚性(风吹雪、沉降压实等形成)、足够厚度(通常>20cm)。板层可以是新雪、风吹雪或旧雪,关键是硬度和内聚性。',
    keyTakeaway: '板层的关键特征是硬度、内聚性和厚度',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-030',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '在雪坑记录中,使用国际分类符号"/\\"表示什么晶体类型?',
    options: [
      { id: 'a', text: '棱角雪晶(Faceted Crystals)' },
      { id: 'b', text: '圆粒雪(Rounded Grains)' },
      { id: 'c', text: '深霜(Depth Hoar)' },
      { id: 'd', text: '新雪晶体' }
    ],
    correctAnswer: 'a',
    explanation: '国际雪晶体分类符号:+新降雪、○圆粒雪、/\\棱角雪晶、□深霜、ˇ表面霜、⌒冰壳、💧湿雪等。棱角雪晶用/\\表示其多面体形态。',
    keyTakeaway: '棱角雪晶的国际符号是/\\',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-031',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'medium',
    scenarioContext: '你观察到雪层剖面中有一层5cm厚的冰壳,冰壳上方是40cm的新雪(4F硬度),下方是旧雪(P硬度)。ECT测试在冰壳处断裂,结果为ECTN18。',
    question: '这个情况的风险评估是什么?',
    options: [
      { id: 'a', text: '中等风险:虽然不传播,但冰壳可能是潜在滑动面' },
      { id: 'b', text: '高风险,立即撤离' },
      { id: 'c', text: '低风险,可以正常活动' },
      { id: 'd', text: '无法判断,需要更多信息' }
    ],
    correctAnswer: 'a',
    explanation: 'ECTN表示断裂不传播,但冰壳+新雪板层的组合仍需谨慎。冰壳可能在受力下破碎成为滑动面,特别是在凸起地形。属于中等风险,需要谨慎选择地形。',
    keyTakeaway: 'ECTN表示当前不传播,但仍需考虑地形和板层因素',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-032',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '雪层晶体大小从1mm增长到4mm,这个过程最可能是?',
    options: [
      { id: 'a', text: '温度梯度变质' },
      { id: 'b', text: '等温变质' },
      { id: 'c', text: '风的作用' },
      { id: 'd', text: '压力压实' }
    ],
    correctAnswer: 'a',
    explanation: '晶体快速增大(1mm→4mm)是温度梯度变质的典型特征,形成棱角雪晶或深霜。等温变质也会增大晶体,但速度慢得多(形成圆粒雪),且最终大小通常<2mm。',
    keyTakeaway: '晶体快速增大通常表明温度梯度变质',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-033',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'medium',
    question: 'CT和ECT测试应该在同一个雪坑的同一面进行,以保证一致性。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: 'CT和ECT应该在未扰动的雪层上进行,不能在已经做过测试的地方重复。通常在雪坑的不同侧面或不同区域进行,避免之前的测试影响结果。',
    keyTakeaway: '每个稳定性测试都应在未扰动的雪层上进行',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-034',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '床面(Bed Surface)在雪崩力学中的作用是什么?',
    options: [
      { id: 'a', text: '提供弱层失效后板层滑动的表面' },
      { id: 'b', text: '增加雪层稳定性' },
      { id: 'c', text: '吸收压力,防止雪崩' },
      { id: 'd', text: '没有特别作用' }
    ],
    correctAnswer: 'a',
    explanation: '床面是弱层下方的雪层或地面,当弱层失效后,上方的板层会在床面上滑动。光滑、坚硬的床面(如冰壳、旧雪)更容易促进板层滑动。',
    keyTakeaway: '床面是板层滑动的基础,光滑床面更危险',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-035',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'medium',
    question: '以下哪些情况会降低雪坑观察的准确性?(多选)',
    options: [
      { id: 'a', text: '阳光直射雪坑观察面' },
      { id: 'b', text: '用手触摸观察面' },
      { id: 'c', text: '挖掘过程中破坏雪层结构' },
      { id: 'd', text: '在风中进行观察' },
      { id: 'e', text: '使用金属铲挖掘' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '阳光会融化表面、手触摸会改变温度和结构、粗暴挖掘会破坏雪层、风会吹走表面雪晶。应该细致平整观察面,避免阳光直射,用刷子清理,在避风处观察。铲子材质不影响观察。',
    keyTakeaway: '雪坑观察需要细致操作,避免干扰因素',
    relatedPage: '/safety/crystal-types'
  },

  // Hard Questions (15)
  {
    id: 'sp-036',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '你在北坡(海拔2600m)和南坡(海拔2580m)各挖一个雪坑。北坡:总深度110cm,50cm处有深霜层(5cm厚,F-硬度,晶体4mm),CT8 ECTP8。南坡:总深度90cm,50cm处有冰壳(1cm厚),其上有圆粒雪(2mm),CT22 ECTN22。',
    question: '基于这两个剖面,你会如何规划滑行路线?',
    options: [
      { id: 'a', text: '完全避开北坡,优先选择南坡和缓地形' },
      { id: 'b', text: '两个坡都很危险,不应该滑行' },
      { id: 'c', text: '北坡更安全,因为深霜可以压实' },
      { id: 'd', text: '南坡的冰壳更危险,选择北坡' }
    ],
    correctAnswer: 'a',
    explanation: '北坡CT8 ECTP8是极高危险信号:深霜弱层+传播+低击打次数。南坡CT22 ECTN22表示相对稳定,虽有冰壳但不传播。应避开北坡及类似阴坡,选择南坡缓地形,避免凸起和陡坡。',
    keyTakeaway: '综合多个雪坑数据进行地形选择,优先避开ECTP区域',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-037',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '在评估雪层传播倾向(Propagation Propensity)时,最关键的因素组合是?',
    options: [
      { id: 'a', text: '弱层的脆性+板层的刚性+床面的光滑度' },
      { id: 'b', text: '雪的总深度+温度+湿度' },
      { id: 'c', text: '坡度+海拔+风速' },
      { id: 'd', text: '晶体大小+颜色+硬度' }
    ],
    correctAnswer: 'a',
    explanation: '传播倾向的关键三要素:1)弱层脆性(如深霜、表霜,低CT值),2)板层刚性(硬且有内聚性,能传递应力),3)光滑床面(利于滑动)。这三个条件同时满足时传播可能性最大。',
    keyTakeaway: '传播倾向取决于弱层脆性、板层刚性和床面光滑度',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-038',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '雪坑剖面显示两个弱层:30cm处CT15 ECTN15(表面霜,2mm);70cm处CT6 ECTP6(深霜,4mm)。上方有50cm的风吹雪板层(P硬度)。',
    question: '哪个弱层更值得关注,为什么?',
    options: [
      { id: 'a', text: '70cm的深霜层,因为CT6 ECTP6表示易破坏且会传播' },
      { id: 'b', text: '30cm的表霜层,因为更接近表面' },
      { id: 'c', text: '两个都无需关注,CT值都不太低' },
      { id: 'd', text: '表霜层更危险,因为ECTN比ECTP安全' }
    ],
    correctAnswer: 'a',
    explanation: '虽然两层都是弱层,但70cm深霜层有ECTP6(传播+极低击打数),是致命组合。30cm表霜层ECTN15表示不传播。深埋弱层虽然深,但一旦触发会导致大型板层雪崩,更危险。',
    keyTakeaway: '多弱层情况下,优先关注会传播且易破坏的深埋弱层',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-039',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '在进行雪层稳定性评估时,以下哪些因素的组合最能预测板层雪崩?(多选)',
    options: [
      { id: 'a', text: 'ECTP结果(传播)' },
      { id: 'b', text: '板层厚度>30cm' },
      { id: 'c', text: '弱层晶体类型(深霜/表霜)' },
      { id: 'd', text: '雪的颜色' },
      { id: 'e', text: '最近的气象因素(降雪/升温/风)' }
    ],
    correctAnswer: ['a', 'b', 'c', 'e'],
    explanation: '板层雪崩预测需要:1)ECTP(传播能力),2)足够厚的板层(通常>30cm),3)脆性弱层(深霜、表霜等),4)触发因素(新雪荷载、升温、风吹雪等)。雪的颜色不是关键因素。',
    keyTakeaway: '板层雪崩预测需要综合稳定性测试、雪层结构和气象因素',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-040',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '雪层中的"临界切应力"(Critical Shear Stress)由什么决定?',
    options: [
      { id: 'a', text: '弱层的抗剪强度与上覆板层施加的剪应力的平衡' },
      { id: 'b', text: '雪的温度' },
      { id: 'c', text: '晶体的大小' },
      { id: 'd', text: '坡度角度' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩发生在弱层的抗剪强度<板层施加的剪应力时。剪应力随板层厚度、密度、坡度增加而增大。临界状态是两者的平衡点,任何额外荷载(滑雪者、爆破)都可能触发破坏。',
    keyTakeaway: '雪崩触发取决于弱层强度与板层应力的平衡',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-041',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '连续三天观察同一雪坑:第1天CT18 ECTN18;第2天CT14 ECTN14;第3天CT9 ECTP9。弱层位置和类型相同(40cm深表面霜),期间有15cm新雪降落,无明显升温。',
    question: '这种变化趋势说明了什么?',
    options: [
      { id: 'a', text: '新雪荷载导致弱层接近破坏,且开始具备传播条件,危险急剧上升' },
      { id: 'b', text: '雪层正在稳定化,风险降低' },
      { id: 'c', text: '测试误差,结果不可靠' },
      { id: 'd', text: '温度变化导致的正常波动' }
    ],
    correctAnswer: 'a',
    explanation: 'CT值从18→14→9表示弱层强度下降,更易破坏。关键变化是ECTN→ECTP,说明板层在新雪荷载下变得更刚性,能够传播断裂。这是非常危险的恶化趋势,需要立即调整计划。',
    keyTakeaway: '连续观察可以发现雪层稳定性的恶化趋势',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-042',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '在什么条件下,深埋弱层(>100cm)仍然可能被人为触发?',
    options: [
      { id: 'a', text: '上覆雪层较薄的区域(如风吹凸起处)、弱层面积大且连续、板层刚性强' },
      { id: 'b', text: '深埋弱层永远不会被人为触发' },
      { id: 'c', text: '只有在雪很浅的地方才可能' },
      { id: 'd', text: '只能通过爆破触发' }
    ],
    correctAnswer: 'a',
    explanation: '深埋弱层可在"薄点"(凸起、风蚀区)被触发,然后传播到深雪区。如果弱层连续且板层刚性强,触发后的断裂可以传播很远。地形陷阱(沟谷、凸起)是关键危险点。',
    keyTakeaway: '深埋弱层可在薄雪区触发后传播,地形陷阱极度危险',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-043',
    type: 'image',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '(假设图片显示雪坑剖面:0-40cm新雪(F),40-42cm表霜(F-),42-80cm旧雪(P),80-120cm深霜(1F),120cm以下地面)进行ECT测试时,在哪个深度最可能发生传播性断裂?',
    options: [
      { id: 'a', text: '40cm的表霜层,因为是最浅的明显弱层' },
      { id: 'b', text: '80cm的深霜层,因为是最弱的持久性弱层' },
      { id: 'c', text: '两个都会断裂' },
      { id: 'd', text: '都不会断裂' }
    ],
    correctAnswer: 'a',
    explanation: '虽然80cm深霜层很弱,但40cm表霜层在较软的新雪荷载下、硬旧雪之上,更容易首先破坏。ECT通常在最浅的临界弱层断裂。深霜层虽弱但可能需要更大荷载触发。需要对两层都进行测试。',
    keyTakeaway: '多弱层情况下,浅层弱层通常先破坏,但深层弱层可能更致命',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-044',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '以下哪些是"抗剪强度"(Shear Strength)的影响因素?(多选)',
    options: [
      { id: 'a', text: '晶体间的结合类型和数量' },
      { id: 'b', text: '雪的密度' },
      { id: 'c', text: '温度(影响晶体烧结)' },
      { id: 'd', text: '雪层的颜色' },
      { id: 'e', text: '含水量' }
    ],
    correctAnswer: ['a', 'b', 'c', 'e'],
    explanation: '抗剪强度由晶体间结合决定,受以下因素影响:1)结合类型(烧结颈、锁扣),2)密度(接触点数量),3)温度(影响烧结速度),4)含水量(液态水削弱结合)。颜色不影响力学强度。',
    keyTakeaway: '抗剪强度受晶体结合、密度、温度和含水量影响',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-045',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '你在山脊附近的雪坑(海拔2800m)中发现:表层20cm风吹雪(K硬度,密度450 kg/m³),下方35cm处有3cm厚的近地深霜层(F-硬度,晶体5mm,密度200 kg/m³),CT4 ECTP4。',
    question: '这个剖面的最大危险是什么?',
    options: [
      { id: 'a', text: '极硬风板+极弱深霜+极低CT值+传播=完美的致命雪崩配置' },
      { id: 'b', text: '风板太硬,不会破坏' },
      { id: 'c', text: '深霜层太薄,不会导致大雪崩' },
      { id: 'd', text: '风板会保护下方雪层,增加稳定性' }
    ],
    correctAnswer: 'a',
    explanation: '这是最危险的配置:1)极硬风板(K,450kg/m³)形成刚性板层,2)极弱近地深霜(CT4 ECTP4),3)弱层在底部,一旦触发整个雪层都会滑动。山脊风吹区这种结构很常见,极度危险。',
    keyTakeaway: '硬风板+近地深霜+ECTP低值=最危险的雪崩配置',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-046',
    type: 'single',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '"残余强度"(Residual Strength)在雪崩动力学中指什么?',
    options: [
      { id: 'a', text: '弱层破坏后剩余的摩擦阻力,影响雪崩传播距离' },
      { id: 'b', text: '板层的最大强度' },
      { id: 'c', text: '雪崩停止后的雪堆硬度' },
      { id: 'd', text: '弱层破坏前的强度' }
    ],
    correctAnswer: 'a',
    explanation: '残余强度是弱层破坏后的剩余抗剪强度(主要是摩擦力)。如果残余强度很低(如深霜、表霜),断裂会传播很远。如果残余强度较高,传播可能停止。影响ECTP/N结果。',
    keyTakeaway: '残余强度低的弱层更容易长距离传播',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-047',
    type: 'truefalse',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '在同一弱层上,CT值和ECT传播性之间没有必然联系,可以出现CT30但ECTP的情况。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: 'CT测试的是局部强度,ECT测试的是传播倾向。可能存在局部强度高(CT30)但在更大尺度上(90cm柱)仍会传播的情况,特别是当板层很硬、弱层脆性高时。两个测试提供不同信息。',
    keyTakeaway: 'CT和ECT测试不同属性,需要结合评估',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-048',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '你在相同海拔、坡向的两个地点(相距200m)挖雪坑。地点A:CT8 ECTP8,弱层60cm;地点B:CT25 ECTN25,未找到明显弱层。两个雪坑总深度、雪层数量相似。',
    question: '这种空间变异性说明什么?',
    options: [
      { id: 'a', text: '雪层结构有强烈空间变异性,需要多点观察,选择路线时要考虑微地形' },
      { id: 'b', text: '其中一个测试肯定有误' },
      { id: 'c', text: '可以忽略A点,因为B点显示稳定' },
      { id: 'd', text: '200m距离太近,不应该有差异' }
    ],
    correctAnswer: 'a',
    explanation: '雪层具有高度空间变异性,受微地形、风、植被影响。即使相距很近,也可能有显著差异。弱层可能不连续,或在某些区域更发育。需要多点观察,采用保守策略(按最危险情况决策)。',
    keyTakeaway: '雪层有强烈空间变异性,需要多点观察和保守决策',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-049',
    type: 'multiple',
    category: 'snow-profile',
    difficulty: 'hard',
    question: '以下哪些是"板层释放"(Slab Release)必须同时满足的条件?(多选)',
    options: [
      { id: 'a', text: '存在弱层' },
      { id: 'b', text: '弱层上方有内聚性板层' },
      { id: 'c', text: '初始破坏能够传播' },
      { id: 'd', text: '坡度必须>45度' },
      { id: 'e', text: '存在触发荷载(自然或人为)' }
    ],
    correctAnswer: ['a', 'b', 'c', 'e'],
    explanation: '板层雪崩四要素:1)弱层,2)板层(内聚性),3)传播能力,4)触发荷载。坡度通常>30度即可,不一定要45度。这四个条件缺一不可。',
    keyTakeaway: '板层雪崩需要弱层、板层、传播性和触发荷载四个条件',
    relatedPage: '/safety/crystal-types'
  },
  {
    id: 'sp-050',
    type: 'scenario',
    category: 'snow-profile',
    difficulty: 'hard',
    scenarioContext: '研究表明某区域的深霜弱层已经存在6周。最近3天无新增降雪,但有持续-2°C的升温(之前是-12°C)。今天的雪坑测试显示:CT从上周的CT15降到CT10,ECT从ECTN15变为ECTP10。',
    question: '升温导致稳定性恶化的机制最可能是什么?',
    options: [
      { id: 'a', text: '升温减小温度梯度,板层烧结变硬变刚性,能更好地传播应力' },
      { id: 'b', text: '升温导致雪融化,直接弱化弱层' },
      { id: 'c', text: '升温总是增加稳定性,测试有误' },
      { id: 'd', text: '升温没有影响,只是自然波动' }
    ],
    correctAnswer: 'a',
    explanation: '升温减小温度梯度,促进板层烧结,使其变硬、变刚性。虽然弱层本身可能略有增强,但板层刚性增加使其更能传播应力(ECTN→ECTP),整体危险性上升。这是"升温悖论"——短期升温可能增加而非降低风险。',
    keyTakeaway: '升温可能通过增强板层刚性而增加传播风险',
    relatedPage: '/safety/crystal-types'
  }
];

export default questions;
