import { Link } from 'react-router-dom';
import './RescuePage.css';

/* ──────── 救援时间线 ──────── */

const survivalTimeline = [
  { minutes: '0-15', rate: '> 90%', color: '#22c55e', label: '黄金窗口', desc: '完全掩埋后15分钟内被找到，存活率超过90%。伙伴救援是唯一可行方案。' },
  { minutes: '15-35', rate: '~35%', color: '#f59e0b', label: '快速下降', desc: '15分钟后存活率急剧下降。窒息是主要死因，气腔大小直接影响存活时间。' },
  { minutes: '35-120', rate: '~25%', color: '#ef4444', label: '低温威胁', desc: '存活者面临严重低温症风险。每多一分钟，获救后的预后都在恶化。' },
  { minutes: '> 120', rate: '< 5%', color: '#7c2d12', label: '极低概率', desc: '超过2小时后存活率极低。仅在大气腔或浅埋情况下有少数幸存案例。' },
];

/* ──────── 三件套 ──────── */

interface Equipment {
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  what: string;
  how: string;
  tips: string[];
}

const equipment: Equipment[] = [
  {
    name: '雪崩信标',
    nameEn: 'Avalanche Transceiver',
    icon: '📡',
    color: '#3b82f6',
    what: '发射和接收 457kHz 无线电信号的设备。所有同行人员开机发射模式，搜救时切换为接收模式，根据信号强度和方向引导寻找掩埋者。',
    how: '切换接收模式 → 信号搜索（大范围扫描）→ 粗搜索（跟随信号方向和距离指示）→ 精搜索（在 3m 范围内缓慢移动定位最强信号点）→ 标记位置交给探杆确认。',
    tips: [
      '每次出行前确认电量充足（至少 50%）',
      '佩戴在最内层衣物下方，防止被雪崩剥离',
      '每季初与同伴互相进行收发测试',
      '多人掩埋时标记第一个信号后继续搜索其他信号',
    ],
  },
  {
    name: '雪崩探杆',
    nameEn: 'Avalanche Probe',
    icon: '📏',
    color: '#8b5cf6',
    what: '可快速组装的铝合金或碳纤维杆，长度通常 240-320cm。用于在信标定位后精确确认掩埋者位置和深度。',
    how: '在信标精搜索标记点开始，以 25cm 间距呈螺旋形向外探测。探杆垂直插入雪面，感受到人体时有明显的"软中带弹"反馈（不同于岩石的硬感或树枝的碎裂感）。确认后保留探杆在原位作为挖掘标记。',
    tips: [
      '练习组装速度，目标在 10 秒内完成',
      '探测时双手握杆保持垂直，均匀用力',
      '注意区分人体反馈与其他物体的手感差异',
      '记录探杆插入深度，用于规划挖掘策略',
    ],
  },
  {
    name: '雪崩铲',
    nameEn: 'Avalanche Shovel',
    icon: '⛏️',
    color: '#f59e0b',
    what: '金属刃、大容量的专用雪铲。挖掘是救援中最耗时的环节——平均掩埋深度 1-1.5m 的雪量超过 1 吨。铲子质量直接决定挖掘速度。',
    how: '从探杆标记点的下坡方向 1.5 倍掩埋深度处开始挖掘，采用 V 形或传送带策略。不是向下挖坑，而是从侧面向掩埋者方向推进，挖出的雪向下坡扔。多人时轮换前排挖掘者以保持效率。',
    tips: [
      '选择金属刃铲（塑料刃在硬雪中效率极低）',
      '传送带法：前排挖、后排铲出，定时轮换',
      '先暴露头部和胸部以恢复呼吸',
      '注意掩埋者可能不在探杆正下方（雪崩可能移动身体）',
    ],
  },
];

/* ──────── 救援流程 ──────── */

