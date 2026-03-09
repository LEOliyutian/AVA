import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DANGER_CONFIG } from '../config';
import { knowledgeApi, type KnowledgeNote } from '../api/knowledge.api';
import './DangerScalePage.css';
import './knowledge-shared.css';

interface LevelInfo {
  level: number;
  stability: string;
  naturalTrigger: string;
  humanTrigger: string;
  activityScope: string;
  terrainAdvice: string;
  details: { icon: string; text: string }[];
}

const levels: LevelInfo[] = [
  {
    level: 1,
    stability: '雪层整体稳定，自然触发和人为触发的可能性都很低。孤立的不稳定区域可能存在于极端陡峭地形。',
    naturalTrigger: '极低 — 自然雪崩活动罕见',
    humanTrigger: '极低 — 仅在孤立地形特征处有微弱可能',
    activityScope: '适合各类野外活动',
    terrainAdvice: '所有地形均可考虑，但极陡峭地形仍需基本评估。',
    details: [
      { icon: '⛷️', text: '适合各类野外活动，但仍需保持基本警惕' },
      { icon: '📍', text: '极陡峭地形仍可能存在孤立风险点' },
    ],
  },
  {
    level: 2,
    stability: '特定地形特征处雪层稳定性降低。在某些坡向和海拔带可能存在不稳定的雪板结构，尤其在风加载区域。',
    naturalTrigger: '低 — 自然触发雪崩不太可能',
    humanTrigger: '可能 — 在特定的不稳定地形特征处可被人为触发',
    activityScope: '大部分地形可活动，需谨慎评估特定区域',
    terrainAdvice: '避免已识别的不稳定地形特征，在陡峭的背风坡面保持警惕。',
    details: [
      { icon: '⚠️', text: '在陡峭坡面需谨慎评估，避免触发点' },
      { icon: '🏔️', text: '关注背风坡和凸起地形的风板堆积' },
    ],
  },
  {
    level: 3,
    stability: '多数陡峭坡面雪层不稳定。危险条件可能广泛存在，多个坡向和海拔带均可能受到影响。',
    naturalTrigger: '可能 — 自然触发雪崩有一定概率发生',
    humanTrigger: '很可能 — 人为触发概率显著上升，尤其在陡峭地形',
    activityScope: '需要丰富经验和保守的地形选择',
    terrainAdvice: '仅选择坡度较低的地形，避免所有35°以上的坡面和雪崩路径下方。',
    details: [
      { icon: '🚨', text: '需要丰富的雪崩判断经验和保守的地形选择' },
      { icon: '👥', text: '避免群体同时进入危险区域，保持安全间距' },
    ],
  },
  {
    level: 4,
    stability: '大多数陡峭地形非常不稳定。危险条件广泛且严重，大型自然雪崩可能频繁发生。',
    naturalTrigger: '很可能 — 自然触发雪崩可能频繁发生，包括大型雪崩',
    humanTrigger: '非常可能 — 人为触发几乎确定，甚至在较缓坡面',
    activityScope: '强烈建议避开所有雪崩地形',
    terrainAdvice: '远离所有雪崩起始区、路径和堆积区。仅在完全平坦或有森林保护的区域活动。',
    details: [
      { icon: '🛑', text: '强烈建议避开所有雪崩地形，包括径流区' },
      { icon: '🌨️', text: '通常伴随大量降雪、强风或快速升温' },
    ],
  },
  {
    level: 5,
    stability: '广泛的自然雪崩活动，雪层极度不稳定。大规模雪崩随时可能发生，影响范围可能远超正常雪崩路径。',
    naturalTrigger: '确定 — 大量自然雪崩正在发生或即将发生',
    humanTrigger: '确定 — 任何暴露在雪崩地形中的人员都面临极端风险',
    activityScope: '禁止一切野外活动',
    terrainAdvice: '远离所有雪崩路径及其影响范围。此等级下雪崩可能到达非常远的距离。',
    details: [
      { icon: '⛔', text: '禁止一切野外活动，远离所有雪崩路径' },
      { icon: '🏠', text: '此等级罕见，通常由极端天气事件引发' },
    ],
  },
];

function getDangerColor(level: number) {
  return DANGER_CONFIG[level as keyof typeof DANGER_CONFIG]?.color || '#94a3b8';
}

function getDangerLabel(level: number) {
  const config = DANGER_CONFIG[level as keyof typeof DANGER_CONFIG];
  if (!config) return { cn: '未知', en: 'Unknown' };
  const parts = config.label.split(' ');
  return { cn: parts[1] || '未知', en: parts[2] || 'Unknown' };
}

