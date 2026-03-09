import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { knowledgeApi, mediaUrl, type KnowledgeMedia, type KnowledgeNote } from '../api/knowledge.api';
import './ProblemTypesPage.css';

interface ProblemType {
  name: string;
  nameEn: string;
  itemKey: string;
  color: string;
  description: string;
  triggers: string;
  terrain: string;
  management: string;
  trend: string;
}

const problems: ProblemType[] = [
  {
    name: '风板',
    nameEn: 'Wind Slab',
    itemKey: 'wind_slab',
    color: '#3b82f6',
    description: '由风搬运的雪在背风坡堆积形成的致密雪板。风板通常质地坚硬，覆盖在较软的雪层之上，形成明显的弱层界面。',
    triggers: '人为触发常见，尤其在风板边缘和较薄区域。风力加载后数小时至数天内风险最高。',
    terrain: '背风坡、山脊下方、沟谷上部。常见于高山带和林线带的陡峭地形。',
    management: '避开背风坡面的陡峭地形，注意观察风向标志（雪旗、雪檐方向）。大风过后保持保守路线选择。',
    trend: '风力停止后随时间逐渐稳定，通常在1-3天内风险降低，但低温环境下可持续更久。',
  },
  {
    name: '持续板',
    nameEn: 'Persistent Slab',
    itemKey: 'persistent_slab',
    color: '#8b5cf6',
    description: '建立在深层持续弱层（如深霜、表面霜、冰壳）之上的雪板。这类问题可持续数周甚至整个雪季，且难以预测。',
    triggers: '人为触发可能性中等至高。弱层可能被上方较厚的雪板加载后远程触发，触发点可能远离雪崩路径。',
    terrain: '所有坡向的35°以上陡坡。在弱层分布范围内影响面积广，可能导致大规模雪崩。',
    management: '这是最危险的雪崩问题类型之一。建议远离所有陡峭地形，保持极为保守的路线选择。注意雪层剖面中的弱层信号。',
    trend: '随时间缓慢稳定，可能持续数周至数月。新降雪或温度变化可能重新激活。',
  },
  {
    name: '暴风雪板',
    nameEn: 'Storm Slab',
    itemKey: 'storm_slab',
    color: '#f59e0b',
    description: '由降雪或降雪伴随风形成的新雪板。新雪在旧雪面上快速堆积，来不及与下层结合就形成不稳定的雪板结构。',
    triggers: '暴风雪期间及之后人为触发概率高。降雪强度越大、温度越低，形成不稳定雪板的风险越高。',
    terrain: '所有坡向的陡坡，尤其是35°以上的地形。高山带和林线带风险最高。',
    management: '暴风雪期间和之后24-48小时内避开陡峭地形。关注降雪速率和总量，超过30cm/24h需特别警惕。',
    trend: '通常在暴风雪停止后1-3天内随着新雪沉降和结合而稳定。',
  },
  {
    name: '湿雪',
    nameEn: 'Wet Slab',
    itemKey: 'wet_slab',
    color: '#06b6d4',
    description: '由液态水渗透进入雪层，弱化雪板内部结构或雪板与地面的界面而导致。常见于春季升温或降雨事件后。',
    triggers: '自然触发为主。当融水到达弱层或地面时可大面积自然释放。极端情况下轨迹路线中的滑雪切割也可能触发。',
    terrain: '阳面坡（南坡、西南坡）在春季白天风险最高。低海拔带和林下带先受影响。',
    management: '关注冻融循环，清晨出行在雪面重新冻结后活动，中午前撤离陡峭阳面坡。避免在雪面湿润变软后进入陡坡。',
    trend: '随昼夜冻融循环变化。持续温暖天气或降雨会使问题加剧，直到雪层完全排水稳定。',
  },
  {
    name: '松雪',
    nameEn: 'Loose Dry / Loose Wet',
    itemKey: 'loose',
    color: '#10b981',
    description: '从单一点释放的雪崩，呈倒三角或扇形扩展。分为干松雪（冷干的新雪或表面霜）和湿松雪（融雪）两种类型。',
    triggers: '自然释放或人为触发均常见。干松雪多由滑雪者切割触发，湿松雪多因日照升温自然释放。',
    terrain: '极陡地形（40°以上）。虽然单次松雪雪崩规模通常较小，但在地形陷阱中可能造成严重后果。',
    management: '关注松雪雪崩下方是否存在悬崖、沟道等地形陷阱。小规模松雪雪崩可能触发下方更大的雪板雪崩。',
    trend: '干松雪随雪层沉降快速稳定。湿松雪随日间温度循环变化，午后风险增高。',
  },
  {
    name: '雪檐',
    nameEn: 'Cornice',
    itemKey: 'cornice',
    color: '#ef4444',
    description: '在山脊或悬崖边缘由风堆积形成的悬挂雪块。雪檐可能在无征兆的情况下断裂，坠落后可能触发下方坡面的雪崩。',
    triggers: '温度升高、额外的风加载或自身重力作用均可导致断裂。人为接近也可能触发。雪檐的实际边缘往往比目视判断更靠后。',
    terrain: '山脊线、悬崖边缘和陡坡顶部。常见于背风一侧的山脊。',
    management: '远离山脊边缘，保持安全距离（至少一个雪檐宽度）。不要在雪檐下方停留或通行。上山接近山脊时从迎风侧靠近。',
    trend: '随温度升高和风力加载逐渐增大。春季升温期间雪檐断裂风险显著增加。',
  },
];