const rescueSteps = [
  {
    step: 1,
    title: '确保安全',
    subtitle: 'Scene Safety',
    color: '#ef4444',
    actions: [
      '观察是否有二次雪崩风险',
      '指定一名观察员监控上方坡面',
      '确认所有幸存者的安全位置',
      '如果存在持续危险，在安全前提下行动',
    ],
  },
  {
    step: 2,
    title: '快速评估',
    subtitle: 'Quick Assessment',
    color: '#f59e0b',
    actions: [
      '清点人数，确认谁被掩埋',
      '记忆最后看到掩埋者的位置（"最后可见点"）',
      '观察地表线索：装备、衣物碎片、肢体',
      '所有搜救者将信标切换至接收模式',
    ],
  },
  {
    step: 3,
    title: '信标搜索',
    subtitle: 'Transceiver Search',
    color: '#3b82f6',
    actions: [
      '从最后可见点开始向下坡搜索',
      '信号搜索：大步快速移动，找到第一个信号',
      '粗搜索：跟随距离指示接近，保持信标水平',
      '精搜索：3m内缓慢十字移动，找到最小读数点',
    ],
  },
  {
    step: 4,
    title: '探杆定位',
    subtitle: 'Probing',
    color: '#8b5cf6',
    actions: [
      '在信标最小读数点垂直插入探杆',
      '确认接触到人体后保留探杆不拔出',
      '记录掩埋深度用于规划挖掘',
      '如未命中，以 25cm 螺旋间距继续探测',
    ],
  },
  {
    step: 5,
    title: '战略挖掘',
    subtitle: 'Strategic Shoveling',
    color: '#f59e0b',
    actions: [
      '从下坡方向开始挖，距探杆 1.5 倍掩埋深度',
      '采用传送带法，多人轮换前排',
      '优先暴露头部和胸部区域',
      '挖掘过程中注意不要用铲子伤到掩埋者',
    ],
  },
  {
    step: 6,
    title: '急救与撤离',
    subtitle: 'First Aid & Evacuation',
    color: '#22c55e',
    actions: [
      '清理口鼻气道，评估意识和呼吸',
      '保温防止低温症恶化（隔离地面、包裹）',
      '必要时进行 CPR',
      '呼叫专业救援，准备撤离方案',
    ],
  },
];

/* ──────── 团队搜救角色 ──────── */

const teamRoles = [
  {
    role: '指挥员',
    roleEn: 'Commander',
    color: '#ef4444',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2l2 4h-4l2-4z" fill="currentColor" />
      </svg>
    ),
    duties: [
      '统一协调所有搜救行动',
      '分配搜索区域和任务优先级',
      '与外部救援力量保持通信',
      '监控搜救进展并动态调整策略',
    ],
  },
  {
    role: '搜索组',
    roleEn: 'Search Team',
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 26c0-4 3-7 8-7s8 3 8 7M14 26c0-4 3-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    duties: [
      '使用信标进行系统化搜索',
      '覆盖分配区域，标记信号点',
      '精搜索后用探杆确认位置',
      '向指挥员报告发现结果',
    ],
  },
  {
    role: '挖掘组',
    roleEn: 'Dig Team',
    color: '#f59e0b',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6l6 14M14 20l10-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 18l4 10H18l4-10z" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="6" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    ),
    duties: [
      '在探杆定位处执行战略挖掘',
      '采用传送带法保持高效轮换',
      '优先暴露头部建立呼吸通道',
      '注意避免铲子伤害掩埋者',
    ],
  },
  {
    role: '安全观察员',
    roleEn: 'Safety Observer',
    color: '#22c55e',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="14" r="2.5" fill="currentColor" />
        <path d="M4 14s5-8 12-8 12 8 12 8-5 8-12 8-12-8-12-8z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    duties: [
      '持续监控上方坡面的二次雪崩风险',
      '准备哨声/无线电预警信号',
      '规划紧急撤离路线',
      '必要时果断发出撤退命令',
    ],
  },
];

/* ──────── 多人掩埋处理 ──────── */