export function DangerScalePage() {
  const [note, setNote] = useState<KnowledgeNote | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    knowledgeApi.getNote('danger_scale').then((res) => {
      if (res.success && res.data?.note) setNote(res.data.note);
    });
    knowledgeApi.getContent('danger_scale').then((res) => {
      if (res.success && res.data) setContentMap(res.data.content);
    });
  }, []);

  // Merge DB content over hardcoded defaults
  const mergedLevels = levels.map((info) => {
    const c = contentMap[`level_${info.level}`] ?? {};
    return {
      ...info,
      stability:      c.stability      || info.stability,
      naturalTrigger: c.naturalTrigger || info.naturalTrigger,
      humanTrigger:   c.humanTrigger   || info.humanTrigger,
      activityScope:  c.activityScope  || info.activityScope,
      terrainAdvice:  c.terrainAdvice  || info.terrainAdvice,
    };
  });

  return (
    <div className="taiga-page">
      <main className="taiga-main">
        <div className="danger-scale-header">
          <Link to="/safety" className="danger-scale-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="danger-scale-title">国际雪崩危险等级标准</h1>
          <p className="danger-scale-subtitle">
            了解各等级含义，做出明智的野外决策。危险等级从1（低）到5（极端）描述了雪崩发生的可能性和规模。
          </p>
        </div>

        {/* Color scale bar */}
        <div className="danger-scale-bar-section">
          <div className="scale-bar">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="scale-segment"
                style={{ backgroundColor: getDangerColor(level) }}
              >
                <span className="segment-num">{level}</span>
              </div>
            ))}
          </div>
          <div className="scale-labels">
            <span className="scale-label-start">低风险</span>
            <span className="scale-label-end">极端危险</span>
          </div>
        </div>

        {/* Level cards */}
        <div className="danger-scale-cards">
          {mergedLevels.map((info) => (
            <div
              key={info.level}
              className="danger-scale-card"
              style={{ '--level-color': getDangerColor(info.level) } as React.CSSProperties}
            >
              <div className="danger-scale-card-header">
                <div className="danger-scale-badge" style={{ backgroundColor: getDangerColor(info.level) }}>
                  {info.level}
                </div>
                <div className="danger-scale-names">
                  <h2>{getDangerLabel(info.level).cn}</h2>
                  <span>{getDangerLabel(info.level).en}</span>
                </div>
              </div>

              <p className="danger-scale-stability">{info.stability}</p>

              <div className="danger-scale-grid">
                <div className="danger-scale-item">
                  <h4>自然触发概率</h4>
                  <p>{info.naturalTrigger}</p>
                </div>
                <div className="danger-scale-item">
                  <h4>人为触发概率</h4>
                  <p>{info.humanTrigger}</p>
                </div>
                <div className="danger-scale-item">
                  <h4>建议活动范围</h4>
                  <p>{info.activityScope}</p>
                </div>
                <div className="danger-scale-item">
                  <h4>地形选择建议</h4>
                  <p>{info.terrainAdvice}</p>
                </div>
              </div>

              <div className="danger-scale-tips">
                {info.details.map((d, i) => (
                  <div key={i} className="danger-scale-tip">
                    <span className="danger-scale-tip-icon">{d.icon}</span>
                    <span>{d.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Usage guide */}
        <div className="danger-scale-guide">
          <h3>如何使用危险等级</h3>
          <div className="danger-scale-guide-grid">
            <div className="danger-scale-guide-item">
              <h4>1. 查看预报</h4>
              <p>出行前查看当日雪崩预报，了解各海拔带和坡向的危险等级。预报会结合天气、雪层和近期雪崩活动综合评估。</p>
            </div>
            <div className="danger-scale-guide-item">
              <h4>2. 评估地形</h4>
              <p>根据危险等级选择合适的地形。等级越高，应选择越保守的路线——降低坡度、避开雪崩路径、远离地形陷阱。</p>
            </div>
            <div className="danger-scale-guide-item">
              <h4>3. 现场验证</h4>
              <p>到达现场后通过观察雪面信号（如裂缝、塌陷声、近期雪崩痕迹）验证预报评估。如果观察到的信号比预报严重，立即调整计划。</p>
            </div>
            <div className="danger-scale-guide-item">
              <h4>4. 持续监控</h4>
              <p>活动过程中持续关注天气变化和雪面状况。条件可能在一天之内显著变化，尤其是在温度快速上升或开始降雪时。</p>
            </div>
          </div>
        </div>
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