export function ProblemTypesPage() {
  const [mediaMap, setMediaMap] = useState<Record<string, KnowledgeMedia>>({});
  const [note, setNote] = useState<KnowledgeNote | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    knowledgeApi.getMedia('problem_types').then((res) => {
      if (res.success && res.data) {
        const map: Record<string, KnowledgeMedia> = {};
        for (const m of res.data.media) map[m.item_key] = m;
        setMediaMap(map);
      }
    });
    knowledgeApi.getNote('problem_types').then((res) => {
      if (res.success && res.data?.note) setNote(res.data.note);
    });
    knowledgeApi.getContent('problem_types').then((res) => {
      if (res.success && res.data) setContentMap(res.data.content);
    });
  }, []);

  return (
    <div className="taiga-page">
      <main className="taiga-main">
        <div className="problem-types-header">
          <Link to="/safety" className="problem-types-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="problem-types-title">雪崩问题类型</h1>
          <p className="problem-types-subtitle">
            基于CAIC（科罗拉多雪崩信息中心）标准分类，了解六种主要雪崩问题类型的特征与管理方法。
          </p>
        </div>

        <div className="problem-types-list">
          {problems.map((p) => {
            const img = mediaMap[p.itemKey];
            const c = contentMap[p.itemKey] ?? {};
            return (
              <div key={p.nameEn} className="problem-type-card" style={{ '--problem-color': p.color } as React.CSSProperties}>
                <div className="problem-type-header">
                  <div className="problem-type-badge" style={{ backgroundColor: p.color }}>
                    {p.name.charAt(0)}
                  </div>
                  <div className="problem-type-names">
                    <h2>{p.name}</h2>
                    <span>{p.nameEn}</span>
                  </div>
                </div>

                {img && (
                  <div className="problem-type-img-wrap">
                    <img
                      src={mediaUrl(img.file_path)}
                      alt={img.alt_text || p.name}
                      className="problem-type-img"
                      loading="lazy"
                    />
                  </div>
                )}

                <p className="problem-type-desc">{c.description || p.description}</p>

                <div className="problem-type-details">
                  <div className="problem-type-detail">
                    <h4>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                      触发条件
                    </h4>
                    <p>{c.triggers || p.triggers}</p>
                  </div>
                  <div className="problem-type-detail">
                    <h4>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M3 20L9 8l4 6 4-10 4 16H3z" />
                      </svg>
                      典型地形
                    </h4>
                    <p>{c.terrain || p.terrain}</p>
                  </div>
                  <div className="problem-type-detail">
                    <h4>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      管理建议
                    </h4>
                    <p>{c.management || p.management}</p>
                  </div>
                  <div className="problem-type-detail">
                    <h4>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                      变化趋势
                    </h4>
                    <p>{c.trend || p.trend}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
