import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // Easy Questions (25 total)
  {
    id: 'tr-001',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '最危险的雪崩坡度范围是多少？',
    options: [
      { id: 'a', text: '15-25度' },
      { id: 'b', text: '30-45度' },
      { id: 'c', text: '50-60度' },
      { id: 'd', text: '10-20度' }
    ],
    correctAnswer: 'b',
    explanation: '30-45度的坡度范围最容易发生雪板雪崩，这个角度既能积累足够的积雪，又有足够的陡度使雪崩发生。',
    keyTakeaway: '30-45度是雪崩最危险的坡度范围',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-002',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '朝北的坡面通常比朝南的坡面更容易保持不稳定的积雪。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '朝北的坡面接收较少阳光，积雪温度较低，弱层更容易持续存在，因此通常比朝南坡面更不稳定。',
    keyTakeaway: '阴坡（朝北）积雪更冷，弱层更持久',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-003',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '以下哪种地形特征是"地形陷阱"？',
    options: [
      { id: 'a', text: '开阔的山脊' },
      { id: 'b', text: '狭窄的沟壑' },
      { id: 'c', text: '平缓的平台' },
      { id: 'd', text: '宽阔的山坡' }
    ],
    correctAnswer: 'b',
    explanation: '狭窄的沟壑是典型的地形陷阱，小型雪崩在这里也可能因堆积深度导致严重后果。',
    keyTakeaway: '沟壑、悬崖下方、密集树林是危险的地形陷阱',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-004',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '山脊线通常是相对安全的行进路线。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '山脊线上积雪较薄，不易形成雪崩，且不会被上方雪崩影响，是相对安全的行进路线。',
    keyTakeaway: '山脊线是相对安全的行进路线',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-005',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: 'ATES地形分类系统中，最简单的地形等级是？',
    options: [
      { id: 'a', text: 'Simple（简单）' },
      { id: 'b', text: 'Challenging（挑战）' },
      { id: 'c', text: 'Complex（复杂）' },
      { id: 'd', text: 'Extreme（极端）' }
    ],
    correctAnswer: 'a',
    explanation: 'ATES系统将地形分为Simple、Challenging和Complex三个等级，Simple是最简单和最安全的等级。',
    keyTakeaway: 'ATES系统：Simple < Challenging < Complex',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-006',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '凸起地形（凸坡）为什么更容易发生雪崩？',
    options: [
      { id: 'a', text: '积雪更厚' },
      { id: 'b', text: '积雪受到拉伸应力' },
      { id: 'c', text: '风速更大' },
      { id: 'd', text: '温度更低' }
    ],
    correctAnswer: 'b',
    explanation: '凸起地形使积雪受到拉伸应力，降低了雪层的强度，更容易断裂形成雪崩。',
    keyTakeaway: '凸坡因拉伸应力更易雪崩，凹坡相对稳定',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-007',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '在高危地形中，应该一次一个人通过暴露区域。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '一次一个人通过可以减少暴露人数，降低触发雪崩的风险，并确保如果发生雪崩，其他人可以进行救援。',
    keyTakeaway: '高危区域一次一人通过',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-008',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '树线以下（森林区域）的雪崩危险通常如何？',
    options: [
      { id: 'a', text: '最高' },
      { id: 'b', text: '较低' },
      { id: 'c', text: '没有危险' },
      { id: 'd', text: '与开阔地相同' }
    ],
    correctAnswer: 'b',
    explanation: '密集的树木可以锚定积雪，减少雪崩发生。但稀疏林区和林中开阔地仍可能发生雪崩。',
    keyTakeaway: '密林区雪崩风险较低，但不是零风险',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-009',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '以下哪个坡度最不可能发生雪板雪崩？',
    options: [
      { id: 'a', text: '35度' },
      { id: 'b', text: '40度' },
      { id: 'c', text: '25度' },
      { id: 'd', text: '15度' }
    ],
    correctAnswer: 'd',
    explanation: '15度的坡度太缓，通常不足以形成雪板雪崩。雪板雪崩通常需要至少25度以上的坡度。',
    keyTakeaway: '低于25度的坡面雪板雪崩风险很低',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-010',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '背风坡通常比迎风坡积雪更厚，雪崩风险更高。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '风将雪从迎风坡吹向背风坡，在背风坡形成雪檐和厚积雪，显著增加雪崩风险。',
    keyTakeaway: '背风坡积雪厚、易形成雪檐，风险高',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-011',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '在雪崩地形中行进时，最安全的观察位置是？',
    options: [
      { id: 'a', text: '坡面中央' },
      { id: 'b', text: '坡面顶部' },
      { id: 'c', text: '有遮蔽的安全岛' },
      { id: 'd', text: '沟壑底部' }
    ],
    correctAnswer: 'c',
    explanation: '安全岛是指不会被雪崩影响的地形，如大树后、岩石凸起后，是观察和等待的最佳位置。',
    keyTakeaway: '在安全岛观察和等待队友',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-012',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '什么是"触发点"？',
    options: [
      { id: 'a', text: '雪最深的地方' },
      { id: 'b', text: '积雪最薄弱容易触发雪崩的位置' },
      { id: 'c', text: '坡度最陡的地方' },
      { id: 'd', text: '风最大的地方' }
    ],
    correctAnswer: 'b',
    explanation: '触发点是雪层最薄弱的位置，如岩石凸起周围、凸坡顶部，施加压力最容易在此触发雪崩。',
    keyTakeaway: '触发点是积雪最薄弱、最易触发雪崩的位置',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-013',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '悬崖下方是危险的地形陷阱。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '悬崖下方即使小型雪崩也可能将人推下悬崖或导致严重创伤，属于严重的地形陷阱。',
    keyTakeaway: '悬崖、沟壑、密林是三大地形陷阱',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-014',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '上升时应该选择什么路线？',
    options: [
      { id: 'a', text: '直接上升最陡的路线' },
      { id: 'b', text: '沿山脊或低角度地形' },
      { id: 'c', text: '沿沟壑上升' },
      { id: 'd', text: '穿越所有陡坡' }
    ],
    correctAnswer: 'b',
    explanation: '上升时应选择山脊、森林或低角度地形，避免暴露在雪崩起始区下方。',
    keyTakeaway: '上升优选山脊和低角度地形',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-015',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '南向坡面的积雪稳定性通常如何变化？',
    options: [
      { id: 'a', text: '始终不稳定' },
      { id: 'b', text: '日间受阳光影响可能不稳定' },
      { id: 'c', text: '完全稳定' },
      { id: 'd', text: '与朝向无关' }
    ],
    correctAnswer: 'b',
    explanation: '南向坡面接受更多阳光，日间升温可能导致湿雪崩，但夜间冻结后早晨可能较稳定。',
    keyTakeaway: '阳坡日间受太阳影响可能不稳定',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-016',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '所有超过30度的坡面都应被视为潜在雪崩地形。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '30度是雪板雪崩的最低坡度阈值，所有30度以上的坡面都应评估雪崩风险。',
    keyTakeaway: '30度以上坡面需评估雪崩风险',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-017',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '在下降滑雪时，应该如何选择路线？',
    options: [
      { id: 'a', text: '直接滑最陡的线路' },
      { id: 'b', text: '利用安全岛，分段滑行' },
      { id: 'c', text: '所有人一起下降' },
      { id: 'd', text: '随意选择路线' }
    ],
    correctAnswer: 'b',
    explanation: '下降时应规划路线，利用安全岛（如树林、岩石区）分段滑行，一次一人通过暴露区。',
    keyTakeaway: '下降时利用安全岛分段滑行',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-018',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '什么是"安全岛"？',
    options: [
      { id: 'a', text: '海拔最高的地方' },
      { id: 'b', text: '不受雪崩影响的安全地形' },
      { id: 'c', text: '积雪最厚的地方' },
      { id: 'd', text: '最平坦的区域' }
    ],
    correctAnswer: 'b',
    explanation: '安全岛是指大树后、岩石凸起、山脊等不会被雪崩影响的地形，可作为休息和观察点。',
    keyTakeaway: '安全岛是免受雪崩威胁的地形特征',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-019',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '陡坡上方的平缓区域可以安全停留。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '陡坡上方的平缓区域可能是雪崩起始区，停留在此可能触发雪崩并被卷入。',
    keyTakeaway: '避免在陡坡上方的起始区停留',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-020',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '密集的成熟森林为什么相对安全？',
    options: [
      { id: 'a', text: '树木锚定积雪' },
      { id: 'b', text: '没有积雪' },
      { id: 'c', text: '温度更高' },
      { id: 'd', text: '坡度为零' }
    ],
    correctAnswer: 'a',
    explanation: '密集的成熟树木可以锚定积雪，阻止雪崩形成和运动，但稀疏林区仍有风险。',
    keyTakeaway: '密集成熟林可锚定积雪，相对安全',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-021',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '穿越雪崩路径时应该如何行动？',
    options: [
      { id: 'a', text: '快速通过，一次一人' },
      { id: 'b', text: '慢慢走，所有人一起' },
      { id: 'c', text: '在中央停留观察' },
      { id: 'd', text: '分散开来同时通过' }
    ],
    correctAnswer: 'a',
    explanation: '穿越雪崩路径应快速通过，减少暴露时间，一次一人以降低风险并保留救援力量。',
    keyTakeaway: '穿越雪崩路径：快速、一次一人',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-022',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '坡度计是测量坡度的重要工具。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '坡度计可以准确测量坡度，帮助判断是否处于30-45度的危险区域，是重要的地形评估工具。',
    keyTakeaway: '使用坡度计评估地形角度',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-023',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '雪檐通常形成在什么位置？',
    options: [
      { id: 'a', text: '迎风坡顶部' },
      { id: 'b', text: '背风坡顶部山脊' },
      { id: 'c', text: '山谷底部' },
      { id: 'd', text: '南向坡面' }
    ],
    correctAnswer: 'b',
    explanation: '风将雪吹过山脊，在背风侧形成悬挑的雪檐，可能坍塌或触发下方雪崩。',
    keyTakeaway: '雪檐形成在背风坡山脊顶部',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-024',
    type: 'single',
    category: 'terrain',
    difficulty: 'easy',
    question: '地形陷阱的主要危险是什么？',
    options: [
      { id: 'a', text: '增加雪崩发生概率' },
      { id: 'b', text: '增加雪崩后果严重性' },
      { id: 'c', text: '降低积雪稳定性' },
      { id: 'd', text: '增加降雪量' }
    ],
    correctAnswer: 'b',
    explanation: '地形陷阱不会增加雪崩发生概率，但会大大增加后果严重性，小雪崩也可能致命。',
    keyTakeaway: '地形陷阱增加雪崩后果严重性',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-025',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'easy',
    question: '在能见度低的情况下应避免进入复杂地形。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '低能见度下难以识别地形特征和危险，容易误入雪崩地形或地形陷阱，应避免进入复杂地形。',
    keyTakeaway: '低能见度时避免复杂地形',
    relatedPage: '/safety/terrain'
  },

  // Medium Questions (25 total)
  {
    id: 'tr-026',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: 'ATES系统中的"Challenging"地形有什么特点？',
    options: [
      { id: 'a', text: '完全平坦，无雪崩风险' },
      { id: 'b', text: '暴露在某些雪崩地形中，需要仔细路线选择' },
      { id: 'c', text: '持续暴露在多个重叠雪崩路径中' },
      { id: 'd', text: '仅适合专业向导' }
    ],
    correctAnswer: 'b',
    explanation: 'Challenging地形包含雪崩地形，但通过谨慎的路线选择可以降低风险，需要良好的地形判断能力。',
    keyTakeaway: 'Challenging地形需要谨慎路线选择',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-027',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'medium',
    question: '以下哪些是地形陷阱的类型？（多选）',
    options: [
      { id: 'a', text: '狭窄沟壑' },
      { id: 'b', text: '悬崖地带' },
      { id: 'c', text: '密集树林' },
      { id: 'd', text: '开阔山脊' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '沟壑会聚集雪崩碎屑，悬崖会造成创伤，密集树林会产生撞击伤害。开阔山脊不是地形陷阱。',
    keyTakeaway: '沟壑、悬崖、密林是主要地形陷阱',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-028',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'medium',
    question: '你应该选择哪条路线？',
    scenarioContext: '你计划攀登一座山峰，有两条路线：A路线沿开阔山脊，坡度20-25度；B路线穿过北向碗状地形，坡度35-40度但更直接。当前雪崩风险为"中等"。',
    options: [
      { id: 'a', text: '选择A路线，沿山脊上升' },
      { id: 'b', text: '选择B路线，更快到达' },
      { id: 'c', text: '两条路线都安全' },
      { id: 'd', text: '两条路线都不安全' }
    ],
    correctAnswer: 'a',
    explanation: 'A路线沿山脊，坡度较缓，不暴露在雪崩地形中。B路线穿过35-40度北向坡，在中等风险下危险性高。',
    keyTakeaway: '中等风险时选择山脊等低风险路线',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-029',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '凹形坡面与凸形坡面相比，稳定性如何？',
    options: [
      { id: 'a', text: '凹形更稳定，积雪受压缩' },
      { id: 'b', text: '凸形更稳定，积雪受压缩' },
      { id: 'c', text: '稳定性完全相同' },
      { id: 'd', text: '都极不稳定' }
    ],
    correctAnswer: 'a',
    explanation: '凹形坡面积雪受压缩应力，增强雪层连接；凸形坡面积雪受拉伸应力，更易断裂。',
    keyTakeaway: '凹坡受压缩更稳定，凸坡受拉伸易雪崩',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-030',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'medium',
    question: '跨坡横切比直接上升或下降更容易触发雪崩。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '横切时对积雪施加侧向剪切力，比垂直上升更容易切断弱层，触发雪崩。',
    keyTakeaway: '横切比上升下降更易触发雪崩',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-031',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '在评估坡度时，应该测量哪个位置的角度？',
    options: [
      { id: 'a', text: '坡面底部' },
      { id: 'b', text: '坡面平均坡度' },
      { id: 'c', text: '最陡的部分' },
      { id: 'd', text: '坡面顶部' }
    ],
    correctAnswer: 'c',
    explanation: '应测量整个坡面最陡的部分，因为这里最可能成为雪崩起始点，即使平均坡度较缓。',
    keyTakeaway: '测量坡面最陡处的坡度',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-032',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'medium',
    question: '你应该如何行动？',
    scenarioContext: '你和三位同伴准备穿越一个35度的开阔坡面到达对面山脊。该坡面长约200米，无明显安全岛。',
    options: [
      { id: 'a', text: '四人一起快速通过' },
      { id: 'b', text: '一次一人通过，其余人在安全位置观察' },
      { id: 'c', text: '两人一组分两次通过' },
      { id: 'd', text: '分散开来同时通过' }
    ],
    correctAnswer: 'b',
    explanation: '一次一人通过可减少触发概率和暴露人数，其余人在安全位置可随时进行救援。',
    keyTakeaway: '穿越雪崩地形一次一人，其余人在安全位置',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-033',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'medium',
    question: '哪些地形特征会增加雪崩风险？（多选）',
    options: [
      { id: 'a', text: '凸形坡面' },
      { id: 'b', text: '背风坡' },
      { id: 'c', text: '岩石凸起周围' },
      { id: 'd', text: '山脊线' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '凸坡拉伸积雪，背风坡堆积雪量大，岩石凸起处积雪薄弱，都会增加风险。山脊线通常较安全。',
    keyTakeaway: '凸坡、背风坡、岩石凸起增加风险',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-034',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: 'ATES系统中的"Complex"地形有什么特点？',
    options: [
      { id: 'a', text: '偶尔暴露在雪崩地形中' },
      { id: 'b', text: '完全没有雪崩风险' },
      { id: 'c', text: '频繁暴露在多个重叠的雪崩路径中' },
      { id: 'd', text: '仅有小型地形陷阱' }
    ],
    correctAnswer: 'c',
    explanation: 'Complex地形包含多个雪崩路径、严重地形陷阱，即使谨慎路线选择也难以完全避免暴露。',
    keyTakeaway: 'Complex地形频繁暴露且难以避免',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-035',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'medium',
    question: '雪崩可以在低于30度的坡面上停止堆积。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩在低角度坡面（20-25度甚至更缓）会减速并堆积，因此即使缓坡也可能位于雪崩路径中。',
    keyTakeaway: '雪崩路径可延伸到25度以下的缓坡',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-036',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'medium',
    question: '应该选择什么时间下降？',
    scenarioContext: '你在南向坡面顶部，计划下降滑雪。当前是晴朗的春季日子，上午10点，气温正在上升。坡度38度。',
    options: [
      { id: 'a', text: '立即下降，趁雪还硬' },
      { id: 'b', text: '等到中午，温度最高时' },
      { id: 'c', text: '改变计划，选择北向坡面' },
      { id: 'd', text: '等到傍晚' }
    ],
    correctAnswer: 'a',
    explanation: '春季南向坡面早晨雪面冻结较稳定，随着日晒升温会变软变湿，湿雪崩风险增加。应在早晨雪面还硬时下降。',
    keyTakeaway: '春季阳坡早晨较稳定，日晒后湿雪崩风险增加',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-037',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '什么是"起始区"？',
    options: [
      { id: 'a', text: '雪崩停止的地方' },
      { id: 'b', text: '雪崩开始发生的陡坡区域' },
      { id: 'c', text: '雪崩运动的路径' },
      { id: 'd', text: '最安全的区域' }
    ],
    correctAnswer: 'b',
    explanation: '起始区是雪崩开始的地方，通常是30-45度的陡坡，积雪断裂从这里开始。',
    keyTakeaway: '起始区是雪崩开始的陡坡区域',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-038',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'medium',
    question: '哪些是安全的观察和等待位置？（多选）',
    options: [
      { id: 'a', text: '大树后方' },
      { id: 'b', text: '山脊线上' },
      { id: 'c', text: '大岩石凸起后方' },
      { id: 'd', text: '开阔坡面中央' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '大树后、山脊线、大岩石后方不会被雪崩影响，是安全观察点。开阔坡面中央非常危险。',
    keyTakeaway: '选择树后、山脊、岩石后作为观察点',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-039',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '在碗状地形中，雪崩风险如何？',
    options: [
      { id: 'a', text: '风险很低' },
      { id: 'b', text: '风险集中，可能被多个方向雪崩影响' },
      { id: 'c', text: '与开阔坡面相同' },
      { id: 'd', text: '没有风险' }
    ],
    correctAnswer: 'b',
    explanation: '碗状地形三面环绕陡坡，可能被多个方向的雪崩影响，且难以逃脱，是高风险地形。',
    keyTakeaway: '碗状地形高风险，可能被多方向雪崩影响',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-040',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'medium',
    question: '在雪檐下方行走是危险的。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪檐可能突然坍塌，砸中下方人员或触发下方坡面雪崩，应远离雪檐正下方。',
    keyTakeaway: '避开雪檐下方和雪檐顶部',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-041',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'medium',
    question: '应该如何调整计划？',
    scenarioContext: '你计划在一个35度的北向坡面滑雪。到达后发现该坡面上方有明显的新雪檐，坡面上有近期雪崩的迹象。',
    options: [
      { id: 'a', text: '继续原计划，小心滑行' },
      { id: 'b', text: '选择其他更安全的坡面' },
      { id: 'c', text: '一次一人快速通过' },
      { id: 'd', text: '先进行稳定性测试' }
    ],
    correctAnswer: 'b',
    explanation: '新雪檐和近期雪崩迹象表明该坡面高度不稳定，应选择其他路线，避免暴露在此危险中。',
    keyTakeaway: '发现明显不稳定迹象时应改变计划',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-042',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '什么是"过渡区"？',
    options: [
      { id: 'a', text: '雪崩开始的地方' },
      { id: 'b', text: '雪崩运动和加速的路径' },
      { id: 'c', text: '雪崩停止的地方' },
      { id: 'd', text: '最安全的区域' }
    ],
    correctAnswer: 'b',
    explanation: '过渡区（雪崩路径）是连接起始区和堆积区的通道，雪崩在此加速运动，通常是25-35度的坡面或沟壑。',
    keyTakeaway: '过渡区是雪崩加速运动的路径',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-043',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'medium',
    question: '哪些因素使北向坡面更危险？（多选）',
    options: [
      { id: 'a', text: '较少阳光，积雪更冷' },
      { id: 'b', text: '弱层更持久' },
      { id: 'c', text: '积雪温度更高' },
      { id: 'd', text: '通常是背风坡' }
    ],
    correctAnswer: ['a', 'b'],
    explanation: '北向坡面接受较少阳光，积雪温度低，弱层不易愈合，保持不稳定时间更长。背风坡与朝向无直接关系。',
    keyTakeaway: '阴坡积雪冷，弱层持久，风险更长',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-044',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '在选择营地时应避开什么地形？',
    options: [
      { id: 'a', text: '平坦的山谷底部' },
      { id: 'b', text: '陡坡下方的雪崩路径' },
      { id: 'c', text: '山脊顶部' },
      { id: 'd', text: '密林中' }
    ],
    correctAnswer: 'b',
    explanation: '营地应远离雪崩路径和陡坡下方，选择安全地形如密林、山脊或不受雪崩威胁的平坦区域。',
    keyTakeaway: '营地应避开雪崩路径和陡坡下方',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-045',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'medium',
    question: '即使你在低角度地形上，上方陡坡的雪崩仍可能影响你。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '雪崩可以从陡坡运动到缓坡堆积区，即使你站在缓坡上，上方雪崩仍可能到达并掩埋你。',
    keyTakeaway: '评估地形时要考虑上方陡坡威胁',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-046',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'medium',
    question: '你会选择哪条路线？',
    scenarioContext: '下降时有两个选择：A路线沿着树林边缘，坡度28度；B路线穿过开阔坡面中央，坡度32度，但距离更短。',
    options: [
      { id: 'a', text: 'A路线，沿树林边缘' },
      { id: 'b', text: 'B路线，穿过开阔坡面' },
      { id: 'c', text: '两条路线都安全' },
      { id: 'd', text: '两条路线都危险' }
    ],
    correctAnswer: 'a',
    explanation: 'A路线靠近树林，可提供安全岛和逃生路线，坡度也较缓。B路线完全暴露在开阔坡面中，无安全岛。',
    keyTakeaway: '优选靠近安全岛和逃生路线的路线',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-047',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '什么是"堆积区"？',
    options: [
      { id: 'a', text: '雪崩开始的地方' },
      { id: 'b', text: '雪崩运动的路径' },
      { id: 'c', text: '雪崩减速并堆积雪块的区域' },
      { id: 'd', text: '最陡的地方' }
    ],
    correctAnswer: 'c',
    explanation: '堆积区通常位于坡度减缓的区域（<25度），雪崩在此减速停止，碎屑堆积，可能掩埋受害者。',
    keyTakeaway: '堆积区是雪崩停止和碎屑堆积的区域',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-048',
    type: 'single',
    category: 'terrain',
    difficulty: 'medium',
    question: '为什么岩石凸起周围是常见的触发点？',
    options: [
      { id: 'a', text: '岩石会产生热量' },
      { id: 'b', text: '岩石周围积雪较薄，更易触发弱层' },
      { id: 'c', text: '岩石增加积雪重量' },
      { id: 'd', text: '岩石没有影响' }
    ],
    correctAnswer: 'b',
    explanation: '岩石凸起周围积雪较薄，施加的压力更容易到达弱层，使此处成为最易触发雪崩的位置。',
    keyTakeaway: '岩石凸起周围积雪薄，易触发雪崩',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-049',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'medium',
    question: '地形管理的核心原则包括哪些？（多选）',
    options: [
      { id: 'a', text: '避开陡峭起始区' },
      { id: 'b', text: '利用安全岛' },
      { id: 'c', text: '一次一人通过暴露区' },
      { id: 'd', text: '总是走最直接的路线' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '地形管理包括避开危险地形、利用安全岛、减少暴露人数和时间。最直接的路线往往最危险。',
    keyTakeaway: '地形管理：避开危险、利用安全岛、减少暴露',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-050',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'medium',
    question: '稀疏的树林不能有效防止雪崩。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '只有密集的成熟森林才能有效锚定积雪防止雪崩。稀疏树林、幼林或林中开阔地仍可能发生雪崩。',
    keyTakeaway: '只有密集成熟林才能有效防雪崩',
    relatedPage: '/safety/terrain'
  },

  // Hard Questions (20 total)
  {
    id: 'tr-051',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '你应该如何行动？',
    scenarioContext: '你在一个大型碗状地形底部，周围三面是35-42度的坡面，刚刚观察到西侧坡面发生一次小型自然雪崩。你需要上升到碗状地形的山脊才能离开。',
    options: [
      { id: 'a', text: '立即沿东侧坡面快速上升' },
      { id: 'b', text: '沿刚发生雪崩的西侧坡面上升，因为已经释放' },
      { id: 'c', text: '等待观察，寻找最低角度或有树木锚定的上升路线' },
      { id: 'd', text: '原路返回' }
    ],
    correctAnswer: 'c',
    explanation: '西侧雪崩表明整个碗状地形不稳定。应等待评估，寻找最安全路线（如树林、低角度）。如无安全路线应原路返回。',
    keyTakeaway: '碗状地形中发生雪崩是整体不稳定的信号',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-052',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'hard',
    question: 'Complex地形的特征包括哪些？（多选）',
    options: [
      { id: 'a', text: '多个重叠的雪崩路径' },
      { id: 'b', text: '明显的地形陷阱' },
      { id: 'c', text: '难以通过路线选择降低风险' },
      { id: 'd', text: '完全平坦无坡度' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Complex地形包含多个雪崩路径、严重地形陷阱，且难以通过路线选择避免暴露，需要高级技能和经验。',
    keyTakeaway: 'Complex地形高度复杂，难以降低风险',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-053',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '在评估地形时，"暴露度"是什么意思？',
    options: [
      { id: 'a', text: '坡面的海拔高度' },
      { id: 'b', text: '受雪崩影响的可能性和潜在后果的组合' },
      { id: 'c', text: '坡面的坡度角度' },
      { id: 'd', text: '距离最近道路的距离' }
    ],
    correctAnswer: 'b',
    explanation: '暴露度综合考虑雪崩发生的可能性、暴露时间、地形陷阱和潜在后果，是地形风险评估的关键概念。',
    keyTakeaway: '暴露度=可能性×后果×暴露时间',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-054',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '应该采取什么策略？',
    scenarioContext: '你需要穿越一个400米长的雪崩路径，坡度32度。路径中部有一小片岩石区可作为安全岛，将路径分为两段：前200米和后200米。',
    options: [
      { id: 'a', text: '四人一起快速通过全程' },
      { id: 'b', text: '每人分别通过全程，一次一人' },
      { id: 'c', text: '利用中部安全岛，分两段通过，每段一次一人' },
      { id: 'd', text: '分散开来降低风险' }
    ],
    correctAnswer: 'c',
    explanation: '利用安全岛分段通过可以减少每次暴露距离和时间，同时保持救援力量，是最安全的策略。',
    keyTakeaway: '长距离暴露时充分利用安全岛分段通过',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-055',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '什么是"地形放大效应"？',
    options: [
      { id: 'a', text: '地形使温度升高' },
      { id: 'b', text: '地形陷阱使小雪崩后果放大' },
      { id: 'c', text: '地形增加降雪量' },
      { id: 'd', text: '地形使坡度变陡' }
    ],
    correctAnswer: 'b',
    explanation: '地形陷阱（如沟壑、悬崖）会放大雪崩后果，使原本可能生存的小雪崩变得致命。',
    keyTakeaway: '地形陷阱放大小雪崩的致命性',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-056',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'hard',
    question: '在春季滑雪时，南向坡面的时间窗口管理应考虑哪些因素？（多选）',
    options: [
      { id: 'a', text: '早晨雪面冻结较稳定' },
      { id: 'b', text: '日晒后湿雪崩风险增加' },
      { id: 'c', text: '傍晚重新冻结前最危险' },
      { id: 'd', text: '全天风险相同' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '春季南坡早晨冻结稳定，日晒后软化危险，傍晚重新冻结前最不稳定。需要精确的时间窗口管理。',
    keyTakeaway: '春季阳坡要把握早晨稳定时间窗口',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-057',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '应该如何处理这种情况？',
    scenarioContext: '你在一个38度的坡面上进行雪崩评估，挖雪坑时听到明显的"嘭"声（闷响），看到裂纹向外扩展。你的三位队友在坡面下方50米处等待。',
    options: [
      { id: 'a', text: '立即呼叫队友上来' },
      { id: 'b', text: '继续完成雪坑测试' },
      { id: 'c', text: '立即离开坡面，提醒队友避开此坡' },
      { id: 'd', text: '快速下降与队友会合' }
    ],
    correctAnswer: 'c',
    explanation: '闷响和裂纹是严重不稳定的迹象，应立即轻柔离开坡面，警告队友避开该坡及相似地形。',
    keyTakeaway: '闷响和裂纹是立即撤离的信号',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-058',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '在复杂山地地形中，为什么坡度测量可能产生误导？',
    options: [
      { id: 'a', text: '坡度计不准确' },
      { id: 'b', text: '局部坡度可能与整体坡度不同，需评估连通地形' },
      { id: 'c', text: '坡度与雪崩无关' },
      { id: 'd', text: '只需测量脚下坡度' }
    ],
    correctAnswer: 'b',
    explanation: '即使你站在25度缓坡上，如果上方连接着40度陡坡，你仍在雪崩威胁中。需评估整个连通地形。',
    keyTakeaway: '评估地形要看整体连通性，不只看局部',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-059',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'hard',
    question: '在高雪崩风险时期，即使是Simple地形也可能包含雪崩风险。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: 'ATES是地形分类，不考虑积雪状况。在极高雪崩风险时，Simple地形中的小型雪崩地形也可能活跃。',
    keyTakeaway: 'ATES地形分类需结合当日雪崩预报',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-060',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '最佳的风险管理策略是什么？',
    scenarioContext: '雪崩预报等级为"高"，你在规划路线。有三个选项：A是Simple地形，包含几个25-28度的短坡；B是Challenging地形，可以通过谨慎路线选择避开大部分30+度坡面；C是Complex地形，有精彩的滑降线路。',
    options: [
      { id: 'a', text: '选择C，技术好可以控制风险' },
      { id: 'b', text: '选择B，谨慎路线选择' },
      { id: 'c', text: '选择A，或完全避免雪崩地形' },
      { id: 'd', text: '三个选项都可以' }
    ],
    correctAnswer: 'c',
    explanation: '高风险时应选择Simple地形或非雪崩地形。即使Challenging地形在正常情况下可管理，高风险时也过于危险。',
    keyTakeaway: '高风险时只选Simple地形或避免雪崩地形',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-061',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'hard',
    question: '评估一个坡面的雪崩风险时，应该考虑哪些地形因素？（多选）',
    options: [
      { id: 'a', text: '坡度和坡形（凸/凹）' },
      { id: 'b', text: '坡向和海拔' },
      { id: 'c', text: '地形陷阱' },
      { id: 'd', text: '上方和周围连通地形' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '全面的地形评估需考虑所有这些因素：坡度、坡形、坡向、海拔、地形陷阱以及上方和周围连通的地形。',
    keyTakeaway: '地形评估需要综合多个因素',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-062',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '什么是"远程触发"？',
    options: [
      { id: 'a', text: '使用炸药触发雪崩' },
      { id: 'b', text: '从低角度或远距离位置触发陡坡上的雪崩' },
      { id: 'c', text: '雪崩自然发生' },
      { id: 'd', text: '通过呼喊触发雪崩' }
    ],
    correctAnswer: 'b',
    explanation: '远程触发是指从低角度坡面、坡脚或远处施加压力，通过雪层连接触发上方或远处陡坡的雪崩，表明极不稳定。',
    keyTakeaway: '远程触发表明雪层极度不稳定',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-063',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '应该如何调整计划？',
    scenarioContext: '你计划攀登一条山脊，需要经过一段30米长的狭窄路径，两侧是40度陡坡。雪崩预报为"中等"，问题类型是"持久性雪板"。',
    options: [
      { id: 'a', text: '快速通过，一次一人' },
      { id: 'b', text: '评估两侧陡坡，如有不稳定迹象则改变路线' },
      { id: 'c', text: '所有人一起通过' },
      { id: 'd', text: '路径本身是山脊，完全安全' }
    ],
    correctAnswer: 'b',
    explanation: '虽然山脊相对安全，但两侧40度陡坡可能发生雪崩并影响山脊上的人。应评估两侧稳定性，必要时改道。',
    keyTakeaway: '评估山脊时要考虑两侧陡坡威胁',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-064',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '在选择滑雪下降路线时，"逐步暴露"原则是什么意思？',
    options: [
      { id: 'a', text: '一次性滑完整条路线' },
      { id: 'b', text: '分段测试积雪稳定性，逐步进入更大地形' },
      { id: 'c', text: '始终保持在陡坡上' },
      { id: 'd', text: '跟随最快的队友' }
    ],
    correctAnswer: 'b',
    explanation: '逐步暴露是指先在小地形测试稳定性，获得信心后再进入更大更严重的地形，是谨慎的风险管理策略。',
    keyTakeaway: '先在小地形测试，再逐步进入大地形',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-065',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'hard',
    question: '"地形陷阱乘数效应"包括哪些机制？（多选）',
    options: [
      { id: 'a', text: '增加堆积深度' },
      { id: 'b', text: '增加创伤风险（如撞树、坠崖）' },
      { id: 'c', text: '延长掩埋时间（搜救困难）' },
      { id: 'd', text: '减少雪崩发生概率' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '地形陷阱通过增加堆积深度、创伤风险和搜救难度来放大后果，但不影响雪崩发生概率。',
    keyTakeaway: '地形陷阱通过多种机制放大后果',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-066',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '你应该向团队提出什么建议？',
    scenarioContext: '你的团队在一个大型山区进行多日滑雪旅行。第一天在北向坡面发现明显的不稳定性。第二天计划前往东向和南向坡面。',
    options: [
      { id: 'a', text: '东向和南向坡完全安全' },
      { id: 'b', text: '所有坡向都可能不稳定，需要谨慎评估每个坡面' },
      { id: 'c', text: '只有北向坡危险' },
      { id: 'd', text: '应该立即结束旅行' }
    ],
    correctAnswer: 'b',
    explanation: '北向坡的不稳定性表明存在弱层，其他坡向也可能受影响，只是程度不同。需要持续评估所有地形。',
    keyTakeaway: '一个坡向不稳定时，其他坡向也需谨慎评估',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-067',
    type: 'single',
    category: 'terrain',
    difficulty: 'hard',
    question: '什么是"地形支撑点"？',
    options: [
      { id: 'a', text: '登山杖支撑的位置' },
      { id: 'b', text: '树木、岩石等可能锚定积雪的地形特征' },
      { id: 'c', text: '最陡的位置' },
      { id: 'd', text: '雪最深的地方' }
    ],
    correctAnswer: 'b',
    explanation: '地形支撑点如岩石凸起、树木可以锚定积雪，增加稳定性。但积雪薄的支撑点周围也是常见触发点。',
    keyTakeaway: '支撑点可增稳定性，但周围可能是触发点',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-068',
    type: 'truefalse',
    category: 'terrain',
    difficulty: 'hard',
    question: '在评估地形时，应该从上往下看坡面，而不是从下往上看。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '从上往下看可以更好地评估坡度、凸度和地形陷阱，并规划下降路线和逃生路线。从下往上看容易低估坡度。',
    keyTakeaway: '从上往下评估坡面更准确',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-069',
    type: 'scenario',
    category: 'terrain',
    difficulty: 'hard',
    question: '最合适的应对策略是什么？',
    scenarioContext: '你在一个40度的陡坡中部，突然听到上方传来闷响声。上方队友还未通过，下方队友在安全位置。',
    options: [
      { id: 'a', text: '立即快速下降离开坡面' },
      { id: 'b', text: '保持静止，等待进一步信息' },
      { id: 'c', text: '向上返回帮助队友' },
      { id: 'd', text: '横切到侧面树林' }
    ],
    correctAnswer: 'a',
    explanation: '闷响表明坡面极不稳定，应立即快速但谨慎地离开坡面到安全位置，通知上方队友不要进入。',
    keyTakeaway: '听到闷响立即撤离，通知队友',
    relatedPage: '/safety/terrain'
  },
  {
    id: 'tr-070',
    type: 'multiple',
    category: 'terrain',
    difficulty: 'hard',
    question: '高级地形管理技能包括哪些？（多选）',
    options: [
      { id: 'a', text: '识别微地形特征对稳定性的影响' },
      { id: 'b', text: '评估复杂三维地形的暴露度' },
      { id: 'c', text: '动态调整路线响应实时观察' },
      { id: 'd', text: '始终走相同路线' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '高级地形管理需要识别微地形影响、评估复杂暴露度、根据实时信息动态调整，而不是机械遵循固定路线。',
    keyTakeaway: '高级地形管理需要动态评估和调整',
    relatedPage: '/safety/terrain'
  }
];

export default questions;