const multiburialSteps = [
  {
    title: '标记-隔离法',
    desc: '找到第一个信号后，在信标精搜索完成时标记该位置（插入探杆或装备）。随后将信标切换为发射模式对准标记点进行"信号隔离"（部分高级信标支持），然后继续搜索下一个信号。',
  },
  {
    title: '优先级判断',
    desc: '如果资源有限，优先挖掘浅埋者——浅埋者存活概率更高且挖掘速度更快。通过探杆深度判断优先顺序。多人同时掩埋时，速度比任何单一掩埋的完美操作更重要。',
  },
  {
    title: '资源分配',
    desc: '每发现一名掩埋者，立即分配至少一人开始挖掘，其余人继续搜索。搜索与挖掘并行，不要等所有人被定位后才开始挖。',
  },
];

/* ──────── 职业搜救方式 ──────── */

const proMethods = [
  {
    name: '搜救犬',
    nameEn: 'Search Dogs',
    color: '#f59e0b',
    photoLabel: '搜救犬在雪崩堆积物上工作',
    desc: '经过训练的雪崩搜救犬通过嗅觉捕捉掩埋者散发的人体气味分子。气味会通过积雪中的微小空隙上升到雪面，搜救犬可以在广阔区域快速定位气味源。',
    specs: [
      { label: '有效搜索面积', value: '1 公顷 / 30分钟' },
      { label: '等效人力', value: '约 20 名探杆搜索者' },
      { label: '最大探测深度', value: '取决于雪质，通常 2-3m' },
    ],
    tips: [
      '搜救犬到达前，尽量减少搜救区域内人员的脚印污染',
      '停止区域内所有不必要的人员走动',
      '在下风方向等待，避免干扰气味扩散通道',
    ],
  },
  {
    name: 'RECCO 反射器',
    nameEn: 'RECCO Reflector',
    color: '#8b5cf6',
    photoLabel: 'RECCO 探测器与反射器',
    desc: 'RECCO 是一种被动式电子搜索系统。滑雪服、头盔或靴子中嵌入的微型反射器无需电池，当被探测器发射的定向雷达信号照射时，会将信号频率加倍后反射回去，探测器接收到回波即可确定方向和距离。',
    specs: [
      { label: '探测范围', value: '地面 80m / 空中 200m' },
      { label: '反射器寿命', value: '永久（无电池、无需维护）' },
      { label: '常见安装位置', value: '夹克袖口、裤腿、头盔、靴子' },
    ],
    tips: [
      'RECCO 不能替代雪崩信标——需要专业探测器',
      '检查你的雪具是否已内置 RECCO 反射器',
      '可以额外购买独立反射器安装在装备上',
    ],
  },
  {
    name: '直升机救援',
    nameEn: 'Helicopter Rescue',
    color: '#ef4444',
    photoLabel: '直升机在山区执行雪崩救援',
    desc: '直升机可快速将专业救援队和装备投送到事故现场，并承担伤员后送任务。在复杂山区地形中，直升机往往是唯一可行的快速响应手段。',
    specs: [
      { label: '着陆区要求', value: '30×30m 平坦区域，标记风向' },
      { label: '吊运能力', value: '单次吊运 1-2 人（含担架）' },
      { label: '天气限制', value: '能见度 > 1.5km，风速 < 40km/h' },
    ],
    tips: [
      '用彩色装备或树枝在雪面标记 H 形着陆区',
      '所有人员撤离着陆区并固定松散物品',
      '面向直升机站立，双臂举起呈 Y 形表示需要救援',
      '单臂斜举表示不需要帮助',
    ],
  },
];

/* ──────── 自救技巧 ──────── */

