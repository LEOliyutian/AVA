import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy Questions (20 total)
  {
    id: 'dc-001',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '雪崩决策的三个阶段是什么?',
    options: [
      { id: 'a', text: '出发前、途中、现场' },
      { id: 'b', text: '早晨、中午、晚上' },
      { id: 'c', text: '计划、执行、总结' },
      { id: 'd', text: '观察、分析、行动' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩决策分为三个关键阶段:出发前(规划和准备)、途中(持续评估)、现场(即时决策)。',
    keyTakeaway: '决策是一个持续的过程,需要在每个阶段进行评估和调整。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-002',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '明显线索法(Obvious Clues Method)是一种简化的雪崩风险评估工具。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '明显线索法通过识别明显的危险信号(如近期雪崩、开裂声、沉降)来快速评估风险,是AIARE推荐的简化决策工具。',
    keyTakeaway: '明显线索法帮助快速识别高危情况,降低决策复杂度。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-003',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '以下哪项是"明显线索"?',
    options: [
      { id: 'a', text: '近24小时内发生的雪崩' },
      { id: 'b', text: '天空有云' },
      { id: 'c', text: '雪是白色的' },
      { id: 'd', text: '温度低于0度' }
    ],
    correctAnswer: 'a',
    explanation: '近期雪崩是最明显的危险信号之一,表明雪层不稳定。天气条件需要结合具体情况分析。',
    keyTakeaway: '近期雪崩活动是最直接的危险警告。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-004',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '确认偏差(Confirmation Bias)是指只关注支持自己预设结论的信息。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '确认偏差是一种认知偏差,人们倾向于寻找、解释和记住支持自己原有信念的信息,而忽略矛盾的证据。',
    keyTakeaway: '要有意识地寻找反对自己计划的证据,避免确认偏差。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-005',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '出发前决策阶段最重要的任务是什么?',
    options: [
      { id: 'a', text: '制定详细的行程计划和应急方案' },
      { id: 'b', text: '购买最新的装备' },
      { id: 'c', text: '锻炼身体' },
      { id: 'd', text: '预订住宿' }
    ],
    correctAnswer: 'a',
    explanation: '出发前需要充分规划路线、评估风险、制定应急预案,并确保团队成员了解计划。',
    keyTakeaway: '充分的前期规划是安全的基础。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-006',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '"专家光环效应"(Expert Halo)指的是什么?',
    options: [
      { id: 'a', text: '盲目信任有经验的人,不做独立判断' },
      { id: 'b', text: '专家发出的光芒' },
      { id: 'c', text: '专业认证标志' },
      { id: 'd', text: '专家使用的特殊装备' }
    ],
    correctAnswer: 'a',
    explanation: '专家光环效应是指过度依赖经验丰富者的判断,而忽视自己的观察和评估,即使专家也可能犯错。',
    keyTakeaway: '每个人都应该进行独立观察和判断,不盲从权威。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-007',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '群体思维(Groupthink)会降低决策质量。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '群体思维导致成员为了维持和谐而压制异议,忽视风险信号,做出危险决策。',
    keyTakeaway: '鼓励团队成员表达不同意见,避免群体思维陷阱。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-008',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '以下哪项不属于常见的认知陷阱?',
    options: [
      { id: 'a', text: '天气预报' },
      { id: 'b', text: '熟悉性偏差' },
      { id: 'c', text: '承诺升级' },
      { id: 'd', text: '稀缺效应' }
    ],
    correctAnswer: 'a',
    explanation: '天气预报是客观信息工具,不是认知陷阱。熟悉性偏差、承诺升级、稀缺效应都是常见的决策陷阱。',
    keyTakeaway: '识别常见认知陷阱有助于做出理性决策。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-009',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '"熟悉性偏差"(Familiarity Bias)是指?',
    options: [
      { id: 'a', text: '认为熟悉的地形就是安全的' },
      { id: 'b', text: '只和熟悉的人一起滑雪' },
      { id: 'c', text: '使用熟悉的装备' },
      { id: 'd', text: '选择熟悉的时间出行' }
    ],
    correctAnswer: 'a',
    explanation: '熟悉性偏差导致人们低估熟悉环境中的风险,即使雪崩条件已经改变,仍认为"以前都没事"。',
    keyTakeaway: '熟悉的地形不等于安全,每次都要重新评估条件。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-010',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '途中决策阶段需要持续观察和评估雪崩条件。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '途中决策是动态过程,需要不断收集新信息(天气变化、雪层观察、地形特征)并调整计划。',
    keyTakeaway: '保持警觉,持续评估,随时准备改变计划。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-011',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '"承诺升级"(Commitment Bias)的表现是?',
    options: [
      { id: 'a', text: '已经走了很远,不想放弃而继续冒险' },
      { id: 'b', text: '承诺一定要登顶' },
      { id: 'c', text: '承诺购买新装备' },
      { id: 'd', text: '承诺下次再来' }
    ],
    correctAnswer: 'a',
    explanation: '承诺升级是指因为已经投入时间、精力、金钱,不愿意放弃目标,即使风险已经超出可接受范围。',
    keyTakeaway: '沉没成本不应影响安全决策,该撤退时果断撤退。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-012',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '"稀缺效应"(Scarcity)在雪崩决策中的表现是?',
    options: [
      { id: 'a', text: '认为粉雪机会难得,冒险追求' },
      { id: 'b', text: '雪很少' },
      { id: 'c', text: '时间不够' },
      { id: 'd', text: '装备短缺' }
    ],
    correctAnswer: 'a',
    explanation: '稀缺效应导致人们因为"机会难得"(好天气、好雪况、难得的假期)而降低风险意识,做出冒险决策。',
    keyTakeaway: '不要因为"机会难得"而忽视安全,山永远在那里。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-013',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '现场决策阶段应该使用简单、快速的决策工具。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '在斜坡现场,时间和环境限制要求使用简化工具(如明显线索法、坡度测量)快速决策。',
    keyTakeaway: '现场决策需要简单高效,提前练习决策流程。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-014',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: 'AIARE的核心理念是什么?',
    options: [
      { id: 'a', text: '通过教育降低雪崩风险' },
      { id: 'b', text: '禁止进入雪崩地形' },
      { id: 'c', text: '依赖救援队' },
      { id: 'd', text: '只在晴天出行' }
    ],
    correctAnswer: 'a',
    explanation: 'AIARE(美国雪崩协会)通过系统化教育和决策框架,帮助人们识别、评估和管理雪崩风险。',
    keyTakeaway: '教育和培训是雪崩安全的基础。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-015',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '团队决策中,谁应该参与风险评估?',
    options: [
      { id: 'a', text: '所有团队成员' },
      { id: 'b', text: '只有领队' },
      { id: 'c', text: '最有经验的人' },
      { id: 'd', text: '第一次来的新人' }
    ],
    correctAnswer: 'a',
    explanation: '每个团队成员都应该独立观察、评估风险并分享信息,集体智慧优于个人判断。',
    keyTakeaway: '鼓励所有成员参与决策,分享观察和担忧。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-016',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '折返决策应该在出发前就设定明确的触发条件。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '提前设定折返条件(时间、天气、雪况、团队状态)可以避免现场犹豫,降低承诺升级风险。',
    keyTakeaway: '设定清晰的折返触发条件,并严格执行。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-017',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '以下哪项是有效的沟通协议?',
    options: [
      { id: 'a', text: '任何成员都可以随时喊停' },
      { id: 'b', text: '只有领队能做决定' },
      { id: 'c', text: '投票决定是否继续' },
      { id: 'd', text: '保持沉默跟随大队' }
    ],
    correctAnswer: 'a',
    explanation: '有效的团队沟通应该赋予任何成员"一票否决权",当有人感到不安全时,整个团队应该停下来重新评估。',
    keyTakeaway: '建立开放的沟通环境,尊重每个人的安全顾虑。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-018',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '行前规划应该包括哪些内容?',
    options: [
      { id: 'a', text: '路线、天气、雪崩预报、应急计划' },
      { id: 'b', text: '只需要看天气预报' },
      { id: 'c', text: '只需要带好装备' },
      { id: 'd', text: '跟着有经验的人就行' }
    ],
    correctAnswer: 'a',
    explanation: '完整的行前规划包括:查看雪崩预报、分析地形、检查天气、准备装备、制定应急方案、告知他人行程。',
    keyTakeaway: '充分的计划准备是安全的第一步。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-019',
    type: 'truefalse',
    category: 'decision',
    difficulty: 'easy',
    question: '持续评估意味着在整个行程中不断收集和分析新信息。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩条件是动态变化的,需要持续观察天气、雪层、地形和团队状态,及时调整决策。',
    keyTakeaway: '决策不是一次性的,而是持续的过程。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-020',
    type: 'single',
    category: 'decision',
    difficulty: 'easy',
    question: '雪崩地形暴露度(Terrain Exposure)评估的是什么?',
    options: [
      { id: 'a', text: '如果发生雪崩,后果有多严重' },
      { id: 'b', text: '地形有多陡' },
      { id: 'c', text: '晒太阳的程度' },
      { id: 'd', text: '能见度高低' }
    ],
    correctAnswer: 'a',
    explanation: '地形暴露度评估的是潜在后果:雪崩路径长度、地形陷阱(沟谷、树木、悬崖)、逃生可能性等。',
    keyTakeaway: '不仅要评估雪崩可能性,还要评估潜在后果的严重性。',
    relatedPage: '/safety/decision'
  },

  // Medium Questions (25 total)
  {
    id: 'dc-021',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你计划好的路线遇到明显开裂声(Whumpfing),但天气完美,粉雪诱人。你应该怎么做?',
    options: [
      { id: 'a', text: '立即折返,选择更保守的地形' },
      { id: 'b', text: '小心翼翼地继续,减小队伍间距' },
      { id: 'c', text: '加快速度通过危险区域' },
      { id: 'd', text: '挖雪坑详细分析再决定' }
    ],
    correctAnswer: 'a',
    explanation: '开裂声是明显线索中的红色警报,表示雪层极不稳定,应立即撤离到安全地形。此时不应继续前进或在现场挖坑。',
    keyTakeaway: '明显的危险信号出现时,果断放弃计划,安全第一。',
    relatedPage: '/safety/decision',
    scenarioContext: '你和朋友计划攀登一条经典路线,前一天降雪30cm,早晨天气转晴。'
  },
  {
    id: 'dc-022',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '明显线索法中的"明显线索"包括哪些?(多选)',
    options: [
      { id: 'a', text: '近期雪崩活动' },
      { id: 'b', text: '开裂声和沉降' },
      { id: 'c', text: '雪崩预报为高危或极端' },
      { id: 'd', text: '坡度大于30度' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '明显线索包括:近期雪崩、开裂/沉降、高危预报等直接危险信号。坡度是地形因素,不是"明显线索"。',
    keyTakeaway: '识别并响应明显线索是快速决策的关键。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-023',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '团队中最有经验的成员说"没问题,我来过很多次",但你观察到新雪和风吹雪迹象。你应该?',
    options: [
      { id: 'a', text: '提出你的担忧,建议进行雪层测试' },
      { id: 'b', text: '相信专家的判断,跟随前进' },
      { id: 'c', text: '保持沉默,以免显得无知' },
      { id: 'd', text: '独自离开团队' }
    ],
    correctAnswer: 'a',
    explanation: '这是避免"专家光环"陷阱的情况。应该勇敢提出观察到的证据,建议团队重新评估。经验不能替代当前条件分析。',
    keyTakeaway: '尊重但不盲从,基于观察提出质疑是负责任的行为。',
    relatedPage: '/safety/decision',
    scenarioContext: '你参加了一个高级滑雪团队,领队有20年后山经验。'
  },
  {
    id: 'dc-024',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '三阶段决策模型中,"途中决策"的核心任务是?',
    options: [
      { id: 'a', text: '持续观察,验证或修正行前假设' },
      { id: 'b', text: '尽快到达目的地' },
      { id: 'c', text: '拍照记录' },
      { id: 'd', text: '保持队形' }
    ],
    correctAnswer: 'a',
    explanation: '途中决策是验证行前计划的阶段,通过实地观察(天气、雪况、地形)来确认或调整计划,是动态决策过程。',
    keyTakeaway: '途中决策是连接计划和执行的关键环节。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-025',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你的团队已经徒步2小时接近目标雪坡,此时发现坡面有新的风板。团队有人说"都走这么远了,试试看吧"。这是什么陷阱?',
    options: [
      { id: 'a', text: '承诺升级(Commitment Bias)' },
      { id: 'b', text: '确认偏差' },
      { id: 'c', text: '熟悉性偏差' },
      { id: 'd', text: '群体思维' }
    ],
    correctAnswer: 'a',
    explanation: '这是典型的承诺升级陷阱,因为已经投入时间和精力,不愿意放弃目标。正确做法是忽略沉没成本,基于当前风险做决策。',
    keyTakeaway: '已经付出的代价不应影响安全决策,该撤就撤。',
    relatedPage: '/safety/decision',
    scenarioContext: '天气晴朗,但风力增强,你看到雪坡上有明显的风吹雪沉积。'
  },
  {
    id: 'dc-026',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '有效的团队沟通协议应该包括哪些要素?(多选)',
    options: [
      { id: 'a', text: '任何人都可以提出安全顾虑' },
      { id: 'b', text: '定期进行团队检查(huddle)' },
      { id: 'c', text: '使用统一的信号和术语' },
      { id: 'd', text: '领队单独做所有决策' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '有效沟通包括:开放的表达环境、定期团队讨论、标准化术语。决策应该是参与式的,不是独裁的。',
    keyTakeaway: '建立清晰的沟通协议,确保信息流通和集体决策。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-027',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你经常滑的一条路线,今天雪崩预报显示"中度危险"。你认为"以前都没事,应该还行"。这是什么偏差?',
    options: [
      { id: 'a', text: '熟悉性偏差(Familiarity Bias)' },
      { id: 'b', text: '确认偏差' },
      { id: 'c', text: '专家光环' },
      { id: 'd', text: '稀缺效应' }
    ],
    correctAnswer: 'a',
    explanation: '这是熟悉性偏差的典型表现,因为地形熟悉而低估风险。雪崩条件每天不同,熟悉不等于安全。',
    keyTakeaway: '每次出行都要重新评估,不因熟悉而麻痹大意。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是你这个雪季第10次滑这条线,从未遇到问题。'
  },
  {
    id: 'dc-028',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '在"现场决策"阶段,如果观察到雪层测试显示不稳定,最优先的行动是?',
    options: [
      { id: 'a', text: '选择更安全的路线或撤退' },
      { id: 'b', text: '做更多测试以确认' },
      { id: 'c', text: '减小队伍间距小心通过' },
      { id: 'd', text: '等待天气变化' }
    ],
    correctAnswer: 'a',
    explanation: '现场测试显示不稳定时,应立即采取保守措施:避开可疑地形或撤退。不应继续测试或冒险通过。',
    keyTakeaway: '现场决策要快速果断,风险信号出现即采取行动。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-029',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '天气预报说下午有暴风雪,但现在是完美的晴天粉雪。你的朋友说"这么好的雪一年难得几次,抓紧滑几趟"。这属于?',
    options: [
      { id: 'a', text: '稀缺效应(Scarcity)' },
      { id: 'b', text: '确认偏差' },
      { id: 'c', text: '群体思维' },
      { id: 'd', text: '承诺升级' }
    ],
    correctAnswer: 'a',
    explanation: '这是稀缺效应的表现,因为"机会难得"而忽视了即将到来的天气风险。应该在安全窗口内活动并留足撤退时间。',
    keyTakeaway: '不要因为"难得"而冒险,机会永远会再来。',
    relatedPage: '/safety/decision',
    scenarioContext: '已经是上午10点,预报12点开始变天,你距离停车场1.5小时。'
  },
  {
    id: 'dc-030',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '行前规划阶段应该查看哪些信息源?(多选)',
    options: [
      { id: 'a', text: '雪崩预报中心的危险等级和问题类型' },
      { id: 'b', text: '天气预报(降雪、风、温度)' },
      { id: 'c', text: '地形图和坡度分析' },
      { id: 'd', text: '社交媒体上的滑雪视频' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '行前规划需要专业信息源:官方雪崩预报、天气预报、地形分析。社交媒体视频娱乐性强但不能作为决策依据。',
    keyTakeaway: '依赖权威、及时、专业的信息源做计划。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-031',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '团队中出现意见分歧时,最佳的处理方式是?',
    options: [
      { id: 'a', text: '停下来讨论,采用最保守的方案' },
      { id: 'b', text: '投票决定' },
      { id: 'c', text: '听领队的' },
      { id: 'd', text: '分头行动' }
    ],
    correctAnswer: 'a',
    explanation: '意见分歧说明存在不确定性,应该停下来充分讨论,采纳最保守的建议。安全决策不应该多数决或独裁。',
    keyTakeaway: '分歧是重要信号,需要停下来重新评估。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-032',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你看到雪崩预报显示"高度危险",但你只关注"部分地形可以安全通行"的描述。这是什么偏差?',
    options: [
      { id: 'a', text: '确认偏差(Confirmation Bias)' },
      { id: 'b', text: '熟悉性偏差' },
      { id: 'c', text: '专家光环' },
      { id: 'd', text: '承诺升级' }
    ],
    correctAnswer: 'a',
    explanation: '这是确认偏差的表现:选择性关注支持自己想法(想出去滑雪)的信息,忽视整体风险等级。',
    keyTakeaway: '全面客观地解读预报,不要只看想看的部分。',
    relatedPage: '/safety/decision',
    scenarioContext: '你已经计划这次行程一个月,朋友都已经到齐。'
  },
  {
    id: 'dc-033',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: 'AIARE决策框架中,地形选择的原则是?',
    options: [
      { id: 'a', text: '匹配团队能力和当前雪崩条件' },
      { id: 'b', text: '选择最陡的坡面' },
      { id: 'c', text: '跟随其他滑雪者的轨迹' },
      { id: 'd', text: '只去开发过的区域' }
    ],
    correctAnswer: 'a',
    explanation: 'AIARE强调地形选择应该综合考虑:团队技能、装备、经验、当前雪崩危险等级和问题类型。',
    keyTakeaway: '地形选择要与实际条件和能力相匹配,不冒进。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-034',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '以下哪些因素会增加群体思维(Groupthink)的风险?(多选)',
    options: [
      { id: 'a', text: '团队凝聚力很强,成员不愿意破坏气氛' },
      { id: 'b', text: '领队权威性很高' },
      { id: 'c', text: '时间压力大,需要快速决策' },
      { id: 'd', text: '团队成员来自不同背景' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '群体思维在高凝聚力、强权威、时间压力下更易发生。多元化团队反而能提供不同视角,降低群体思维风险。',
    keyTakeaway: '识别群体思维的诱因,主动鼓励异议。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-035',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你在途中看到其他滑雪者刚刚滑过同一坡面没有触发雪崩,你的团队准备跟随。这个决策忽略了什么?',
    options: [
      { id: 'a', text: '雪层可能已经被削弱,下一个通过者风险更高' },
      { id: 'b', text: '其他滑雪者的技术水平' },
      { id: 'c', text: '时间因素' },
      { id: 'd', text: '天气变化' }
    ],
    correctAnswer: 'a',
    explanation: '之前的滑雪者可能已经对雪层造成应力累积,后续通过者触发雪崩的风险可能更高。此外,不同路线和技术也影响触发概率。',
    keyTakeaway: '不要盲目跟随他人轨迹,每次通过都是独立风险。',
    relatedPage: '/safety/decision',
    scenarioContext: '你看到一组4人团队依次滑过一个35度的坡面。'
  },
  {
    id: 'dc-036',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '折返决策的"触发点"应该在什么时候设定?',
    options: [
      { id: 'a', text: '出发前规划阶段' },
      { id: 'b', text: '到达现场后' },
      { id: 'c', text: '遇到困难时' },
      { id: 'd', text: '不需要设定' }
    ],
    correctAnswer: 'a',
    explanation: '折返触发点(时间、天气变化、体力、风险信号)应该在出发前清晰定义,避免现场犹豫和承诺升级。',
    keyTakeaway: '提前设定撤退标准,执行时不妥协。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-037',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '团队中有人提出担忧,但其他人都想继续,最后这个人选择沉默跟随。这反映了什么问题?',
    options: [
      { id: 'a', text: '团队沟通协议失效,缺乏心理安全感' },
      { id: 'b', text: '这个人不够自信' },
      { id: 'c', text: '其他人更有经验' },
      { id: 'd', text: '正常的团队动态' }
    ],
    correctAnswer: 'a',
    explanation: '这表明团队缺乏心理安全感,成员不敢坚持自己的顾虑。有效的团队应该鼓励并尊重任何安全顾虑。',
    keyTakeaway: '建立支持性环境,确保每个人都能表达担忧。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一个6人团队,其中一个新成员感到不安但没有说出来。'
  },
  {
    id: 'dc-038',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '地形暴露度评估时,以下哪种情况后果最严重?',
    options: [
      { id: 'a', text: '雪崩路径尽头有树林、岩石或悬崖(地形陷阱)' },
      { id: 'b', text: '开阔平缓的雪崩路径' },
      { id: 'c', text: '短距离的陡坡' },
      { id: 'd', text: '有逃生路线的坡面' }
    ],
    correctAnswer: 'a',
    explanation: '地形陷阱(沟谷、树木、岩石、悬崖)会大幅增加雪崩后果的严重性,即使是小规模雪崩也可能致命。',
    keyTakeaway: '识别并避开地形陷阱,它们会放大雪崩后果。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-039',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '持续评估过程中应该观察哪些方面?(多选)',
    options: [
      { id: 'a', text: '天气变化(风、温度、降雪)' },
      { id: 'b', text: '雪层信号(开裂、沉降、新雪崩)' },
      { id: 'c', text: '团队状态(疲劳、情绪、技能)' },
      { id: 'd', text: '社交媒体更新' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '持续评估包括:环境条件(天气、雪层)、地形特征、团队动态。这些因素都会影响风险水平。',
    keyTakeaway: '全方位观察,动态调整计划。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-040',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你的团队计划攀登北坡,雪崩预报说"北坡和东坡风板不稳定"。但团队想"试试看",毕竟计划了很久。应该如何应对?',
    options: [
      { id: 'a', text: '改变计划,选择南坡或西坡的替代路线' },
      { id: 'b', text: '小心一点继续按原计划' },
      { id: 'c', text: '先去看看情况再决定' },
      { id: 'd', text: '取消整个行程' }
    ],
    correctAnswer: 'a',
    explanation: '预报明确指出特定坡向的问题,应该调整到不受影响的坡向。不需要取消行程,但必须避开问题坡向。',
    keyTakeaway: '灵活调整计划,匹配当前条件,而不是固守原计划。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一个提前一周计划的行程,大家都很期待。'
  },
  {
    id: 'dc-041',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '"一票否决权"(Stop Card)的意义是什么?',
    options: [
      { id: 'a', text: '赋予每个成员喊停的权力,无需解释' },
      { id: 'b', text: '只有领队可以喊停' },
      { id: 'c', text: '需要多数人同意才能停止' },
      { id: 'd', text: '只在紧急情况下使用' }
    ],
    correctAnswer: 'a',
    explanation: '一票否决权让任何成员都能在感到不安全时暂停活动,无需详细解释。这是打破群体思维和权威压力的重要工具。',
    keyTakeaway: '建立并尊重每个人的一票否决权。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-042',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '你在现场挖雪坑,发现30cm深处有明显弱层,但坡度只有28度。你的决策是?',
    options: [
      { id: 'a', text: '避开这个坡面,28度仍可能触发雪崩' },
      { id: 'b', text: '28度不够陡,可以安全通过' },
      { id: 'c', text: '只要小心一点就没问题' },
      { id: 'd', text: '让最轻的人先过' }
    ],
    correctAnswer: 'a',
    explanation: '虽然30度是典型雪崩触发角度,但28度在弱层明显的情况下仍有风险,且坡面上方可能更陡。应该保守选择更安全的地形。',
    keyTakeaway: '发现明显不稳定信号时,不要侥幸,选择更保守的路线。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一个开阔的坡面,上方连接到更陡的地形。'
  },
  {
    id: 'dc-043',
    type: 'single',
    category: 'decision',
    difficulty: 'medium',
    question: '在雪崩地形中,安全的团队间距应该如何设置?',
    options: [
      { id: 'a', text: '同时只有一人暴露在雪崩地形中' },
      { id: 'b', text: '保持5米间距' },
      { id: 'c', text: '紧密集中,便于互救' },
      { id: 'd', text: '随意分散' }
    ],
    correctAnswer: 'a',
    explanation: '在雪崩地形中,标准做法是"一次一人":同时只有一人暴露,其他人在安全岛屿观察,减少同时埋葬的人数。',
    keyTakeaway: '雪崩地形中,一次一人,其他人在安全位置。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-044',
    type: 'multiple',
    category: 'decision',
    difficulty: 'medium',
    question: '应急计划应该包括哪些要素?(多选)',
    options: [
      { id: 'a', text: '紧急联系人和救援电话' },
      { id: 'b', text: '详细的行程和预计返回时间' },
      { id: 'c', text: '逃生路线和安全集合点' },
      { id: 'd', text: '社交媒体发布计划' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '应急计划包括:留守联系人、详细行程、通讯设备、撤退路线、集合点、救援协调等实用信息。',
    keyTakeaway: '制定并告知他人详细的应急计划。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-045',
    type: 'scenario',
    category: 'decision',
    difficulty: 'medium',
    question: '行程到一半,团队有两人明显疲劳,速度变慢。这对雪崩安全的影响是什么?',
    options: [
      { id: 'a', text: '疲劳降低判断力和反应能力,增加风险' },
      { id: 'b', text: '只是体力问题,不影响雪崩安全' },
      { id: 'c', text: '速度慢反而更安全' },
      { id: 'd', text: '只影响登山,不影响滑雪' }
    ],
    correctAnswer: 'a',
    explanation: '疲劳会严重影响决策质量、技术执行和应急反应能力,是重要的风险因素。应该调整计划或提前撤退。',
    keyTakeaway: '团队状态是风险评估的重要组成部分。',
    relatedPage: '/safety/decision',
    scenarioContext: '你们计划还要徒步1小时才能到达目标坡面。'
  },

  // Hard Questions (15 total)
  {
    id: 'dc-046',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '雪崩预报显示"中度危险,风板问题主要在背风坡",你的路线在迎风坡。到达现场后发现风向与预报相反,你的坡面变成背风。最佳决策?',
    options: [
      { id: 'a', text: '立即重新评估,进行雪层测试,考虑调整路线或撤退' },
      { id: 'b', text: '既然预报是中度,应该还可以小心通过' },
      { id: 'c', text: '风向变化不影响雪层,继续按计划' },
      { id: 'd', text: '加快速度通过以减少暴露时间' }
    ],
    correctAnswer: 'a',
    explanation: '风向变化改变了风板分布,你的计划基础已失效。必须重新评估现场条件,不能依赖原计划。这需要现场测试和可能的路线调整。',
    keyTakeaway: '当关键假设条件改变时,必须重新评估整个计划。',
    relatedPage: '/safety/decision',
    scenarioContext: '你在山脊上,两侧都有备选路线,但需要重新规划。'
  },
  {
    id: 'dc-047',
    type: 'multiple',
    category: 'decision',
    difficulty: 'hard',
    question: '一个完整的雪崩风险管理框架应该包括哪些层次?(多选)',
    options: [
      { id: 'a', text: '行前计划和信息收集' },
      { id: 'b', text: '途中观察和动态评估' },
      { id: 'c', text: '现场决策和地形选择' },
      { id: 'd', text: '救援技能和装备' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '完整的风险管理包括:预防(行前计划)、评估(途中观察)、决策(现场判断)、应急(救援准备)四个层次,缺一不可。',
    keyTakeaway: '风险管理是多层次的系统,不能只依赖单一措施。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-048',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '你的团队包括一名AIARE3级教练、两名中级滑雪者和一名新手。雪崩预报"中度危险"。谁的能力水平应该决定地形选择?',
    options: [
      { id: 'a', text: '团队中最弱的成员(新手)' },
      { id: 'b', text: '团队平均水平' },
      { id: 'c', text: '最强的成员(教练)' },
      { id: 'd', text: '中级滑雪者' }
    ],
    correctAnswer: 'a',
    explanation: '团队安全由最弱一环决定。地形选择必须匹配所有成员都能胜任的水平,包括技术、体力、决策能力和救援技能。',
    keyTakeaway: '团队决策要照顾最弱成员,整体安全优先于个人表现。',
    relatedPage: '/safety/decision',
    scenarioContext: '教练想去更有挑战的地形,但需要考虑整个团队。'
  },
  {
    id: 'dc-049',
    type: 'image',
    category: 'decision',
    difficulty: 'hard',
    question: '(场景图:一个地形图显示主路线经过30-35度坡面,但有一条更长的备选路线穿过树林,坡度25度以下)雪崩预报"高度危险,新雪持续性雪板问题"。最佳决策?',
    options: [
      { id: 'a', text: '选择更长但更安全的树林路线' },
      { id: 'b', text: '按主路线快速通过减少暴露' },
      { id: 'c', text: '等待第二天危险等级下降' },
      { id: 'd', text: '取消行程' }
    ],
    correctAnswer: 'a',
    explanation: '高危级别下,应避开30度以上地形。树林路线虽然更长,但提供了地形保护。新雪持续性问题短期不会改善,不应等待或冒险。',
    keyTakeaway: '高危时选择保护性地形,不要为了效率牺牲安全。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一日行程,你有充足时间走更长的路线。'
  },
  {
    id: 'dc-050',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '你在途中观察到:①雪崩预报说的弱层深度(40cm)与你挖坑发现的(25cm)不一致;②开裂声;③其他团队刚通过。如何整合这些矛盾信息?',
    options: [
      { id: 'a', text: '现场开裂声是最强信号,无论其他信息,立即撤退' },
      { id: 'b', text: '相信预报,忽略现场观察' },
      { id: 'c', text: '跟随其他团队的轨迹' },
      { id: 'd', text: '预报和现场矛盾说明安全,继续' }
    ],
    correctAnswer: 'a',
    explanation: '开裂声是明显线索中的最高危险信号,表明当前位置雪层极不稳定。现场观察优先于预报,其他团队通过不代表安全。',
    keyTakeaway: '现场明显危险信号优先于所有其他信息,立即采取保守行动。',
    relatedPage: '/safety/decision',
    scenarioContext: '你在一个35度的坡面脚下,听到明显的"咔"声。'
  },
  {
    id: 'dc-051',
    type: 'multiple',
    category: 'decision',
    difficulty: 'hard',
    question: '以下哪些情况下应该直接放弃原计划,不需要进一步现场评估?(多选)',
    options: [
      { id: 'a', text: '雪崩预报"极端危险"' },
      { id: 'b', text: '在安全地带观察到多处自然雪崩' },
      { id: 'c', text: '天气急剧恶化,能见度接近零' },
      { id: 'd', text: '雪崩预报"中度危险"' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '极端危险、广泛雪崩活动、恶劣天气都是直接撤退的理由,不需要"再看看"。中度危险可以通过谨慎的地形选择管理。',
    keyTakeaway: '某些条件下,最好的决策是不去冒险评估,直接撤退。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-052',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '你的团队在途中分成两组观点:一组看到开裂想撤退,另一组认为"只是表层响动,深层没问题"。作为领队如何处理?',
    options: [
      { id: 'a', text: '采纳最保守的意见,整个团队撤退或改道' },
      { id: 'b', text: '投票决定' },
      { id: 'c', text: '愿意冒险的继续,保守的返回' },
      { id: 'd', text: '做更多测试来说服保守派' }
    ],
    correctAnswer: 'a',
    explanation: '团队分歧本身就是危险信号,表明存在不确定性。领队应采纳最保守建议,保持团队统一,不能分裂或强迫共识。',
    keyTakeaway: '分歧时选择最保守方案,保持团队完整性。',
    relatedPage: '/safety/decision',
    scenarioContext: '6人团队,3对3分裂,气氛紧张。'
  },
  {
    id: 'dc-053',
    type: 'single',
    category: 'decision',
    difficulty: 'hard',
    question: 'AIARE的"风险管理金字塔"中,最基础(最重要)的层级是什么?',
    options: [
      { id: 'a', text: '地形选择(避开雪崩地形)' },
      { id: 'b', text: '雪层评估' },
      { id: 'c', text: '救援技能' },
      { id: 'd', text: '装备质量' }
    ],
    correctAnswer: 'a',
    explanation: 'AIARE风险金字塔的基础是地形选择:不进入危险地形是最有效的风险管理。其次是雪况评估、人员管理,救援是最后防线。',
    keyTakeaway: '最好的安全策略是通过地形选择避免暴露于雪崩路径。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-054',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '你规划了A、B、C三条备选路线(从激进到保守)。到达现场后发现条件介于预期的"最好"和"中等"之间。如何选择?',
    options: [
      { id: 'a', text: '选择B或C,不选最激进方案A,留安全余量' },
      { id: 'b', text: '条件好于中等,可以选A' },
      { id: 'c', text: '严格选最保守的C' },
      { id: 'd', text: '随机选择' }
    ],
    correctAnswer: 'a',
    explanation: '不确定性情况下应留有安全余量。条件"介于之间"意味着存在不确定性,应该选择保守或中等方案,不选最激进的。',
    keyTakeaway: '模糊情况下,向保守方向偏移,保留安全余量。',
    relatedPage: '/safety/decision',
    scenarioContext: 'A路线需要穿越多个30+度坡面,B路线有部分保护,C路线完全在树林中。'
  },
  {
    id: 'dc-055',
    type: 'multiple',
    category: 'decision',
    difficulty: 'hard',
    question: '"决策疲劳"会如何影响雪崩安全?(多选)',
    options: [
      { id: 'a', text: '降低风险识别的敏感度' },
      { id: 'b', text: '更容易依赖简化规则或他人判断' },
      { id: 'c', text: '倾向于维持现状,不愿改变计划' },
      { id: 'd', text: '提高决策效率' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '决策疲劳导致:认知资源耗尽,依赖捷径思维,风险意识下降,惯性决策。不会提高质量,只会降低警觉性。',
    keyTakeaway: '长时间活动要警惕决策疲劳,定期休息,简化决策流程。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-056',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '你是一个商业向导,客户支付高额费用期待"到达山顶"。当天条件是中度危险,有可能安全登顶,但需要非常谨慎的路线选择和时机把握。你的决策框架应该是?',
    options: [
      { id: 'a', text: '安全优先,如果条件不理想宁可不登顶,提供替代方案' },
      { id: 'b', text: '客户付了钱,尽力满足期望' },
      { id: 'c', text: '让客户自己决定风险承受度' },
      { id: 'd', text: '登顶一半路程以示努力' }
    ],
    correctAnswer: 'a',
    explanation: '职业向导的首要责任是安全,不是满足期望。应该提前沟通风险,设定清晰的撤退标准,提供备选方案,不因商业压力妥协安全。',
    keyTakeaway: '商业压力、客户期望属于外部压力,不应影响安全决策。',
    relatedPage: '/safety/decision',
    scenarioContext: '你有丰富经验,客户是中级水平,装备齐全。'
  },
  {
    id: 'dc-057',
    type: 'image',
    category: 'decision',
    difficulty: 'hard',
    question: '(场景图:决策矩阵显示雪崩可能性"可能"、潜在规模"大"、后果"严重"、暴露度"高")基于这个评估,最合理的决策是?',
    options: [
      { id: 'a', text: '风险不可接受,避开此地形或放弃行程' },
      { id: 'b', text: '可能性不是"很可能",可以尝试' },
      { id: 'c', text: '加强防护措施后通过' },
      { id: 'd', text: '快速通过以减少暴露' }
    ],
    correctAnswer: 'a',
    explanation: '可能性、规模、后果、暴露度四个维度都处于中高水平时,综合风险已经超出可接受范围,不应尝试通过或依赖防护。',
    keyTakeaway: '使用多维度风险矩阵综合评估,不被单一"不是最高级"误导。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一个35度坡面,下方有树林和岩石地形陷阱。'
  },
  {
    id: 'dc-058',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '行程第三天,团队已经连续两天安全滑雪,今天雪崩预报仍是"中度危险"。团队开始放松警惕,有人说"看,这里没那么危险"。这是什么陷阱?',
    options: [
      { id: 'a', text: '熟悉性偏差和"侥幸循环",过去的安全不预测未来' },
      { id: 'b', text: '团队经验增加,确实更安全了' },
      { id: 'c', text: '预报可能高估了风险' },
      { id: 'd', text: '正常的学习曲线' }
    ],
    correctAnswer: 'a',
    explanation: '这是"侥幸循环"或"熟悉性陷阱":连续安全经历导致风险意识下降,忘记每天条件都在变化。这是许多事故的前奏。',
    keyTakeaway: '过去的安全不保证未来,每天都要重新评估,警惕"侥幸循环"。',
    relatedPage: '/safety/decision',
    scenarioContext: '前两天都是类似地形和条件,没有遇到任何危险信号。'
  },
  {
    id: 'dc-059',
    type: 'multiple',
    category: 'decision',
    difficulty: 'hard',
    question: '一个有效的团队决策流程应该包括哪些步骤?(多选,按顺序)',
    options: [
      { id: 'a', text: '所有成员独立观察和评估' },
      { id: 'b', text: '开放式讨论,分享观察和担忧' },
      { id: 'c', text: '识别和讨论不同意见' },
      { id: 'd', text: '达成共识,采用最保守合理的方案' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '有效团队决策流程:独立观察(避免锚定)→开放分享(信息汇总)→讨论分歧(避免群体思维)→保守共识(安全优先)。',
    keyTakeaway: '结构化的决策流程能减少认知偏差,提高决策质量。',
    relatedPage: '/safety/decision'
  },
  {
    id: 'dc-060',
    type: 'scenario',
    category: 'decision',
    difficulty: 'hard',
    question: '回顾:你因为明显开裂声而放弃了计划的路线,后来看到其他团队安全通过了。你如何看待你的决策?',
    options: [
      { id: 'a', text: '基于当时信息做了正确的保守决策,结果不改变决策质量' },
      { id: 'b', text: '我太保守了,下次可以更激进' },
      { id: 'c', text: '我的判断是错的' },
      { id: 'd', text: '开裂声不重要' }
    ],
    correctAnswer: 'a',
    explanation: '决策质量由决策时的信息和过程决定,不由结果决定。开裂声是合理的撤退理由,其他人安全不代表你的决策错误,可能是运气。',
    keyTakeaway: '评估决策质量看过程不看结果,"安全回家的错误决策"优于"侥幸成功的冒险"。',
    relatedPage: '/safety/decision',
    scenarioContext: '这是一个自我反思的场景,考验决策评估的成熟度。'
  }
];

export default questions;
