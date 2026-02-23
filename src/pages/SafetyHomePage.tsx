import { Link } from 'react-router-dom';
import './SafetyHomePage.css';

const cards = [
  {
    to: '/safety/problem-types',
    title: '雪崩问题类型',
    subtitle: 'Avalanche Problem Types',
    desc: '了解六种标准雪崩问题类型的特征、触发条件和管理建议，提升野外风险识别能力。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 19h20L12 2z" />
        <path d="M12 9v4M12 16h.01" />
      </svg>
    ),
  },
  {
    to: '/safety/danger-scale',
    title: '危险等级详解',
    subtitle: 'Danger Scale',
    desc: '深入理解国际雪崩危险等级1-5级的含义、雪层稳定性评估及对应的活动建议。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-8" />
      </svg>
    ),
  },
  {
    to: '/safety/terrain',
    title: '地形管理指南',
    subtitle: 'Terrain Management',
    desc: '掌握坡度评估、坡向分析和地形陷阱识别技巧，科学选择安全的活动区域。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 20L9 8l4 6 4-10 4 16H3z" />
      </svg>
    ),
  },
  {
    to: '/safety/crystal-types',
    title: '雪晶类型与变质',
    subtitle: 'Snow Crystal Metamorphism',
    desc: '认识积雪中的晶体分类及其演变过程，理解弱层形成的微观机制与雪崩安全的关联。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5l-5 5-5-5M7 19l5-5 5 5M2 12h20M5 7l5 5-5 5M19 17l-5-5 5-5" />
      </svg>
    ),
  },
  {
    to: '/safety/rescue',
    title: '救援与自救',
    subtitle: 'Companion Rescue',
    desc: '掌握信标、探杆、铲子三件套的使用方法，熟练伙伴救援流程，了解自救技巧。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24M12 2v4M2 12h4M18 12h4M12 18v4M4.93 19.07l4.24-4.24M19.07 19.07l-4.24-4.24" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    to: '/safety/decision',
    title: '出行决策框架',
    subtitle: 'Decision-Making Framework',
    desc: '学习三阶段决策模型、明显线索识别法和认知陷阱防范，将知识转化为安全行动。',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3a9 9 0 110 18 9 9 0 010-18z" />
        <path d="M12 7v1M12 16v1" />
      </svg>
    ),
  },
];

export function SafetyHomePage() {
  return (
    <div className="taiga-page">
      <main className="taiga-main">
        <div className="safety-home-hero">
          <span className="safety-home-tag">Safety Knowledge</span>
          <h1 className="safety-home-title">安全知识中心</h1>
          <p className="safety-home-subtitle">
            系统学习雪崩安全知识，了解风险评估方法，掌握地形管理技巧，为野外活动做好充分准备。
          </p>
        </div>

        <div className="safety-home-grid">
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className="safety-home-card">
              <div className="safety-home-card-icon">{card.icon}</div>
              <div className="safety-home-card-body">
                <h3 className="safety-home-card-title">{card.title}</h3>
                <span className="safety-home-card-subtitle">{card.subtitle}</span>
                <p className="safety-home-card-desc">{card.desc}</p>
              </div>
              <span className="safety-home-card-link">
                了解更多
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
