import { Link } from 'react-router-dom';
import './CrystalTypesPage.css';

/* ──────── 晶体类型数据 ──────── */

interface Crystal {
  code: string;
  name: string;
  nameEn: string;
  symbol: string;
  color: string;
  shape: string;
  formation: string;
  strength: string;
  strengthLevel: 'strong' | 'moderate' | 'weak' | 'variable';
  significance: string;
}

const crystals: Crystal[] = [
  {
    code: 'PP',
    name: '新雪',
    nameEn: 'Precipitation Particles',
    symbol: '✻',
    color: '#60a5fa',
    shape: '星形枝状、板状、柱状、针状等多种形态，取决于形成时的温度和湿度条件。',
    formation: '直接由大气中的水汽凝华形成，从云层降落到地面。晶体形态受气温影响显著：-15°C 附近形成经典的六角星形枝晶，-5°C 附近形成针状晶体。',
    strength: '初始结合力弱，晶体间仅有点接触。但随着沉降和圆化过程推进，结合力迅速增强。',
    strengthLevel: 'weak',
    significance: '大量新雪快速堆积可形成暴风雪板（Storm Slab）。新雪是所有雪层变质过程的起点。',
  },
  {
    code: 'DF',
    name: '分解粒雪',
    nameEn: 'Decomposing Fragments',
    symbol: '⬡',
    color: '#818cf8',
    shape: '新雪晶体的碎片和部分分解形态。原始的枝状结构被破坏，但尚未完全圆化。',
    formation: '新雪在风力作用、自身重力和温度变化下开始分解。枝状末端断裂，晶体逐渐碎裂为不规则颗粒。这是新雪变质的第一阶段。',
    strength: '比新雪稍强，碎片之间开始建立更多接触点。沉降使颗粒间的空隙减小，密度增加。',
    strengthLevel: 'moderate',
    significance: '过渡状态，持续时间取决于温度。在接近 0°C 时分解很快（数小时），在极低温下可能持续数天。',
  },
  {
    code: 'RG',
    name: '圆粒雪',
    nameEn: 'Rounded Grains',
    symbol: '●',
    color: '#34d399',
    shape: '均匀的小圆颗粒，直径通常 0.25-1.5mm。表面光滑，形状接近球形。',
    formation: '在等温条件下（温度梯度 < 5°C/m），通过表面能最小化原理，晶体逐渐圆化。大曲率区域（尖角）的分子迁移到小曲率区域（凹处），形成球形。同时颗粒间通过烧结形成冰桥。',
    strength: '结合力强，是最稳定的雪层组成。圆化颗粒间的烧结冰桥提供良好的结构强度。',
    strengthLevel: 'strong',
    significance: '圆粒雪层是雪层中的"好邻居"——稳定、密实、承载能力强。等温变质的理想终态。',
  },
  {
    code: 'FC',
    name: '刻面晶',
    nameEn: 'Faceted Crystals',
    symbol: '◆',
    color: '#fb923c',
    shape: '棱角分明的多面体颗粒，表面平坦有明显的刻面，形状类似立方体或条纹状。直径 1-5mm。',
    formation: '在中等温度梯度（10-20°C/m）下形成。水汽沿温度梯度方向从暖处向冷处迁移，在晶体表面凝华生长。晶体发育出平坦的刻面和锐利的棱角。可由圆粒雪（RG）在温度梯度增强时逆向发育而来。',
    strength: '结合力弱。棱角形状使颗粒间接触面积小，难以形成有效的冰桥。刻面晶层是常见的弱层。',
    strengthLevel: 'weak',
    significance: '刻面晶是雪崩安全的重大隐患。它可以形成持续弱层，被上方雪板覆盖后长期存在，是持续板（Persistent Slab）雪崩的关键因素。',
  },
  {
    code: 'DH',
    name: '深霜',
    nameEn: 'Depth Hoar',
    symbol: '⬦',
    color: '#f87171',
    shape: '大型杯状或阶梯状晶体，空心棱柱形，直径可达 5-20mm。结构中空，类似酒杯或阶梯。',
    formation: '在强温度梯度（> 20°C/m）下形成，通常出现在薄雪层下方靠近地面处。地面温度接近 0°C 而表面温度很低时，强烈的水汽迁移驱动晶体快速生长为大型杯状结构。',
    strength: '极弱。大型空心晶体之间几乎没有结合力，形成类似"干沙"的松散层。一旦形成很难被消除。',
    strengthLevel: 'weak',
    significance: '雪层中最危险的弱层类型之一。深霜层可以持续整个雪季，只有被春季融水彻底湿润后才可能被消除。是深层持续板雪崩的主要成因。',
  },
  {
    code: 'SH',
    name: '表面霜',
    nameEn: 'Surface Hoar',
    symbol: '❋',
    color: '#e879f9',
    shape: '在雪面生长的薄片状或羽毛状晶体，高度可达数厘米。外观如同微型蕨类植物叶片。',
    formation: '在晴朗无风的夜晚，雪面通过长波辐射迅速冷却。空气中的水汽在冰冷的雪面上直接凝华，形成精美的片状晶体。类似于窗户上结霜的过程。',
    strength: '暴露时极为脆弱。一旦被新雪覆盖掩埋，会形成极为光滑的薄弱界面，上方雪板极易沿此面滑动。',
    strengthLevel: 'weak',
    significance: '被掩埋的表面霜是最危险的弱层之一。因为非常薄（仅几毫米），在雪层剖面中容易被忽视，但其对雪板稳定性的破坏力极强。',
  },
  {
    code: 'MF',
    name: '融冻粒雪',
    nameEn: 'Melt Forms',
    symbol: '◉',
    color: '#38bdf8',
    shape: '大型圆形颗粒团簇，直径 1-5mm。多个颗粒通过冰桥结合成葡萄状集合体。表面光滑湿润。',
    formation: '当液态水进入雪层（日照融化或降雨），颗粒表面开始融化。重新冻结时，颗粒间形成粗大的冰桥。反复冻融循环使颗粒不断合并增大。',
    strength: '冻结状态下非常坚固（如同冰）；含水状态下迅速弱化。强度随日间温度循环剧烈变化。',
    strengthLevel: 'variable',
    significance: '冻融循环是春季雪崩安全评估的核心。清晨冻结的粒雪面稳定坚固，但随日间升温融化后可能触发湿雪雪崩。',
  },
  {
    code: 'IF',
    name: '冰层',
    nameEn: 'Ice Formations',
    symbol: '▬',
    color: '#94a3b8',
    shape: '连续的冰壳或冰层，厚度从薄膜到数厘米不等。表面坚硬光滑。',
    formation: '降雨落在雪面后冻结（雨凇层）、雪面融化后重新冻结（融冻壳）、或风力压实雪面形成（风壳）。不同成因的冰层厚度和特性各异。',
    strength: '冰层本身极为坚固。但作为光滑界面，上方雪板可能沿冰层表面滑动，尤其当冰层上方有刻面晶发育时。',
    strengthLevel: 'variable',
    significance: '冰层阻止水汽穿透，在其上方和下方容易形成刻面晶弱层。同时作为不透水层，会阻止融水向下渗透，积聚液态水导致湿雪不稳定。',
  },
];