const selfRescueTips = [
  {
    phase: '被卷入时',
    phaseEn: 'During the Avalanche',
    tips: [
      { title: '丢弃装备', desc: '立即丢弃雪杖，解开滑雪板固定器（如果可能）。这些装备会成为锚点将你拖入更深处。' },
      { title: '游泳动作', desc: '用力做大幅度的游泳动作，尽量保持在雪流表面。翻滚时尝试面朝上。' },
      { title: '保护气道', desc: '用手臂或衣物遮住口鼻，防止雪进入呼吸道。' },
    ],
  },
  {
    phase: '雪崩停止时',
    phaseEn: 'As It Stops',
    tips: [
      { title: '制造气腔', desc: '在雪停止前的最后一刻，用手在面部前方用力推开雪，创造尽可能大的呼吸空间。这是最关键的自救动作。' },
      { title: '扩展空间', desc: '在雪尚未完全压实前，尽力扩大胸部空间以便呼吸。雪崩堆积物会在数秒内凝固如混凝土。' },
      { title: '判断方向', desc: '如果不确定上下方向，让口水流出——重力会告诉你哪边是下方。' },
    ],
  },
  {
    phase: '被掩埋后',
    phaseEn: 'While Buried',
    tips: [
      { title: '保持冷静', desc: '恐慌会加速呼吸消耗有限的氧气。控制呼吸节奏，相信同伴正在搜救。' },
      { title: '节省体力', desc: '除非确定自己在浅层且可以自行挖出，否则不要无谓挣扎。深埋时运动只会消耗更多氧气。' },
      { title: '呼救时机', desc: '听到上方有人声时再大声呼救。雪对声音有隔绝作用，掩埋者能听到外面的声音，但外面很难听到掩埋者。' },
    ],
  },
];

