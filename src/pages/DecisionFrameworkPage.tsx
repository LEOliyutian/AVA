import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { knowledgeApi, type KnowledgeNote } from '../api/knowledge.api';
import './DecisionFrameworkPage.css';
import './knowledge-shared.css';

/* ──────── 三阶段决策模型 ──────── */

interface DecisionPhase {
  phase: string;
  phaseEn: string;
  when: string;
  color: string;
  questions: { q: string; detail: string }[];
}

const decisionPhases: DecisionPhase[] = [
  {
    phase: '出行前',
    phaseEn: 'Before You Go',
    when: '出发前一天至当天早晨',
    color: '#3b82f6',
    questions: [
      { q: '当前雪崩预报等级是多少？', detail: '查看最新的雪崩预报，了解各海拔带和坡向的危险等级。3级及以上需要特别谨慎。' },
      { q: '近期天气趋势如何？', detail: '关注降雪量、风速风向、温度变化。24小时内超过30cm新雪、强风或快速升温都是危险信号。' },
      { q: '主要的雪崩问题类型是什么？', detail: '不同问题类型有不同的管理策略。持续板比暴风雪板更难预测，需要更保守的地形选择。' },
      { q: '我的路线是否涉及雪崩地形？', detail: '在地图上评估路线中的坡度、坡向和地形陷阱。规划备选路线以应对条件变化。' },
      { q: '团队是否具备必要的装备和技能？', detail: '确认所有人携带三件套且熟练使用，确认急救和通讯方案。如有新手，选择更保守的路线。' },
    ],
  },
  {
    phase: '途中观察',
    phaseEn: 'On the Way',
    when: '接近目标区域的路途中',
    color: '#f59e0b',
    questions: [
      { q: '是否看到近期雪崩活动迹象？', detail: '新鲜的雪崩堆积物、断裂面、碎片扇形区——这些是雪层不稳定的最明确证据。' },
      { q: '雪面是否有报警信号？', detail: '"嘭"声（坍塌声）、雪面裂缝、雪面下沉——这些都是雪板存在且不稳定的直接信号。' },
      { q: '实际天气与预报是否一致？', detail: '如果风比预报更强、降雪比预报更多、或温度比预报更高，需要上调风险评估。' },
      { q: '雪面状况是否符合预期？', detail: '关注风加载的迹象（雪旗、风壳）、新雪深度和密度，以及融化程度。' },
    ],
  },
  {
    phase: '现场决策',
    phaseEn: 'At the Slope',
    when: '到达目标坡面时',
    color: '#ef4444',
    questions: [
      { q: '这个坡面的实际坡度是多少？', detail: '使用测坡仪或手机 App 测量。坡度感知往往不准确——看起来像30°的坡可能实际35°以上。' },
      { q: '坡面上方和下方有什么地形特征？', detail: '上方是否有雪檐？下方是否有悬崖、沟道？"如果这个坡面滑了，后果是什么？"' },
      { q: '是否可以做简易稳定性测试？', detail: '滑雪切割测试、手掌剪切测试等快速方法可以提供额外信息。' },
      { q: '是否有安全的一次一人通过方案？', detail: '确定上方观察位置、安全集合点。一次仅一人暴露在危险区域，其他人在安全位置观察。' },
      { q: '如果选择不进入，是否有好的替代方案？', detail: '永远有替代选择。最好的滑雪者不是能滑最陡的坡，而是能一次次做出正确的"不去"的决定。' },
    ],
  },
];

/* ──────── 认知陷阱 ──────── */

interface CognitiveTrap {
  name: string;
  nameEn: string;
  color: string;
  description: string;
  example: string;
  countermeasure: string;
}