/* ──────── 变质过程数据 ──────── */

interface MetaProcess {
  name: string;
  nameEn: string;
  color: string;
  condition: string;
  mechanism: string;
  path: string;
  duration: string;
  safetyNote: string;
}

const processes: MetaProcess[] = [
  {
    name: '等温变质',
    nameEn: 'Equi-Temperature Metamorphism',
    color: '#34d399',
    condition: '温度梯度 < 5°C/m，雪层温度均匀',
    mechanism: '由表面能驱动。水汽从曲率大的尖角迁移到曲率小的凹处，晶体逐渐圆化。同时颗粒接触点通过烧结生长冰桥，增强结构强度。',
    path: 'PP → DF → RG（新雪 → 分解粒雪 → 圆粒雪）',
    duration: '数天至数周，温度越接近 0°C 越快',
    safetyNote: '这是"好"的变质方向——雪层越来越稳定。深厚均匀的雪层有利于等温变质的发生。',
  },
  {
    name: '温度梯度变质',
    nameEn: 'Temperature Gradient Metamorphism',
    color: '#f87171',
    condition: '温度梯度 > 10°C/m，通常在薄雪层、晴冷天气条件下',
    mechanism: '强温度梯度驱动水汽从暖处向冷处大量迁移。在冷侧晶体表面快速凝华生长，形成棱角分明的刻面结构。梯度越强，晶体发育越快越大。',
    path: 'PP/DF/RG → FC → DH（任何类型 → 刻面晶 → 深霜）',
    duration: '数天至数周。强梯度下可在 2-3 天内形成明显的刻面层',
    safetyNote: '这是"坏"的变质方向——雪层越来越弱。圆粒雪也可能在温度梯度增强时被"逆转"回刻面晶，所以持续关注雪层温度梯度变化非常重要。',
  },
  {
    name: '融冻变质',
    nameEn: 'Melt-Freeze Metamorphism',
    color: '#38bdf8',
    condition: '雪层温度达到 0°C，液态水存在（日照融化或降雨）',
    mechanism: '液态水在颗粒间迁移，小颗粒优先融化，大颗粒通过水膜生长。重新冻结时颗粒间形成粗大冰桥。反复冻融使颗粒不断合并增大。',
    path: '任何类型 → MF（融冻粒雪），可能产生 IF（冰层）',
    duration: '随昼夜冻融循环进行，每个周期数小时',
    safetyNote: '双刃剑——冻结状态极为稳固，融化状态极为危险。春季安全窗口取决于冻融循环的可预测性。持续温暖（不重新冻结）是最危险的情况。',
  },
];

