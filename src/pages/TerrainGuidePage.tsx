import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { knowledgeApi, type KnowledgeNote } from '../api/knowledge.api';
import './TerrainGuidePage.css';
import './knowledge-shared.css';

const terrainMatrix = [
  { level: 1, label: '低风险', color: '#5cb85c', suitable: '所有地形', avoid: '无特别限制' },
  { level: 2, label: '一般风险', color: '#f0ad4e', suitable: '大部分地形，30°以下坡面', avoid: '已识别的不稳定风板区域、极陡地形' },
  { level: 3, label: '较高风险', color: '#ff9800', suitable: '30°以下的缓坡和平坦地形', avoid: '所有35°以上坡面、雪崩路径及堆积区' },
  { level: 4, label: '高风险', color: '#d9534f', suitable: '仅限平坦地形和密林保护区', avoid: '所有雪崩地形（起始区、路径、堆积区）' },
  { level: 5, label: '极端风险', color: '#292b2c', suitable: '仅限建筑内或完全安全区域', avoid: '所有户外雪崩影响范围' },
];

export function TerrainGuidePage() {
  const [note, setNote] = useState<KnowledgeNote | null>(null);
  useEffect(() => {
    knowledgeApi.getNote('terrain').then((res) => {
      if (res.success && res.data?.note) setNote(res.data.note);
    });
  }, []);

  return (
    <div className="taiga-page">
      <main className="taiga-main">
        <div className="terrain-header">
          <Link to="/safety" className="terrain-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回安全知识
          </Link>
          <h1 className="terrain-title">地形管理指南</h1>
          <p className="terrain-subtitle">
            科学评估和选择地形是雪崩安全管理的核心。掌握坡度、坡向和地形陷阱的识别方法，做出安全的活动决策。
          </p>
        </div>

        {/* Section 1: Slope Assessment */}
        <section className="terrain-section">
          <div className="terrain-section-header">
            <h2>坡度评估</h2>
            <span className="terrain-section-en">Slope Angle Assessment</span>
          </div>
          <div className="terrain-section-body">
            <p className="terrain-intro">
              坡度是决定雪崩风险最关键的地形因素。绝大多数雪板雪崩发生在30°至45°的坡面上，了解关键角度阈值对安全决策至关重要。
            </p>
            <div className="terrain-angle-cards">
              <div className="terrain-angle-card terrain-angle-caution">
                <div className="terrain-angle-value">30°</div>
                <div className="terrain-angle-info">
                  <h4>警戒线</h4>
                  <p>雪板雪崩开始可能发生的最低坡度。30°以下的坡面通常被认为是雪崩安全地形（但需注意上方坡面的影响）。</p>
                </div>
              </div>
              <div className="terrain-angle-card terrain-angle-danger">
                <div className="terrain-angle-value">35°</div>
                <div className="terrain-angle-info">
                  <h4>高频区域</h4>
                  <p>大多数人为触发雪崩发生在35°-40°的坡面上。这是最常见的雪崩起始坡度范围，需要特别谨慎。</p>
                </div>
              </div>
              <div className="terrain-angle-card terrain-angle-extreme">
                <div className="terrain-angle-value">40°+</div>
                <div className="terrain-angle-info">
                  <h4>极端地形</h4>
                  <p>超过40°的坡面在不稳定条件下极易自然释放。松雪雪崩在此角度以上尤为频繁，雪板也可能频繁自然触发。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Aspect Analysis */}
        <section className="terrain-section">
          <div className="terrain-section-header">
            <h2>坡向分析</h2>
            <span className="terrain-section-en">Aspect Analysis</span>
          </div>
          <div className="terrain-section-body">
            <p className="terrain-intro">
              坡向影响雪层的温度变化、日照时间和风的加载模式。不同坡向在不同季节和天气条件下呈现不同的风险特征。
            </p>
            <div className="terrain-aspect-grid">
              <div className="terrain-aspect-card">
                <div className="terrain-aspect-icon">N</div>
                <h4>北坡</h4>
                <p>接受最少日照，雪层温度低，弱层保存时间长。冬季持续板和深层弱层问题最严重。粉雪保存最好但风险持续时间也最长。</p>
              </div>
              <div className="terrain-aspect-card">
                <div className="terrain-aspect-icon">S</div>
                <h4>南坡</h4>
                <p>日照充足，雪层温度变化大。冬季相对较快稳定，但春季湿雪雪崩风险最高。中午至下午是最危险的时间段。</p>
              </div>
              <div className="terrain-aspect-card">
                <div className="terrain-aspect-icon">E</div>
                <h4>东坡</h4>
                <p>接受上午日照。在西风主导地区（如吉克普林），东坡常为背风坡，容易形成风板堆积。注意观察风的搬运方向。</p>
              </div>
              <div className="terrain-aspect-card">
                <div className="terrain-aspect-icon">W</div>
                <h4>西坡</h4>
                <p>接受下午日照。在西风主导地区通常为迎风坡，雪面可能被侵蚀。春季下午升温时湿雪风险增加。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Terrain Traps */}
        <section className="terrain-section">
          <div className="terrain-section-header">
            <h2>地形陷阱识别</h2>
            <span className="terrain-section-en">Terrain Traps</span>
          </div>
          <div className="terrain-section-body">
            <p className="terrain-intro">
              地形陷阱是指即使小规模雪崩也可能导致严重后果的地形特征。在评估雪崩风险时，必须同时考虑雪崩规模和下方的地形特征。
            </p>
            <div className="terrain-traps-list">
              <div className="terrain-trap-item">
                <div className="terrain-trap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </div>
                <div className="terrain-trap-content">
                  <h4>悬崖带</h4>
                  <p>坡面下方的悬崖使即使小型雪崩也可能造成致命坠落。在接近悬崖边缘的陡坡上活动时需格外谨慎。评估路线时务必考虑坠落暴露。</p>
                </div>
              </div>
              <div className="terrain-trap-item">
                <div className="terrain-trap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L4 20h16L12 2z" />
                    <path d="M8 14h8" />
                  </svg>
                </div>
                <div className="terrain-trap-content">
                  <h4>沟谷与凹地</h4>
                  <p>沟谷和凹地会汇聚雪崩堆积物，增加被埋深度。小型雪崩在沟道中可能堆积数米深的雪，使救援极为困难。</p>
                </div>
              </div>
              <div className="terrain-trap-item">
                <div className="terrain-trap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 10L12 2 7 10h10z" />
                    <path d="M5 22l7-12 7 12H5z" />
                  </svg>
                </div>
                <div className="terrain-trap-content">
                  <h4>树木稀疏带</h4>
                  <p>间距较大的树木区域（树间距大于树高）不能有效阻止雪崩。稀疏的树木反而成为障碍物，增加创伤风险。密林（树间距小于树高的1/3）才能提供有效保护。</p>
                </div>
              </div>
              <div className="terrain-trap-item">
                <div className="terrain-trap-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 20h20" />
                    <path d="M4 20c0-8 3-16 8-16s8 8 8 16" />
                  </svg>
                </div>
                <div className="terrain-trap-content">
                  <h4>凸起地形</h4>
                  <p>地形凸起处（如冰碛脊、岩石凸起）是雪板的薄弱点，更容易被人为触发。同时也是自然雪崩的常见起始点。在这些位置需保持高度警惕。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Terrain Selection Matrix */}
        <section className="terrain-section">
          <div className="terrain-section-header">
            <h2>地形选择矩阵</h2>
            <span className="terrain-section-en">Terrain Selection Matrix</span>
          </div>
          <div className="terrain-section-body">
            <p className="terrain-intro">
              根据当前雪崩危险等级，选择合适的活动地形。等级越高，应选择越保守的地形。
            </p>
            <div className="terrain-matrix-table-wrap">
              <table className="terrain-matrix-table">
                <thead>
                  <tr>
                    <th>等级</th>
                    <th>危险程度</th>
                    <th>适宜地形</th>
                    <th>应避开地形</th>
                  </tr>
                </thead>
                <tbody>
                  {terrainMatrix.map((row) => (
                    <tr key={row.level}>
                      <td>
                        <span className="terrain-matrix-badge" style={{ backgroundColor: row.color }}>
                          {row.level}
                        </span>
                      </td>
                      <td className="terrain-matrix-label">{row.label}</td>
                      <td>{row.suitable}</td>
                      <td>{row.avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: Resort-specific */}
        <section className="terrain-section">
          <div className="terrain-section-header">
            <h2>吉克普林分区建议</h2>
            <span className="terrain-section-en">Jikepulin Zone Guidance</span>
          </div>
          <div className="terrain-section-body">
            <p className="terrain-intro">
              以下为结合吉克普林滑雪场实际地形特点的通用安全建议。具体分区风险请以当日发布的雪崩预报为准。
            </p>
            <div className="terrain-zone-cards">
              <div className="terrain-zone-card">
                <div className="terrain-zone-badge terrain-zone-alp">高山带 &gt;2200m</div>
                <p>高山带风力作用显著，风板问题频繁。山脊两侧及碗状地形是重点关注区域。雪檐发育活跃，远离山脊边缘。冬季北坡弱层问题可能持续数周。</p>
              </div>
              <div className="terrain-zone-card">
                <div className="terrain-zone-badge terrain-zone-tl">林线带 1800-2200m</div>
                <p>林线过渡带地形复杂，树木间距变化大。注意辨别有效保护林与稀疏带的差异。此区域常受到上方高山带雪崩路径的影响，选择路线时需评估上方地形。</p>
              </div>
              <div className="terrain-zone-card">
                <div className="terrain-zone-badge terrain-zone-btl">林下带 &lt;1800m</div>
                <p>密林区域提供较好的雪崩保护，但需注意沟谷和开阔坡面。春季升温时低海拔率先受到湿雪影响。树林间的空地和林道可能暴露在上方雪崩路径中。</p>
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