const traps: CognitiveTrap[] = [
  {
    name: '熟悉陷阱',
    nameEn: 'Familiarity',
    color: '#f59e0b',
    description: '对经常去的地方放松警惕。"我滑过这个坡100次了，从来没出过问题。"过去的安全经历不等于当前安全。',
    example: '某滑雪者在常去的背风坡触发了持续板雪崩。那个坡面此前一直安全，但本季新的弱层结构改变了风险状况。',
    countermeasure: '每次都像第一次到访一样评估。条件每天都在变化——同一个坡面在不同的雪层条件下风险完全不同。',
  },
  {
    name: '承诺陷阱',
    nameEn: 'Commitment / Consistency',
    color: '#ef4444',
    description: '一旦制定了计划就不愿改变，即使条件发生变化。"我们开了3小时的车来这里，不能空手而归。"',
    example: '团队发现预报等级比出发时上调了一级，但因为已经到达停车场而决定继续执行原计划。',
    countermeasure: '明确区分"目标"和"计划"。目标是安全享受户外，计划应该随条件灵活调整。预先制定"触发条件"——什么情况下改变计划。',
  },
  {
    name: '专家光环',
    nameEn: 'Expert Halo',
    color: '#8b5cf6',
    description: '盲目跟随团队中经验最丰富的人的决策。"他是向导/巡逻队员，他说安全就是安全。"专家也会犯错。',
    example: '团队中的资深向导低估了风险，其他成员虽有疑虑但选择沉默。实际上那天条件恰好处于向导经验的盲区。',
    countermeasure: '建立团队文化：任何人都可以说"不"，且不需要理由。鼓励最没经验的人先发言，避免被"权威"影响。',
  },
  {
    name: '群体效应',
    nameEn: 'Social Facilitation',
    color: '#3b82f6',
    description: '看到其他人进入了某个坡面就认为是安全的。"前面有人的雪道痕迹，说明这个坡是安全的。"',
    example: '看到另一个团队滑下某条沟道后跟进。实际上第一组可能只是幸运——他们的通过可能已经削弱了雪板，后续通过者反而更危险。',
    countermeasure: '其他人的行为不是安全依据。独立评估，基于你自己观察到的信号做决策。',
  },
  {
    name: '稀缺心理',
    nameEn: 'Scarcity',
    color: '#06b6d4',
    description: '"完美粉雪/好天气难得，必须抓住机会。"将有限的好条件视为必须把握的机会，从而接受更高的风险。',
    example: '一场大雪后的晴天窗口期，所有人都急于出行。但大雪之后往往正是暴风雪板风险最高的时期。',
    countermeasure: '粉雪会再来，但生命只有一次。最好的粉雪日往往也是最危险的日子——风险和回报常常同步增长。',
  },
  {
    name: '乐观偏差',
    nameEn: 'Optimism Bias',
    color: '#10b981',
    description: '"雪崩不会发生在我身上。"低估自己面临的风险，高估自己的能力和运气。统计数据表明大多数雪崩受害者都有丰富的经验。',
    example: '经验丰富的滑雪者认为自己能够"感觉到"雪板是否稳定，而忽视了客观的预报和观测数据。',
    countermeasure: '记住：雪崩受害者的平均经验年限超过10年。经验可以帮助你识别风险，但不能让你免于风险。依靠数据和流程，而非直觉。',
  },
];

/* ──────── 明显线索法 ──────── */

const obviousClues = [
  {
    category: '确定性线索',
    categoryEn: 'Certain Clues',
    color: '#ef4444',
    level: '看到即撤退',
    clues: [
      '正在发生的雪崩活动（自然释放）',
      '你脚下或附近出现"嘭"声（雪层坍塌声）',
      '雪面出现射击裂纹（从你的位置向外延伸的裂缝）',
      '过去 24 小时内的新鲜雪崩痕迹',
    ],
  },
  {
    category: '高度警示线索',
    categoryEn: 'Red Flags',
    color: '#f59e0b',
    level: '极度保守选择',
    clues: [
      '24 小时内降雪超过 30cm 或持续降雪',
      '强风加载（可见雪旗、风搬运）',
      '气温快速上升（接近 0°C 或超过 0°C）',
      '降雨事件（任何海拔的降雨都是严重警告）',
      '阳面雪面大面积湿润或滚球',
    ],
  },
  {
    category: '需要关注的线索',
    categoryEn: 'Yellow Flags',
    color: '#3b82f6',
    level: '谨慎评估后决定',
    clues: [
      '雪层中存在已知的弱层（预报或观测报告提及）',
      '风力中等但持续从一个方向吹',
      '多云天气转晴、或晴天转多云',
      '雪面出现局部下沉感',
      '昨日的雪崩活动痕迹（非24小时内但仍然新鲜）',
    ],
  },
];