/* ──────── 变质路径图中的节点 ──────── */

interface FlowNode {
  code: string;
  label: string;
  color: string;
  x: number;
  y: number;
}

interface FlowArrow {
  from: string;
  to: string;
  label: string;
  color: string;
  type: 'good' | 'bad' | 'neutral';
}

const flowNodes: FlowNode[] = [
  { code: 'PP', label: '新雪', color: '#60a5fa', x: 50, y: 50 },
  { code: 'DF', label: '分解粒雪', color: '#818cf8', x: 200, y: 50 },
  { code: 'RG', label: '圆粒雪', color: '#34d399', x: 380, y: 50 },
  { code: 'FC', label: '刻面晶', color: '#fb923c', x: 380, y: 170 },
  { code: 'DH', label: '深霜', color: '#f87171', x: 550, y: 170 },
  { code: 'SH', label: '表面霜', color: '#e879f9', x: 50, y: 170 },
  { code: 'MF', label: '融冻粒雪', color: '#38bdf8', x: 200, y: 170 },
  { code: 'IF', label: '冰层', color: '#94a3b8', x: 550, y: 50 },
];

const flowArrows: FlowArrow[] = [
  { from: 'PP', to: 'DF', label: '风力/重力分解', color: '#818cf8', type: 'good' },
  { from: 'DF', to: 'RG', label: '等温变质', color: '#34d399', type: 'good' },
  { from: 'RG', to: 'FC', label: '温度梯度↑', color: '#fb923c', type: 'bad' },
  { from: 'FC', to: 'DH', label: '强梯度持续', color: '#f87171', type: 'bad' },
  { from: 'RG', to: 'MF', label: '融化', color: '#38bdf8', type: 'neutral' },
  { from: 'MF', to: 'IF', label: '冻结', color: '#94a3b8', type: 'neutral' },
];