export function RescuePage() {
  return (
    <div className="taiga-page">
      <main className="taiga-main">
        {/* Header */}
        <div className="rescue-header">
          <Link to="/safety" className="rescue-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="rescue-title">救援与自救</h1>
          <p className="rescue-subtitle">
            掌握伙伴救援流程和自救技巧是野外雪崩安全的最后防线。信标、探杆、铲子三件套的熟练使用可以在关键的15分钟内挽救生命。
          </p>
        </div>

        {/* ── 存活率时间线 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>掩埋存活率时间线</h2>
            <span className="rescue-section-en">Burial Survival Timeline</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              雪崩掩埋后存活率随时间急剧下降。专业救援队平均响应时间超过45分钟，因此<strong>伙伴救援是唯一能在黄金窗口内实施的有效手段</strong>。
            </p>
            <div className="rescue-timeline">
              {survivalTimeline.map((t) => (
                <div key={t.minutes} className="rescue-timeline-item" style={{ '--timeline-color': t.color } as React.CSSProperties}>
                  <div className="rescue-timeline-bar">
                    <div className="rescue-timeline-dot" style={{ backgroundColor: t.color }}></div>
                    <div className="rescue-timeline-line"></div>
                  </div>
                  <div className="rescue-timeline-content">
                    <div className="rescue-timeline-top">
                      <span className="rescue-timeline-minutes">{t.minutes} 分钟</span>
                      <span className="rescue-timeline-rate" style={{ color: t.color }}>{t.rate} 存活率</span>
                    </div>
                    <h4 className="rescue-timeline-label">{t.label}</h4>
                    <p>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 三件套 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>雪崩救援三件套</h2>
            <span className="rescue-section-en">Essential Rescue Equipment</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              信标、探杆和铲子是野外雪崩救援的基本装备，缺一不可。任何进入雪崩地形的人员都必须携带并熟练使用这三件装备。
            </p>
            <div className="rescue-equip-cards">
              {equipment.map((e) => (
                <div key={e.nameEn} className="rescue-equip-card" style={{ '--equip-color': e.color } as React.CSSProperties}>
                  <div className="rescue-equip-header">
                    <span className="rescue-equip-icon">{e.icon}</span>
                    <div>
                      <h3>{e.name}</h3>
                      <span>{e.nameEn}</span>
                    </div>
                  </div>
                  <div className="rescue-equip-grid">
                    <div className="rescue-equip-item">
                      <h4>工作原理</h4>
                      <p>{e.what}</p>
                    </div>
                    <div className="rescue-equip-item">
                      <h4>使用方法</h4>
                      <p>{e.how}</p>
                    </div>
                  </div>
                  <div className="rescue-equip-tips">
                    <h4>关键要点</h4>
                    <ul>
                      {e.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 救援流程 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>伙伴救援流程</h2>
            <span className="rescue-section-en">Companion Rescue Procedure</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              以下六个步骤构成完整的伙伴救援流程。每个步骤都至关重要，定期演练才能在真实事故中快速执行。
            </p>
            <div className="rescue-steps">
              {rescueSteps.map((s) => (
                <div key={s.step} className="rescue-step-card" style={{ '--step-color': s.color } as React.CSSProperties}>
                  <div className="rescue-step-number" style={{ backgroundColor: s.color }}>
                    {s.step}
                  </div>
                  <div className="rescue-step-content">
                    <div className="rescue-step-titles">
                      <h3>{s.title}</h3>
                      <span>{s.subtitle}</span>
                    </div>
                    <ul>
                      {s.actions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 自救技巧 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>自救技巧</h2>
            <span className="rescue-section-en">Self-Rescue Techniques</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              如果你自己被雪崩卷入，以下技巧可能帮助你提高存活概率。最关键的动作是在雪停止瞬间制造面部呼吸空间。
            </p>
            <div className="rescue-selfrescue-phases">
              {selfRescueTips.map((phase) => (
                <div key={phase.phaseEn} className="rescue-phase-card">
                  <div className="rescue-phase-header">
                    <h3>{phase.phase}</h3>
                    <span>{phase.phaseEn}</span>
                  </div>
                  <div className="rescue-phase-tips">
                    {phase.tips.map((t, i) => (
                      <div key={i} className="rescue-phase-tip">
                        <h4>{t.title}</h4>
                        <p>{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 团队搜救策略 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>团队搜救策略</h2>
            <span className="rescue-section-en">Team Rescue Tactics</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              当多人参与搜救时，明确的角色分工和协同策略能显著提高效率。团队搜救的核心是<strong>指挥统一、搜挖并行、安全优先</strong>。
            </p>

            {/* 角色卡片 */}
            <div className="team-roles-grid">
              {teamRoles.map((r) => (
                <div key={r.roleEn} className="team-role-card" style={{ '--role-color': r.color } as React.CSSProperties}>
                  <div className="team-role-icon" style={{ color: r.color }}>{r.icon}</div>
                  <div className="team-role-name">
                    <h4>{r.role}</h4>
                    <span>{r.roleEn}</span>
                  </div>
                  <ul className="team-role-duties">
                    {r.duties.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {/* 搜索阵型 SVG */}
            <div className="rescue-diagram-block">
              <h3 className="rescue-diagram-title">线式搜索阵型 <span>Line Search Formation</span></h3>
              <p className="rescue-diagram-desc">搜索队员保持等距排列，沿下坡方向系统推进。间距取决于搜索模式：信号搜索时 20-40m，精搜索时缩小至 5-10m。</p>
              <div className="rescue-svg-container">
                <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="rescue-formation-svg">
                  {/* 搜索区域 */}
                  <defs>
                    <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
                    </linearGradient>
                    <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M1 1L4 6L7 1" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                    </marker>
                  </defs>
                  <rect x="40" y="20" width="520" height="260" rx="12" fill="url(#snowGrad)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="6 4" />
                  <text x="300" y="14" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="600">▲ 上坡方向 UPHILL</text>
                  <text x="300" y="300" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="600">▼ 下坡方向 DOWNHILL</text>

                  {/* 搜索队员 - 第一排 */}
                  {[100, 200, 300, 400, 500].map((cx, i) => (
                    <g key={`row1-${i}`}>
                      <circle cx={cx} cy={80} r="14" fill="var(--accent)" opacity="0.9" />
                      <text x={cx} y={85} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{i + 1}</text>
                      {/* 移动方向箭头 */}
                      <line x1={cx} y1={100} x2={cx} y2={140} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowDown)" />
                    </g>
                  ))}

                  {/* 搜索队员 - 第二排（前进后位置） */}
                  {[100, 200, 300, 400, 500].map((cx, i) => (
                    <g key={`row2-${i}`}>
                      <circle cx={cx} cy={180} r="14" fill="var(--accent)" opacity="0.35" strokeDasharray="4 2" stroke="var(--accent)" strokeWidth="1" />
                      <text x={cx} y={185} textAnchor="middle" fill="var(--accent)" fontSize="11" fontWeight="700">{i + 1}</text>
                    </g>
                  ))}

                  {/* 间距标注 */}
                  <line x1="100" y1="60" x2="200" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
                  <line x1="100" y1="56" x2="100" y2="64" stroke="var(--text-muted)" strokeWidth="1" />
                  <line x1="200" y1="56" x2="200" y2="64" stroke="var(--text-muted)" strokeWidth="1" />
                  <text x="150" y="54" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="600">20-40m</text>

                  {/* 图例 */}
                  <circle cx="60" cy="325" r="8" fill="var(--accent)" opacity="0.9" />
                  <text x="75" y="329" fill="var(--text-muted)" fontSize="10">当前位置</text>
                  <circle cx="170" cy="325" r="8" fill="var(--accent)" opacity="0.35" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 2" />
                  <text x="185" y="329" fill="var(--text-muted)" fontSize="10">推进后位置</text>
                  <line x1="290" y1="325" x2="320" y2="325" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowDown)" />
                  <text x="330" y="329" fill="var(--text-muted)" fontSize="10">推进方向</text>
                </svg>
              </div>
            </div>

            {/* 传送带挖掘法 SVG */}
            <div className="rescue-diagram-block">
              <h3 className="rescue-diagram-title">传送带挖掘法 <span>Conveyor Belt Shoveling</span></h3>
              <p className="rescue-diagram-desc">多人沿下坡方向排列。前排挖掘松动雪块，后排将雪铲向更远处。每2-3分钟前排后撤休息，后排前移接力，保持持续高效挖掘。</p>
              <div className="rescue-svg-container">
                <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" className="rescue-formation-svg">
                  <defs>
                    <linearGradient id="snowLayer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                  </defs>

                  {/* 雪面 */}
                  <path d="M0 180 Q100 170 200 175 Q300 180 400 176 Q500 172 600 178 L600 300 L0 300 Z" fill="url(#snowLayer)" opacity="0.5" />

                  {/* 掩埋者 */}
                  <ellipse cx="160" cy="220" rx="20" ry="12" fill="#ef4444" opacity="0.5" />
                  <text x="160" y="224" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">掩埋</text>
                  {/* 探杆 */}
                  <line x1="160" y1="145" x2="160" y2="220" stroke="#8b5cf6" strokeWidth="2" />
                  <circle cx="160" cy="142" r="3" fill="#8b5cf6" />

                  {/* V形挖掘通道 */}
                  <path d="M140 178 L200 175 L360 160 L380 175 L360 190 L200 185 Z" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" />

                  {/* 挖掘者 - 前排 */}
                  <g>
                    <circle cx="220" cy="148" r="14" fill="#f59e0b" />
                    <text x="220" y="153" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">挖</text>
                    {/* 铲子动作线 */}
                    <path d="M210 160 L195 175" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <g>
                    <circle cx="240" cy="128" r="14" fill="#f59e0b" />
                    <text x="240" y="133" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">挖</text>
                    <path d="M230 140 L215 155" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* 传送者 - 中排 */}
                  <g>
                    <circle cx="310" cy="138" r="14" fill="var(--accent)" />
                    <text x="310" y="143" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">铲</text>
                  </g>

                  {/* 传送者 - 后排 */}
                  <g>
                    <circle cx="390" cy="128" r="14" fill="var(--accent)" opacity="0.7" />
                    <text x="390" y="133" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">铲</text>
                  </g>

                  {/* 休息/轮换者 */}
                  <g>
                    <circle cx="480" cy="138" r="14" fill="#22c55e" opacity="0.7" />
                    <text x="480" y="143" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">休</text>
                  </g>

                  {/* 雪的流向箭头 */}
                  <path d="M250 170 C280 165 320 162 350 158" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrowDown)" />
                  <text x="300" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="10">雪块传送方向 →</text>

                  {/* 轮换箭头 */}
                  <path d="M480 160 C460 185 380 190 310 168" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="4 3" />
                  <text x="400" y="195" textAnchor="middle" fill="#22c55e" fontSize="10">2-3min 轮换</text>

                  {/* 图例 */}
                  <circle cx="60" cy="280" r="8" fill="#f59e0b" />
                  <text x="75" y="284" fill="var(--text-muted)" fontSize="10">前排挖掘</text>
                  <circle cx="170" cy="280" r="8" fill="var(--accent)" />
                  <text x="185" y="284" fill="var(--text-muted)" fontSize="10">中后排传送</text>
                  <circle cx="290" cy="280" r="8" fill="#22c55e" opacity="0.7" />
                  <text x="305" y="284" fill="var(--text-muted)" fontSize="10">休息/待轮换</text>
                  <circle cx="420" cy="280" r="5" fill="#8b5cf6" />
                  <text x="432" y="284" fill="var(--text-muted)" fontSize="10">探杆标记</text>
                </svg>
              </div>
            </div>

            {/* 多人掩埋处理 */}
            <div className="rescue-multiburial">
              <h3 className="rescue-diagram-title">多人掩埋处理 <span>Multiple Burial Management</span></h3>
              <div className="multiburial-cards">
                {multiburialSteps.map((s, i) => (
                  <div key={i} className="multiburial-card">
                    <div className="multiburial-number">{i + 1}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 职业搜救 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>职业搜救</h2>
            <span className="rescue-section-en">Organized / Professional Rescue</span>
          </div>
          <div className="rescue-section-body">
            <p className="rescue-intro">
              当伙伴救援无法在短时间内完成，或掩埋者未携带信标时，职业搜救力量和技术手段将发挥关键作用。了解这些资源有助于更好地配合专业团队。
            </p>

            {/* 职业搜救方式卡片 */}
            <div className="pro-methods">
              {proMethods.map((m) => (
                <div key={m.nameEn} className="pro-method-card" style={{ '--method-color': m.color } as React.CSSProperties}>
                  <div className="pro-method-head">
                    <h3>{m.name}</h3>
                    <span>{m.nameEn}</span>
                  </div>
                  <div className="pro-method-content">
                    {/* 照片占位 */}
                    <div className="photo-placeholder" style={{ '--ph-color': m.color } as React.CSSProperties}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="photo-placeholder-icon">
                        <rect x="2" y="3" width="20" height="18" rx="3" />
                        <circle cx="8.5" cy="10" r="2.5" />
                        <path d="M22 16l-5.5-5.5L8 19" />
                      </svg>
                      <span className="photo-placeholder-label">{m.photoLabel}</span>
                      <span className="photo-placeholder-hint">待添加照片</span>
                    </div>
                    <p className="pro-method-desc">{m.desc}</p>
                    <div className="pro-method-specs">
                      {m.specs.map((s, i) => (
                        <div key={i} className="pro-spec-row">
                          <span className="pro-spec-label">{s.label}</span>
                          <span className="pro-spec-value">{s.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pro-method-tips">
                      <h4>配合要点</h4>
                      <ul>
                        {m.tips.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 探杆线搜索阵型 SVG */}
            <div className="rescue-diagram-block">
              <h3 className="rescue-diagram-title">探杆线搜索 <span>Probe Line Search</span></h3>
              <p className="rescue-diagram-desc">
                当掩埋者无信标时，组织多人并排成线使用探杆系统搜索。每人间距约70cm（肩宽），每次前移一步（约30cm），探杆垂直插入。这是最后手段，但在没有电子设备时是最可靠的方法。
              </p>
              <div className="rescue-svg-container">
                <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" className="rescue-formation-svg">
                  <defs>
                    <linearGradient id="probeSnow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* 搜索区域 */}
                  <rect x="30" y="40" width="540" height="200" rx="8" fill="url(#probeSnow)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="6 4" />
                  <text x="300" y="34" textAnchor="middle" fill="var(--text-tertiary)" fontSize="11" fontWeight="600">▲ 上坡 UPHILL</text>

                  {/* 搜索线 - 20人 */}
                  {Array.from({ length: 20 }, (_, i) => {
                    const cx = 55 + i * 26;
                    return (
                      <g key={`prober-${i}`}>
                        <circle cx={cx} cy={100} r="9" fill="#8b5cf6" opacity="0.85" />
                        {/* 探杆线 */}
                        <line x1={cx} y1={112} x2={cx} y2={155} stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
                        <circle cx={cx} cy={157} r="2" fill="#8b5cf6" opacity="0.4" />
                      </g>
                    );
                  })}

                  {/* 已探测区域 */}
                  <rect x="30" y="170" width="540" height="70" rx="4" fill="#8b5cf6" opacity="0.06" />
                  <text x="300" y="210" textAnchor="middle" fill="#8b5cf6" fontSize="11" opacity="0.6" fontWeight="600">已探测区域</text>

                  {/* 间距标注 */}
                  <line x1="55" y1="80" x2="81" y2="80" stroke="var(--text-muted)" strokeWidth="1" />
                  <line x1="55" y1="76" x2="55" y2="84" stroke="var(--text-muted)" strokeWidth="1" />
                  <line x1="81" y1="76" x2="81" y2="84" stroke="var(--text-muted)" strokeWidth="1" />
                  <text x="68" y="74" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600">70cm</text>

                  {/* 前进距离标注 */}
                  <text x="575" y="135" fill="var(--text-muted)" fontSize="9" fontWeight="600" textAnchor="start" transform="rotate(90 575 135)">步进 30cm</text>

                  {/* 指挥员 */}
                  <circle cx="300" cy="275" r="12" fill="#ef4444" opacity="0.9" />
                  <text x="300" y="279" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">指挥</text>
                  <text x="340" y="279" fill="var(--text-muted)" fontSize="10">指挥员：喊口令统一步进节奏</text>

                  {/* 图例 */}
                  <circle cx="60" cy="275" r="6" fill="#8b5cf6" opacity="0.85" />
                  <text x="72" y="279" fill="var(--text-muted)" fontSize="10">探杆搜索者</text>
                </svg>
              </div>
            </div>

            {/* 场景照片占位 */}
            <div className="rescue-diagram-block">
              <h3 className="rescue-diagram-title">救援场景 <span>Rescue Scenes</span></h3>
              <div className="scene-photos-grid">
                {[
                  { label: '搜救犬在雪崩堆积区工作', icon: '🐕' },
                  { label: 'RECCO 探测器实地使用', icon: '📡' },
                  { label: '直升机山区救援现场', icon: '🚁' },
                  { label: '团队搜救协同行动', icon: '👥' },
                ].map((p, i) => (
                  <div key={i} className="scene-photo-placeholder">
                    <span className="scene-photo-icon">{p.icon}</span>
                    <span className="scene-photo-label">{p.label}</span>
                    <span className="scene-photo-hint">待添加照片</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 练习建议 ── */}
        <section className="rescue-section">
          <div className="rescue-section-header">
            <h2>练习建议</h2>
            <span className="rescue-section-en">Practice Recommendations</span>
          </div>
          <div className="rescue-section-body">
            <div className="rescue-practice-grid">
              <div className="rescue-practice-card">
                <h4>信标练习</h4>
                <p>每月至少进行一次信标搜索练习。将信标埋在安全区域的雪下，练习完整的信号搜索→粗搜索→精搜索流程。目标：3分钟内完成单人搜索。</p>
              </div>
              <div className="rescue-practice-card">
                <h4>探杆练习</h4>
                <p>练习快速组装（10秒内）和正确的探测手法。使用背包模拟掩埋物，感受探杆接触不同物体的手感差异。</p>
              </div>
              <div className="rescue-practice-card">
                <h4>挖掘练习</h4>
                <p>模拟 1m 深度掩埋的挖掘。练习传送带法和 V 形策略。了解挖掘 1 立方米雪需要的时间和体力消耗。</p>
              </div>
              <div className="rescue-practice-card">
                <h4>全流程演练</h4>
                <p>每个雪季至少进行一次完整的伙伴救援演练（信标→探杆→挖掘→急救）。记录完成时间并逐步缩短。目标：单人掩埋从开始到暴露头部在 5 分钟内。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