export function DecisionFrameworkPage() {
  const [note, setNote] = useState<KnowledgeNote | null>(null);
  useEffect(() => {
    knowledgeApi.getNote('decision').then((res) => {
      if (res.success && res.data?.note) setNote(res.data.note);
    });
  }, []);

  return (
    <div className="taiga-page">
      <main className="taiga-main">
        {/* Header */}
        <div className="decision-header">
          <Link to="/safety" className="decision-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="decision-title">出行决策框架</h1>
          <p className="decision-subtitle">
            知识只有转化为行动才有意义。决策框架帮助你将雪崩安全知识系统化地应用到每一次出行中，避免认知偏差导致的错误判断。
          </p>
        </div>

        {/* ── 三阶段决策 ── */}
        <section className="decision-section">
          <div className="decision-section-header">
            <h2>三阶段决策模型</h2>
            <span className="decision-section-en">Three-Phase Decision Model</span>
          </div>
          <div className="decision-section-body">
            <p className="decision-intro">
              安全决策不是在坡面前一刻做出的单一判断，而是从出行前到现场的持续评估过程。每个阶段都有关键问题需要回答。
            </p>
            <div className="decision-phases">
              {decisionPhases.map((dp) => (
                <div key={dp.phaseEn} className="decision-phase-card" style={{ '--phase-color': dp.color } as React.CSSProperties}>
                  <div className="decision-phase-header">
                    <div className="decision-phase-dot" style={{ backgroundColor: dp.color }}></div>
                    <div className="decision-phase-titles">
                      <h3>{dp.phase}</h3>
                      <span className="decision-phase-en-label">{dp.phaseEn}</span>
                    </div>
                    <span className="decision-phase-when">{dp.when}</span>
                  </div>
                  <div className="decision-questions">
                    {dp.questions.map((q, i) => (
                      <div key={i} className="decision-question">
                        <div className="decision-question-marker" style={{ backgroundColor: dp.color }}>
                          {i + 1}
                        </div>
                        <div className="decision-question-content">
                          <h4>{q.q}</h4>
                          <p>{q.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 明显线索法 ── */}
        <section className="decision-section">
          <div className="decision-section-header">
            <h2>明显线索法</h2>
            <span className="decision-section-en">Obvious Clues Method</span>
          </div>
          <div className="decision-section-body">
            <p className="decision-intro">
              不需要成为雪崩专家也能识别危险信号。以下线索按严重程度分为三级，任何人都可以观察和判断。看到高级别线索时应立即调整计划。
            </p>
            <div className="decision-clues-list">
              {obviousClues.map((c) => (
                <div key={c.categoryEn} className="decision-clue-card" style={{ '--clue-color': c.color } as React.CSSProperties}>
                  <div className="decision-clue-header">
                    <div className="decision-clue-badge" style={{ backgroundColor: c.color }}></div>
                    <div>
                      <h3>{c.category}</h3>
                      <span>{c.categoryEn}</span>
                    </div>
                    <span className="decision-clue-level" style={{ color: c.color }}>{c.level}</span>
                  </div>
                  <ul className="decision-clue-items">
                    {c.clues.map((clue, i) => (
                      <li key={i}>
                        <span className="decision-clue-dot" style={{ backgroundColor: c.color }}></span>
                        {clue}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 认知陷阱 ── */}
        <section className="decision-section">
          <div className="decision-section-header">
            <h2>认知陷阱</h2>
            <span className="decision-section-en">Cognitive Traps (Heuristic Biases)</span>
          </div>
          <div className="decision-section-body">
            <p className="decision-intro">
              人类的决策并不总是理性的。以下六种认知陷阱是雪崩事故分析中反复出现的行为模式。认识它们是避免它们的第一步。
            </p>
            <div className="decision-traps-grid">
              {traps.map((t) => (
                <div key={t.nameEn} className="decision-trap-card" style={{ '--trap-color': t.color } as React.CSSProperties}>
                  <div className="decision-trap-header">
                    <h3>{t.name}</h3>
                    <span>{t.nameEn}</span>
                  </div>
                  <p className="decision-trap-desc">{t.description}</p>
                  <div className="decision-trap-example">
                    <h4>典型案例</h4>
                    <p>{t.example}</p>
                  </div>
                  <div className="decision-trap-counter">
                    <h4>对策</h4>
                    <p>{t.countermeasure}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 团队沟通 ── */}
        <section className="decision-section">
          <div className="decision-section-header">
            <h2>团队沟通规则</h2>
            <span className="decision-section-en">Group Communication</span>
          </div>
          <div className="decision-section-body">
            <p className="decision-intro">
              好的团队决策文化可以弥补个人判断的不足。以下规则适用于任何规模的野外活动团队。
            </p>
            <div className="decision-comm-grid">
              <div className="decision-comm-card">
                <h4>一票否决权</h4>
                <p>任何团队成员都可以对进入某个区域行使否决权，且不需要给出理由。"我不太舒服"就是足够的理由。这是最重要的团队安全规则。</p>
              </div>
              <div className="decision-comm-card">
                <h4>反向发言顺序</h4>
                <p>做地形决策时，让经验最少的成员先发表意见。这避免了新手被"专家"意见影响的问题。如果新手觉得不安全，这个信号值得认真对待。</p>
              </div>
              <div className="decision-comm-card">
                <h4>预设触发条件</h4>
                <p>出发前团队共同确定"什么情况下改变计划"。例如："如果看到新鲜雪崩痕迹，我们转向备选路线B"。预先约定比临场讨论更有效。</p>
              </div>
              <div className="decision-comm-card">
                <h4>定时检查点</h4>
                <p>在路线关键节点（上升途中、到达山脊、进入陡坡前）进行团队评估。分享观察到的信号，重新确认计划是否合理。</p>
              </div>
              <div className="decision-comm-card">
                <h4>积极分享观察</h4>
                <p>鼓励所有成员持续报告观察到的信号——"我脚下的雪感觉在下沉"、"那边有风板的痕迹"。碎片化的信息汇集起来可能揭示完整的风险图景。</p>
              </div>
              <div className="decision-comm-card">
                <h4>庆祝好的"不去"决定</h4>
                <p>当团队因为安全考虑而放弃某条路线时，这应该被视为正确的决策而非遗憾。"今天我们做了一个好的安全决定"比"我们错过了好粉雪"更重要。</p>
              </div>
            </div>
          </div>
        </section>

        {note?.content && (
          <div className="knowledge-local-note">
            <div className="knowledge-local-note-header">📍 吉克普林本地说明</div>
            <div
              className="knowledge-local-note-body"
              dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