export function CrystalTypesPage() {
  return (
    <div className="taiga-page">
      <main className="taiga-main">
        {/* Header */}
        <div className="crystal-header">
          <Link to="/safety" className="crystal-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="crystal-title">雪晶类型与变质过程</h1>
          <p className="crystal-subtitle">
            了解积雪中的晶体分类（基于ICSSG国际季节性积雪分类标准）以及不同变质过程如何改变雪层结构和稳定性。
          </p>
        </div>

        {/* ── 变质路径图 ── */}
        <section className="crystal-section">
          <div className="crystal-section-header">
            <h2>晶体演变路径图</h2>
            <span className="crystal-section-en">Metamorphism Flow Chart</span>
          </div>
          <div className="crystal-section-body">
            <p className="crystal-intro">
              雪晶从降落到地面那一刻起便开始不断变化。演变方向取决于温度梯度：等温条件下趋向稳定，温度梯度增大则趋向不稳定。
            </p>

            {/* SVG 流程图 */}
            <div className="crystal-flow-container">
              <svg viewBox="0 0 660 240" className="crystal-flow-svg">
                <defs>
                  <marker id="arrow-good" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#34d399" />
                  </marker>
                  <marker id="arrow-bad" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f87171" />
                  </marker>
                  <marker id="arrow-neutral" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Arrows */}
                {flowArrows.map((a, i) => {
                  const from = flowNodes.find(n => n.code === a.from)!;
                  const to = flowNodes.find(n => n.code === a.to)!;
                  const fx = from.x + 35;
                  const fy = from.y + 20;
                  const tx = to.x + 35;
                  const ty = to.y + 20;
                  // For vertical arrows, use a curve
                  const isVertical = Math.abs(fx - tx) < 40;
                  const d = isVertical
                    ? `M${fx},${fy + 20} C${fx},${(fy + ty) / 2} ${tx},${(fy + ty) / 2} ${tx},${ty - 20}`
                    : fy === ty
                      ? `M${fx + 30},${fy} L${tx - 30},${ty}`
                      : `M${fx + 20},${fy + 15} C${fx + 40},${ty} ${tx - 40},${fy} ${tx - 20},${ty - 5}`;
                  const markerId = `arrow-${a.type}`;
                  const midX = (fx + tx) / 2;
                  const midY = (fy + ty) / 2 + (isVertical ? 0 : fy === ty ? -12 : -8);
                  return (
                    <g key={i}>
                      <path d={d} fill="none" stroke={a.color} strokeWidth="2" markerEnd={`url(#${markerId})`} opacity="0.7" />
                      <text x={midX} y={midY} textAnchor="middle" fontSize="9" fill={a.color} fontWeight="600">{a.label}</text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {flowNodes.map((n) => (
                  <g key={n.code}>
                    <rect x={n.x} y={n.y} width="70" height="40" rx="10" fill={n.color} opacity="0.15" stroke={n.color} strokeWidth="1.5" />
                    <text x={n.x + 35} y={n.y + 17} textAnchor="middle" fontSize="11" fontWeight="800" fill={n.color}>{n.code}</text>
                    <text x={n.x + 35} y={n.y + 31} textAnchor="middle" fontSize="9" fontWeight="600" fill={n.color}>{n.label}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="crystal-flow-legend">
              <div className="crystal-flow-legend-item">
                <span className="crystal-legend-line crystal-legend-good"></span>
                <span>等温变质（趋向稳定）</span>
              </div>
              <div className="crystal-flow-legend-item">
                <span className="crystal-legend-line crystal-legend-bad"></span>
                <span>梯度变质（趋向不稳定）</span>
              </div>
              <div className="crystal-flow-legend-item">
                <span className="crystal-legend-line crystal-legend-neutral"></span>
                <span>融冻变质</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 晶体类型卡片 ── */}
        <section className="crystal-section">
          <div className="crystal-section-header">
            <h2>晶体类型详解</h2>
            <span className="crystal-section-en">Snow Grain Classification</span>
          </div>
          <div className="crystal-section-body">
            <div className="crystal-cards">
              {crystals.map((c) => (
                <div key={c.code} className="crystal-card" style={{ '--crystal-color': c.color } as React.CSSProperties}>
                  <div className="crystal-card-header">
                    <div className="crystal-card-symbol" style={{ backgroundColor: c.color }}>
                      <span>{c.symbol}</span>
                    </div>
                    <div className="crystal-card-names">
                      <h3>
                        <span className="crystal-card-code">{c.code}</span>
                        {c.name}
                      </h3>
                      <span>{c.nameEn}</span>
                    </div>
                    <span className={`crystal-strength-tag crystal-strength-${c.strengthLevel}`}>
                      {c.strengthLevel === 'strong' && '强结合'}
                      {c.strengthLevel === 'moderate' && '中等结合'}
                      {c.strengthLevel === 'weak' && '弱结合'}
                      {c.strengthLevel === 'variable' && '可变强度'}
                    </span>
                  </div>

                  <div className="crystal-card-grid">
                    <div className="crystal-card-item">
                      <h4>形态特征</h4>
                      <p>{c.shape}</p>
                    </div>
                    <div className="crystal-card-item">
                      <h4>形成条件</h4>
                      <p>{c.formation}</p>
                    </div>
                    <div className="crystal-card-item">
                      <h4>结合强度</h4>
                      <p>{c.strength}</p>
                    </div>
                    <div className="crystal-card-item">
                      <h4>雪崩安全意义</h4>
                      <p>{c.significance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 变质过程详解 ── */}
        <section className="crystal-section">
          <div className="crystal-section-header">
            <h2>变质过程详解</h2>
            <span className="crystal-section-en">Metamorphism Processes</span>
          </div>
          <div className="crystal-section-body">
            <p className="crystal-intro">
              积雪一旦落地便开始持续变质。三种主要变质过程决定了雪层向稳定还是不稳定方向演变。
            </p>
            <div className="crystal-process-cards">
              {processes.map((p) => (
                <div key={p.nameEn} className="crystal-process-card" style={{ '--process-color': p.color } as React.CSSProperties}>
                  <div className="crystal-process-header">
                    <div className="crystal-process-dot" style={{ backgroundColor: p.color }}></div>
                    <div>
                      <h3>{p.name}</h3>
                      <span>{p.nameEn}</span>
                    </div>
                  </div>
                  <div className="crystal-process-grid">
                    <div className="crystal-process-item">
                      <h4>发生条件</h4>
                      <p>{p.condition}</p>
                    </div>
                    <div className="crystal-process-item">
                      <h4>物理机制</h4>
                      <p>{p.mechanism}</p>
                    </div>
                    <div className="crystal-process-item">
                      <h4>演变路径</h4>
                      <p className="crystal-process-path">{p.path}</p>
                    </div>
                    <div className="crystal-process-item">
                      <h4>持续时间</h4>
                      <p>{p.duration}</p>
                    </div>
                  </div>
                  <div className="crystal-process-safety">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M12 9v2m0 4h.01M5.07 19H18.93a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z" />
                    </svg>
                    <p>{p.safetyNote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 实用判断指南 ── */}
        <section className="crystal-section">
          <div className="crystal-section-header">
            <h2>野外识别要点</h2>
            <span className="crystal-section-en">Field Identification Tips</span>
          </div>
          <div className="crystal-section-body">
            <div className="crystal-tips-grid">
              <div className="crystal-tip-card">
                <h4>1. 用手感判断</h4>
                <p>圆粒雪手感细腻如砂糖；刻面晶粗糙有棱角感，不易捏紧；深霜如干沙，完全不能凝聚；融冻粒雪冻结时坚硬如石子，融化时湿润粘手。</p>
              </div>
              <div className="crystal-tip-card">
                <h4>2. 放大镜观察</h4>
                <p>携带 10 倍放大镜可清晰辨别晶体形态。在黑色晶体卡上放置少量雪样，观察颗粒形状、大小和透明度。刻面晶闪烁反光，圆粒雪外观暗淡。</p>
              </div>
              <div className="crystal-tip-card">
                <h4>3. 关注弱层信号</h4>
                <p>雪层剖面中出现的刻面晶层、深霜层或被埋表面霜层是关键的弱层信号。这些层面手感明显不同于周围雪层，且稳定性测试（如ECT）常在此处断裂。</p>
              </div>
              <div className="crystal-tip-card">
                <h4>4. 温度梯度监测</h4>
                <p>用温度计测量雪层内不同深度的温度。10cm内温差超过1°C（即梯度 &gt; 10°C/m）就可能发生梯度变质。薄雪层覆盖的地面附近尤其需要关注。</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
