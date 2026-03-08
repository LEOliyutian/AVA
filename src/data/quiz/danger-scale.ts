import type { QuizQuestion } from '../../types/quiz.types';

const questions: QuizQuestion[] = [
  // EASY QUESTIONS (25 total: ds-001 to ds-025)

  // Easy - Single Choice (10 questions)
  {
    id: 'ds-001',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '北美雪崩危险等级共分为几个等级？',
    options: [
      { id: 'a', text: '3个等级' },
      { id: 'b', text: '5个等级' },
      { id: 'c', text: '7个等级' },
      { id: 'd', text: '10个等级' }
    ],
    correctAnswer: 'b',
    explanation: '北美雪崩危险等级系统将危险程度分为5个等级：1-低、2-中等、3-相当大、4-高、5-极高。',
    keyTakeaway: '雪崩危险等级分为5个等级',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-002',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级1代表什么危险程度？',
    options: [
      { id: 'a', text: '低' },
      { id: 'b', text: '中等' },
      { id: 'c', text: '相当大' },
      { id: 'd', text: '高' }
    ],
    correctAnswer: 'a',
    explanation: '等级1代表"低"危险，此时雪崩条件总体稳定，通常只有在极端地形中才可能触发孤立的雪崩。',
    keyTakeaway: '等级1为低危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-003',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级5代表什么危险程度？',
    options: [
      { id: 'a', text: '中等' },
      { id: 'b', text: '相当大' },
      { id: 'c', text: '高' },
      { id: 'd', text: '极高' }
    ],
    correctAnswer: 'd',
    explanation: '等级5代表"极高"危险，此时预期会发生大量大型自然雪崩，包括在通常被认为安全的地形中。',
    keyTakeaway: '等级5为极高危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-004',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '在危险等级为1（低）时，建议采取什么出行策略？',
    options: [
      { id: 'a', text: '避免所有雪崩地形' },
      { id: 'b', text: '正常的谨慎出行，注意孤立不稳定地带' },
      { id: 'c', text: '不要进入后山区' },
      { id: 'd', text: '只在树线以下活动' }
    ],
    correctAnswer: 'b',
    explanation: '等级1时可以正常谨慎出行，但仍需注意极端地形中可能存在的孤立不稳定地带。',
    keyTakeaway: '低危险时正常谨慎出行',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-005',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '在危险等级为5（极高）时，建议采取什么行动？',
    options: [
      { id: 'a', text: '小心出行' },
      { id: 'b', text: '只走简单地形' },
      { id: 'c', text: '避免所有雪崩地形，留在家中或安全区域' },
      { id: 'd', text: '带上雪崩救援装备' }
    ],
    correctAnswer: 'c',
    explanation: '等级5时应避免所有雪崩地形，包括通常认为安全的地形，最好留在家中或安全区域。',
    keyTakeaway: '极高危险时应避免所有雪崩地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-006',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级3被称为什么？',
    options: [
      { id: 'a', text: '低' },
      { id: 'b', text: '中等' },
      { id: 'c', text: '相当大' },
      { id: 'd', text: '高' }
    ],
    correctAnswer: 'c',
    explanation: '危险等级3被称为"相当大"（Considerable），是许多致命雪崩事故发生的等级。',
    keyTakeaway: '等级3为相当大危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-007',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '大多数雪崩致命事故发生在哪个危险等级？',
    options: [
      { id: 'a', text: '等级1和2' },
      { id: 'b', text: '等级3' },
      { id: 'c', text: '等级4' },
      { id: 'd', text: '等级5' }
    ],
    correctAnswer: 'b',
    explanation: '大多数致命雪崩事故发生在等级3（相当大），因为人们在这个等级仍会进入后山区，但雪崩危险已经相当显著。',
    keyTakeaway: '等级3发生最多致命事故',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-008',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '雪崩危险等级是针对什么区域的评估？',
    options: [
      { id: 'a', text: '特定的某个山坡' },
      { id: 'b', text: '某个特定点位' },
      { id: 'c', text: '一个较大的区域' },
      { id: 'd', text: '整个国家' }
    ],
    correctAnswer: 'c',
    explanation: '雪崩危险等级是对一个较大区域的总体评估，不是针对具体某个山坡的详细分析。',
    keyTakeaway: '危险等级是区域性评估',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-009',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '在危险等级为2（中等）时，雪崩的触发可能性如何？',
    options: [
      { id: 'a', text: '不可能触发' },
      { id: 'b', text: '在特定地形可能被人为触发' },
      { id: 'c', text: '会自然发生大量雪崩' },
      { id: 'd', text: '所有地形都很危险' }
    ],
    correctAnswer: 'b',
    explanation: '等级2时，雪崩可能在特定地形中被人为触发，但自然雪崩不太可能发生。',
    keyTakeaway: '中等危险时特定地形可能触发雪崩',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-010',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级4（高）时，预期会发生什么？',
    options: [
      { id: 'a', text: '没有自然雪崩' },
      { id: 'b', text: '仅孤立的小雪崩' },
      { id: 'c', text: '自然雪崩和人为触发雪崩都很可能发生' },
      { id: 'd', text: '雪崩不可能被触发' }
    ],
    correctAnswer: 'c',
    explanation: '等级4时，自然雪崩和人为触发雪崩都很可能发生，即使在简单地形中也可能触发。',
    keyTakeaway: '高危险时自然和人为雪崩都很可能',
    relatedPage: '/safety/danger-scale'
  },

  // Easy - True/False (9 questions)
  {
    id: 'ds-011',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级1意味着完全没有雪崩危险。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。即使在等级1（低）时，极端地形中仍可能存在孤立的不稳定地带，仍需保持谨慎。',
    keyTakeaway: '低危险不等于无危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-012',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级越高，发生自然雪崩的可能性越大。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。随着危险等级升高（1到5），自然雪崩的可能性和规模都会增加。',
    keyTakeaway: '等级越高自然雪崩可能性越大',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-013',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '雪崩危险等级会根据海拔高度有所不同。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。雪崩预报通常会给出不同海拔带的危险等级，如高山带、树线带、树线以下可能有不同等级。',
    keyTakeaway: '危险等级因海拔而异',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-014',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '在等级5（极高）时，通常被认为安全的地形也可能发生雪崩。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。等级5时，大量大型自然雪崩可能发生在所有地形中，包括通常被认为安全的地形。',
    keyTakeaway: '极高危险时安全地形也危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-015',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级2（中等）时不需要携带雪崩安全装备。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。无论危险等级如何，进入雪崩地形都应携带完整的雪崩安全装备（信标、铲、探杆）。',
    keyTakeaway: '任何等级都需携带安全装备',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-016',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级3（相当大）时，应避免大的或复杂的雪崩地形。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。等级3时应避免大型或复杂地形，选择小型、简单、被很好连接的地形。',
    keyTakeaway: '相当大危险时避免复杂地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-017',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '人为触发的雪崩只会在高危险等级时发生。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。即使在低危险等级时，在特定不稳定地带仍可能被人为触发雪崩。',
    keyTakeaway: '任何等级都可能人为触发雪崩',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-018',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级只考虑雪崩的可能性，不考虑雪崩的规模。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'b',
    explanation: '错误。危险等级综合考虑雪崩的可能性（或然率）、规模大小以及空间分布。',
    keyTakeaway: '危险等级考虑可能性和规模',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-019',
    type: 'truefalse',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级4（高）时，应避免所有雪崩地形。',
    options: [
      { id: 'a', text: '正确' },
      { id: 'b', text: '错误' }
    ],
    correctAnswer: 'a',
    explanation: '正确。等级4时应避免所有雪崩地形，即使是简单地形也很容易触发雪崩。',
    keyTakeaway: '高危险时避免所有雪崩地形',
    relatedPage: '/safety/danger-scale'
  },

  // Easy - Scenario (6 questions)
  {
    id: 'ds-020',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '今天的雪崩预报显示危险等级为1（低）。你计划去滑雪，应该怎么做？',
    scenarioContext: '预报：等级1-低，雪况稳定，仅极端地形有孤立不稳定区',
    options: [
      { id: 'a', text: '可以去任何地形，不用担心雪崩' },
      { id: 'b', text: '正常谨慎出行，但仍注意极端地形' },
      { id: 'c', text: '取消行程，太危险' },
      { id: 'd', text: '不需要携带雪崩装备' }
    ],
    correctAnswer: 'b',
    explanation: '等级1时可以正常出行，但仍需保持谨慎意识，注意极端地形中可能存在的孤立不稳定区。',
    keyTakeaway: '低危险也需保持谨慎',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-021',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '雪崩预报显示危险等级为5（极高），主要因为昨夜的暴风雪。你应该如何决策？',
    scenarioContext: '预报：等级5-极高，预期大量大型自然雪崩',
    options: [
      { id: 'a', text: '留在家中或安全区域，不进入雪崩地形' },
      { id: 'b', text: '只走树林里的简单路线' },
      { id: 'c', text: '带上专业向导出行' },
      { id: 'd', text: '小心一点就可以去' }
    ],
    correctAnswer: 'a',
    explanation: '等级5时应避免所有雪崩地形，最安全的选择是留在家中或安全区域，等待条件改善。',
    keyTakeaway: '极高危险时不应进入雪崩地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-022',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级为2（中等），你在规划路线时应该特别注意什么？',
    scenarioContext: '预报：等级2-中等，特定地形可能触发雪崩',
    options: [
      { id: 'a', text: '可以忽略雪崩危险' },
      { id: 'b', text: '识别并避开特定的不稳定地形' },
      { id: 'c', text: '所有地形都很安全' },
      { id: 'd', text: '不需要做雪况评估' }
    ],
    correctAnswer: 'b',
    explanation: '等级2时需要识别特定的不稳定地形并避开这些区域，做好地形选择。',
    keyTakeaway: '中等危险时需识别不稳定地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-023',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '你查看预报，高山带危险等级为4，树线以下为2。你应该在哪里活动？',
    scenarioContext: '预报：高山带等级4-高，树线以下等级2-中等',
    options: [
      { id: 'a', text: '在高山带活动，景色更好' },
      { id: 'b', text: '在树线以下活动，并谨慎选择地形' },
      { id: 'c', text: '哪里都不去' },
      { id: 'd', text: '两个区域都可以自由活动' }
    ],
    correctAnswer: 'b',
    explanation: '应选择危险等级较低的树线以下区域活动，并继续谨慎选择地形，避开不稳定地带。',
    keyTakeaway: '选择低危险等级区域活动',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-024',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '危险等级3（相当大），你的朋友建议去滑一条大型陡峭的沟槽。你的决定是？',
    scenarioContext: '预报：等级3-相当大，建议避免大型复杂地形',
    options: [
      { id: 'a', text: '同意，带上装备就好' },
      { id: 'b', text: '拒绝，等级3应避免大型复杂地形' },
      { id: 'c', text: '让朋友先试一试' },
      { id: 'd', text: '只要小心就可以' }
    ],
    correctAnswer: 'b',
    explanation: '等级3时应避免大型和复杂的地形，选择小型、简单的地形。大型陡峭沟槽不适合在这个等级进入。',
    keyTakeaway: '等级3避免大型复杂地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-025',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'easy',
    question: '你在山上，早上出发时危险等级是2，中午预报更新为3。你应该怎么做？',
    scenarioContext: '条件变化：等级2升至等级3',
    options: [
      { id: 'a', text: '继续原计划，已经出来了' },
      { id: 'b', text: '重新评估路线，避开复杂地形或考虑撤退' },
      { id: 'c', text: '加快速度完成路线' },
      { id: 'd', text: '忽略预报更新' }
    ],
    correctAnswer: 'b',
    explanation: '危险等级上升时应重新评估计划，调整路线选择或撤退到更安全的地形，不要固守原计划。',
    keyTakeaway: '危险等级变化时应重新评估',
    relatedPage: '/safety/danger-scale'
  },

  // MEDIUM QUESTIONS (20 total: ds-026 to ds-045)

  // Medium - Single Choice (10 questions)
  {
    id: 'ds-026',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '雪崩危险等级的评估主要基于哪三个因素？',
    options: [
      { id: 'a', text: '温度、风速、降雪量' },
      { id: 'b', text: '可能性、规模、分布' },
      { id: 'c', text: '坡度、坡向、海拔' },
      { id: 'd', text: '雪深、密度、温度' }
    ],
    correctAnswer: 'b',
    explanation: '雪崩危险等级基于三个核心因素：雪崩发生的可能性（或然率）、雪崩的规模大小、以及不稳定性的空间分布。',
    keyTakeaway: '危险等级基于可能性、规模、分布',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-027',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '在可能性-规模矩阵中，"可能"的自然雪崩加上"中等"规模，对应什么危险等级？',
    options: [
      { id: 'a', text: '等级2-中等' },
      { id: 'b', text: '等级3-相当大' },
      { id: 'c', text: '等级4-高' },
      { id: 'd', text: '等级5-极高' }
    ],
    correctAnswer: 'b',
    explanation: '根据可能性-规模矩阵，"可能"的发生概率加上"中等"规模通常对应等级3（相当大）。',
    keyTakeaway: '可能性和规模共同决定危险等级',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-028',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '什么是"空间分布"在危险评级中的意义？',
    options: [
      { id: 'a', text: '雪崩发生的时间' },
      { id: 'b', text: '不稳定性在地形中的广泛程度' },
      { id: 'c', text: '雪崩的运动距离' },
      { id: 'd', text: '雪崩碎屑的分布' }
    ],
    correctAnswer: 'b',
    explanation: '空间分布指不稳定性在地形中的分布广泛程度，分布越广，危险等级越高。',
    keyTakeaway: '空间分布指不稳定性的广泛程度',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-029',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '危险等级2（中等）与等级3（相当大）的主要区别是什么？',
    options: [
      { id: 'a', text: '等级3的雪崩更大且分布更广' },
      { id: 'b', text: '等级2没有雪崩危险' },
      { id: 'c', text: '等级3只有自然雪崩' },
      { id: 'd', text: '没有实质区别' }
    ],
    correctAnswer: 'a',
    explanation: '等级3相比等级2，雪崩的规模更大，不稳定性的空间分布更广泛，触发可能性也更高。',
    keyTakeaway: '等级3比等级2规模更大分布更广',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-030',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '在等级3（相当大）时，推荐的地形选择是什么？',
    options: [
      { id: 'a', text: '大型开阔山坡' },
      { id: 'b', text: '小型、简单、被很好连接的地形' },
      { id: 'c', text: '复杂的沟槽地形' },
      { id: 'd', text: '所有地形都应避免' }
    ],
    correctAnswer: 'b',
    explanation: '等级3时应选择小型、简单、被很好连接（支撑良好）的地形，避免大型或复杂的雪崩地形。',
    keyTakeaway: '等级3选择小型简单地形',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-031',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '什么情况下同一区域可能有不同的危险等级？',
    options: [
      { id: 'a', text: '不同的海拔高度带' },
      { id: 'b', text: '不同的时间' },
      { id: 'c', text: '不同的坡向' },
      { id: 'd', text: '以上都对' }
    ],
    correctAnswer: 'd',
    explanation: '危险等级可能因海拔高度、时间（日间变化）、坡向（阳坡阴坡）等因素而不同，需要仔细阅读预报细节。',
    keyTakeaway: '危险等级可因多种因素而异',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-032',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '为什么等级3被称为"相当大"而不是"中等"或"高"？',
    options: [
      { id: 'a', text: '随意命名的' },
      { id: 'b', text: '表示危险已经很显著，需要谨慎决策和地形选择' },
      { id: 'c', text: '与其他国家标准不同' },
      { id: 'd', text: '为了让人们放松警惕' }
    ],
    correctAnswer: 'b',
    explanation: '"相当大"强调危险已经很显著，需要做出明智的地形选择和谨慎决策，这是事故高发等级。',
    keyTakeaway: '相当大意味着需要谨慎决策',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-033',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '在等级4（高）时，即使在简单地形中，雪崩触发的可能性如何？',
    options: [
      { id: 'a', text: '不可能' },
      { id: 'b', text: '很低' },
      { id: 'c', text: '很容易' },
      { id: 'd', text: '需要特殊条件' }
    ],
    correctAnswer: 'c',
    explanation: '等级4时，即使在简单地形中也很容易触发雪崩，这就是为什么建议避免所有雪崩地形。',
    keyTakeaway: '高危险时简单地形也易触发',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-034',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '雪崩预报中的"自然雪崩"是指什么？',
    options: [
      { id: 'a', text: '由滑雪者触发的雪崩' },
      { id: 'b', text: '无需外部触发，由雪层自身重量和条件引发的雪崩' },
      { id: 'c', text: '由爆破控制引发的雪崩' },
      { id: 'd', text: '发生在自然保护区的雪崩' }
    ],
    correctAnswer: 'b',
    explanation: '自然雪崩是指无需人为触发或外部干扰，由雪层自身的不稳定性和条件自然引发的雪崩。',
    keyTakeaway: '自然雪崩无需外部触发',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-035',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '在危险等级评估中，"人为触发"的可能性通常在什么等级开始变得"可能"？',
    options: [
      { id: 'a', text: '等级1' },
      { id: 'b', text: '等级2' },
      { id: 'c', text: '等级3' },
      { id: 'd', text: '等级4' }
    ],
    correctAnswer: 'c',
    explanation: '在等级3（相当大）时，人为触发雪崩的可能性变得"可能"，在许多地形特征中都可能被触发。',
    keyTakeaway: '等级3时人为触发变得可能',
    relatedPage: '/safety/danger-scale'
  },

  // Medium - Multiple Choice (6 questions)
  {
    id: 'ds-036',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '以下哪些是危险等级2（中等）的典型特征？（选择所有正确答案）',
    options: [
      { id: 'a', text: '在特定地形可能被人为触发' },
      { id: 'b', text: '自然雪崩不太可能' },
      { id: 'c', text: '大量大型自然雪崩' },
      { id: 'd', text: '需要谨慎的路线选择' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '等级2的特征包括：特定地形可能人为触发、自然雪崩不太可能、需要谨慎的路线选择和雪况评估。大量大型自然雪崩是等级5的特征。',
    keyTakeaway: '等级2需谨慎路线选择',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-037',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '影响雪崩危险等级的因素包括哪些？（选择所有正确答案）',
    options: [
      { id: 'a', text: '最近的降雪量' },
      { id: 'b', text: '风力和风向' },
      { id: 'c', text: '温度变化' },
      { id: 'd', text: '滑雪者的技术水平' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '降雪量、风力风向、温度变化都是影响雪层稳定性和危险等级的关键气象因素。滑雪者技术不影响雪崩危险本身。',
    keyTakeaway: '气象因素影响危险等级',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-038',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '在等级3（相当大）时，以下哪些做法是推荐的？（选择所有正确答案）',
    options: [
      { id: 'a', text: '避免大型开阔山坡' },
      { id: 'b', text: '一次只让一人进入雪崩路径' },
      { id: 'c', text: '选择复杂的沟槽地形' },
      { id: 'd', text: '识别和避开明显的雪崩地形陷阱' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: '等级3时应避免大型山坡、一次一人通过、避开地形陷阱。复杂沟槽地形应该避免，不是推荐做法。',
    keyTakeaway: '等级3需要严格的地形管理',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-039',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '雪崩规模在危险评级中的分类通常包括哪些？（选择所有正确答案）',
    options: [
      { id: 'a', text: '小型（相对无害）' },
      { id: 'b', text: '中等（可埋人、伤人或致死）' },
      { id: 'c', text: '大型（可摧毁车辆和建筑）' },
      { id: 'd', text: '超大型（可改变地貌）' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: '雪崩规模通常分为：小型（相对无害）、中等（可埋人）、大型（可摧毁建筑）、超大型（可改变地貌）。规模是危险评级的关键因素。',
    keyTakeaway: '雪崩规模从小型到超大型',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-040',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '关于危险等级的说法，哪些是正确的？（选择所有正确答案）',
    options: [
      { id: 'a', text: '是对区域的总体评估，不是具体山坡' },
      { id: 'b', text: '会随时间和条件变化而更新' },
      { id: 'c', text: '相同等级的危险可能有不同的问题类型' },
      { id: 'd', text: '只需看等级数字，不用看详细预报' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '危险等级是区域性评估、会更新、同等级可能有不同问题。但必须阅读详细预报，了解具体的雪崩问题和分布。',
    keyTakeaway: '必须阅读详细预报',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-041',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '等级4（高）危险时的典型情况包括？（选择所有正确答案）',
    options: [
      { id: 'a', text: '自然雪崩很可能发生' },
      { id: 'b', text: '人为触发在许多地形都很容易' },
      { id: 'c', text: '应避免所有雪崩地形' },
      { id: 'd', text: '可以在简单地形谨慎活动' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '等级4时自然雪崩很可能、人为触发很容易、应避免所有雪崩地形。即使简单地形也很危险，不应进入。',
    keyTakeaway: '等级4应避免所有雪崩地形',
    relatedPage: '/safety/danger-scale'
  },

  // Medium - Scenario (4 questions)
  {
    id: 'ds-042',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '预报显示等级3，雪崩问题是北坡和东坡的风积雪。你计划走南坡，应该如何决策？',
    scenarioContext: '预报：等级3，问题坡向北和东，你的路线在南坡',
    options: [
      { id: 'a', text: '南坡很安全，不用担心' },
      { id: 'b', text: '虽然南坡风险较低，但仍需评估地形和雪况，保持谨慎' },
      { id: 'c', text: '等级3太危险，不应出行' },
      { id: 'd', text: '只要避开北坡和东坡就完全安全' }
    ],
    correctAnswer: 'b',
    explanation: '虽然问题坡向在北和东，南坡相对风险较低，但等级3仍需谨慎，要评估具体地形和雪况，不能完全放松警惕。',
    keyTakeaway: '非问题坡向仍需谨慎评估',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-043',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '昨天等级2，今天新降雪50cm伴有强风，预报更新为等级4。你已经计划好的路线应该怎么调整？',
    scenarioContext: '条件急剧恶化：等级2→等级4，新雪50cm+强风',
    options: [
      { id: 'a', text: '改为更简单的路线' },
      { id: 'b', text: '取消行程，等级4应避免所有雪崩地形' },
      { id: 'c', text: '按原计划，只是更小心' },
      { id: 'd', text: '等到下午雪层稳定后再去' }
    ],
    correctAnswer: 'b',
    explanation: '等级4时应避免所有雪崩地形，最明智的决策是取消行程，等待条件改善。',
    keyTakeaway: '等级4应取消进入雪崩地形的计划',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-044',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '预报等级3，你观察到远处山坡有多处自然雪崩发生。你的评估应该是？',
    scenarioContext: '预报等级3，观察到多处自然雪崩',
    options: [
      { id: 'a', text: '已经释放了，现在更安全' },
      { id: 'b', text: '实际危险可能比预报更高，应更加保守' },
      { id: 'c', text: '正常情况，符合等级3' },
      { id: 'd', text: '与自己的路线无关' }
    ],
    correctAnswer: 'b',
    explanation: '等级3时不应看到大量自然雪崩，这表明实际情况可能更接近等级4，应采取更保守的决策。',
    keyTakeaway: '现场观察比预报更严重时要保守',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-045',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'medium',
    question: '你在树线以下（等级2），想上到高山带（等级3）。应该如何考虑这个决策？',
    scenarioContext: '海拔分层：树线下等级2，高山带等级3',
    options: [
      { id: 'a', text: '可以上去，只是高一级' },
      { id: 'b', text: '评估能力和经验是否足够应对等级3，调整地形选择' },
      { id: 'c', text: '完全不能去高山带' },
      { id: 'd', text: '等级差异可以忽略' }
    ],
    correctAnswer: 'b',
    explanation: '从等级2到等级3是显著的危险提升，需要评估团队能力、经验，以及是否能够做出适当的地形选择来应对更高的危险。',
    keyTakeaway: '等级提升需重新评估能力和计划',
    relatedPage: '/safety/danger-scale'
  },

  // HARD QUESTIONS (15 total: ds-046 to ds-060)

  // Hard - Single Choice (8 questions)
  {
    id: 'ds-046',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '在可能性-规模矩阵中，"很可能"的人为触发加上"大型"规模，最可能对应什么危险等级？',
    options: [
      { id: 'a', text: '等级2-中等' },
      { id: 'b', text: '等级3-相当大' },
      { id: 'c', text: '等级4-高' },
      { id: 'd', text: '等级5-极高' }
    ],
    correctAnswer: 'c',
    explanation: '"很可能"的人为触发结合"大型"规模通常对应等级4（高），表明危险已经非常严重。',
    keyTakeaway: '高可能性+大规模=高危险',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-047',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '为什么相同的危险等级在不同天可能意味着不同的风险？',
    options: [
      { id: 'a', text: '预报员的主观判断不同' },
      { id: 'b', text: '雪崩问题类型、分布和敏感性可能完全不同' },
      { id: 'c', text: '等级划分标准每天都在变' },
      { id: 'd', text: '实际上风险是完全相同的' }
    ],
    correctAnswer: 'b',
    explanation: '相同等级可能涉及不同的雪崩问题（如风积雪vs弱层）、不同的空间分布、不同的触发敏感性，因此具体风险特征差异很大。',
    keyTakeaway: '相同等级可能有不同的问题类型',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-048',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '在等级3（相当大）时，如果雪崩问题是"持久性板层"，相比"风积雪"问题，你的警惕程度应该如何？',
    options: [
      { id: 'a', text: '一样' },
      { id: 'b', text: '持久性板层更需警惕，因为更难识别和预测' },
      { id: 'c', text: '风积雪更危险' },
      { id: 'd', text: '等级3都很安全' }
    ],
    correctAnswer: 'b',
    explanation: '持久性板层问题通常更难识别、分布更隐蔽、持续时间更长，相比风积雪问题需要更高的警惕和更保守的决策。',
    keyTakeaway: '持久性板层问题需要更高警惕',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-049',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '什么是"不确定性"在危险等级评估中的作用？',
    options: [
      { id: 'a', text: '不确定性越高，应采取更保守的决策' },
      { id: 'b', text: '不确定性可以忽略' },
      { id: 'c', text: '不确定性只影响预报员' },
      { id: 'd', text: '不确定性降低危险等级' }
    ],
    correctAnswer: 'a',
    explanation: '当条件不确定性高时（如缺乏观察数据、快速变化的天气），应采取更保守的决策和安全边际。',
    keyTakeaway: '不确定性高时要更保守',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-050',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '为什么等级之间不是线性关系（如等级3不是等级1的3倍危险）？',
    options: [
      { id: 'a', text: '等级是定性描述，综合多个维度的非线性变化' },
      { id: 'b', text: '为了简化计算' },
      { id: 'c', text: '实际上是线性的' },
      { id: 'd', text: '随机划分的' }
    ],
    correctAnswer: 'a',
    explanation: '危险等级是定性描述，综合了可能性、规模、分布等多个维度，这些因素的组合是非线性的，不能简单量化比较。',
    keyTakeaway: '危险等级是非线性的定性评估',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-051',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '在什么情况下，即使危险等级为2，经验丰富的专业人士也可能选择不进入特定地形？',
    options: [
      { id: 'a', text: '从不会，等级2很安全' },
      { id: 'b', text: '当特定地形有明显的红旗信号或高后果性' },
      { id: 'c', text: '只有在等级4以上才需要这样' },
      { id: 'd', text: '这是过度谨慎' }
    ],
    correctAnswer: 'b',
    explanation: '即使总体等级为2，特定地形可能显示明显的不稳定信号（红旗），或者地形后果性极高（地形陷阱），此时应避开。',
    keyTakeaway: '局部条件可能比总体等级更严重',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-052',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '雪崩预报中的"可能性"评估，主要考虑什么时间范围？',
    options: [
      { id: 'a', text: '当前时刻' },
      { id: 'b', text: '预报有效期内（通常24小时）' },
      { id: 'c', text: '整个冬季' },
      { id: 'd', text: '下一小时' }
    ],
    correctAnswer: 'b',
    explanation: '雪崩预报的可能性评估是针对预报有效期内（通常为发布后的24小时）的时间范围。',
    keyTakeaway: '预报有效期通常为24小时',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-053',
    type: 'single',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '什么是"条件性"危险等级？',
    options: [
      { id: 'a', text: '随机变化的等级' },
      { id: 'b', text: '在特定条件下（如日间升温、降雨）等级会上升' },
      { id: 'c', text: '不存在这个概念' },
      { id: 'd', text: '只适用于专业人士的等级' }
    ],
    correctAnswer: 'b',
    explanation: '条件性等级指在特定条件触发下（如日间强烈升温、降雨、风力增强）危险等级会上升，需要关注条件变化。',
    keyTakeaway: '条件变化可能提升危险等级',
    relatedPage: '/safety/danger-scale'
  },

  // Hard - Multiple Choice (2 questions)
  {
    id: 'ds-054',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '评估实际危险是否比预报等级更高的"红旗"信号包括哪些？（选择所有正确答案）',
    options: [
      { id: 'a', text: '观察到近期自然雪崩' },
      { id: 'b', text: '发现明显的雪崩裂缝' },
      { id: 'c', text: '听到"嘭嘭"声或感到沉降' },
      { id: 'd', text: '天气晴朗' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '近期自然雪崩、裂缝、嘭嘭声/沉降都是明显的不稳定信号，表明实际危险可能高于预报。晴天不是红旗信号。',
    keyTakeaway: '红旗信号表明实际危险更高',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-055',
    type: 'multiple',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '在使用危险等级做决策时，还需要考虑哪些因素？（选择所有正确答案）',
    options: [
      { id: 'a', text: '团队的经验和技能水平' },
      { id: 'b', text: '救援响应时间和可获得性' },
      { id: 'c', text: '地形的后果性（地形陷阱）' },
      { id: 'd', text: '社交媒体上的照片' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: '决策需综合考虑团队能力、救援条件、地形后果性。社交媒体照片不应作为主要决策依据，可能存在时空误导。',
    keyTakeaway: '决策需综合多个因素',
    relatedPage: '/safety/danger-scale'
  },

  // Hard - Scenario (5 questions)
  {
    id: 'ds-056',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '预报等级2（中等），但详细预报提到"树线以上北坡有持久性弱层，非常敏感"。你计划去北坡高山带，应该如何决策？',
    scenarioContext: '预报：总体等级2，但北坡高山带有敏感弱层',
    options: [
      { id: 'a', text: '等级2很安全，可以去' },
      { id: 'b', text: '详细预报显示你的目标区域风险显著，应重新考虑或选择其他坡向' },
      { id: 'c', text: '带上装备就足够' },
      { id: 'd', text: '等级数字比详细描述更重要' }
    ],
    correctAnswer: 'b',
    explanation: '虽然总体等级为2，但详细预报明确指出你的目标区域（北坡高山带）存在敏感问题，局部风险可能更高，应该重新考虑计划。',
    keyTakeaway: '详细预报比等级数字更重要',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-057',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '等级3（相当大），你在一个简单的北坡滑行，没有发现任何不稳定信号。队友建议去附近一个更陡峭的东北坡沟槽，如何决策？',
    scenarioContext: '等级3，当前简单坡面稳定，队友建议去陡峭沟槽',
    options: [
      { id: 'a', text: '既然这里稳定，沟槽应该也稳定' },
      { id: 'b', text: '当前坡面的稳定不代表其他地形，沟槽是复杂地形且有地形陷阱，应避免' },
      { id: 'c', text: '让队友先去测试' },
      { id: 'd', text: '等级3可以去任何地形' }
    ],
    correctAnswer: 'b',
    explanation: '雪层稳定性在空间上变化很大，当前坡面稳定不代表其他地形。等级3应避免陡峭沟槽这样的复杂地形和地形陷阱。',
    keyTakeaway: '稳定性空间差异大，避免推广',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-058',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '预报等级2-3（早晨2，随着日间升温会升至3）。你9点出发，计划下午1点返回。应该如何规划？',
    scenarioContext: '条件性等级：早晨2→下午3，因日间升温',
    options: [
      { id: 'a', text: '按等级2规划，下午加快速度' },
      { id: 'b', text: '按等级3规划路线，并计划在升温前完成暴露地形' },
      { id: 'c', text: '等级变化可以忽略' },
      { id: 'd', text: '下午温度高更安全' }
    ],
    correctAnswer: 'b',
    explanation: '应该按更高等级（3）规划路线和地形选择，并安排时间在升温导致不稳定性增加之前完成关键暴露路段。',
    keyTakeaway: '按预期最高等级规划',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-059',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '等级3，雪崩问题描述为"广泛分布的持久性板层，特别是坡度35-40度"。你计划的路线包括一个38度的山坡，但有树木锚点。决策？',
    scenarioContext: '等级3，持久板层问题，目标坡面38度有树木',
    options: [
      { id: 'a', text: '树木提供锚点，可以去' },
      { id: 'b', text: '38度正好在问题坡度范围内，即使有树木也应避免' },
      { id: 'c', text: '小心滑行就可以' },
      { id: 'd', text: '先做雪坑测试' }
    ],
    correctAnswer: 'b',
    explanation: '坡度38度正好在问题描述的高危坡度范围（35-40度）内，持久板层问题广泛分布，即使有树木锚点也应避开这个坡度范围。',
    keyTakeaway: '符合问题描述的地形应避免',
    relatedPage: '/safety/danger-scale'
  },
  {
    id: 'ds-060',
    type: 'scenario',
    category: 'danger-scale',
    difficulty: 'hard',
    question: '相邻两个预报区域，A区等级3，B区等级2，你的路线在B区但靠近边界。如何考虑这个情况？',
    scenarioContext: '预报区边界：A区等级3，B区等级2，路线在B区近边界',
    options: [
      { id: 'a', text: 'B区等级2，很安全' },
      { id: 'b', text: '预报区边界附近条件可能过渡，应谨慎并观察A区问题是否延伸到B区' },
      { id: 'c', text: '预报区边界是绝对的' },
      { id: 'd', text: '只需关注B区预报' }
    ],
    correctAnswer: 'b',
    explanation: '预报区边界不是绝对的，雪崩问题可能跨越边界。靠近高危区域时应提高警惕，观察A区的问题是否延伸到你的区域。',
    keyTakeaway: '预报区边界附近需谨慎',
    relatedPage: '/safety/danger-scale'
  }
];

export default questions;
