import type { DepthGroup, DepthTest, TestType } from '../../types/observation';
import {
  TEST_TYPE_OPTIONS,
  CRYSTAL_TYPE_OPTIONS,
  SHEAR_QUALITY_OPTIONS,
  ECT_RESULT_OPTIONS,
  PST_PROPAGATION_OPTIONS,
} from '../../types/observation';
import './StabilityTestSection.css';

interface StabilityTestSectionProps {
  groups: DepthGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (id: number) => void;
  onUpdateGroup: <K extends keyof DepthGroup>(id: number, key: K, value: DepthGroup[K]) => void;
  onAddTest: (groupId: number) => void;
  onRemoveTest: (groupId: number, testId: number) => void;
  onUpdateTest: <K extends keyof DepthTest>(
    groupId: number,
    testId: number,
    key: K,
    value: DepthTest[K]
  ) => void;
}

// CT 测试结果选项
const CT_RESULT_OPTIONS = ['CTE', 'CTM', 'CTH', 'CTN'];

// RB 测试评分选项
const RB_SCORE_OPTIONS = ['RB1', 'RB2', 'RB3', 'RB4', 'RB5', 'RB6', 'RB7'];

export function StabilityTestSection({
  groups,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroup,
  onAddTest,
  onRemoveTest,
  onUpdateTest,
}: StabilityTestSectionProps) {
  // 根据测试类型渲染不同的输入字段
  const renderTestFields = (group: DepthGroup, test: DepthTest) => {
    const updateField = <K extends keyof DepthTest>(key: K, value: DepthTest[K]) => {
      onUpdateTest(group.id, test.id, key, value);
    };

    switch (test.type) {
      case 'CT':
        return (
          <>
            <div className="test-field">
              <label>敲击次数</label>
              <input
                type="number"
                min="0"
                max="30"
                value={test.taps || ''}
                onChange={(e) => updateField('taps', e.target.value)}
                placeholder="0-30"
              />
            </div>
            <div className="test-field">
              <label>结果</label>
              <select
                value={test.result || ''}
                onChange={(e) => updateField('result', e.target.value)}
              >
                <option value="">选择</option>
                {CT_RESULT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="test-field">
              <label>剪切质量</label>
              <select
                value={test.quality || ''}
                onChange={(e) => updateField('quality', e.target.value)}
              >
                <option value="">选择</option>
                {SHEAR_QUALITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'ECT':
        return (
          <>
            <div className="test-field">
              <label>敲击次数</label>
              <input
                type="number"
                min="0"
                max="30"
                value={test.taps || ''}
                onChange={(e) => updateField('taps', e.target.value)}
                placeholder="0-30"
              />
            </div>
            <div className="test-field">
              <label>结果</label>
              <select
                value={test.result || ''}
                onChange={(e) => updateField('result', e.target.value)}
              >
                <option value="">选择</option>
                {ECT_RESULT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="test-field">
              <label>剪切质量</label>
              <select
                value={test.quality || ''}
                onChange={(e) => updateField('quality', e.target.value)}
              >
                <option value="">选择</option>
                {SHEAR_QUALITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'PST':
        return (
          <>
            <div className="test-field">
              <label>切入长度 (cm)</label>
              <input
                type="number"
                min="0"
                value={test.cut || ''}
                onChange={(e) => updateField('cut', e.target.value)}
                placeholder="cm"
              />
            </div>
            <div className="test-field">
              <label>柱长 (cm)</label>
              <input
                type="number"
                min="0"
                value={test.length || ''}
                onChange={(e) => updateField('length', e.target.value)}
                placeholder="cm"
              />
            </div>
            <div className="test-field">
              <label>传播</label>
              <select
                value={test.propagation || ''}
                onChange={(e) => updateField('propagation', e.target.value)}
              >
                <option value="">选择</option>
                {PST_PROPAGATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'RB':
        return (
          <>
            <div className="test-field">
              <label>评分</label>
              <select
                value={test.score || ''}
                onChange={(e) => updateField('score', e.target.value)}
              >
                <option value="">选择</option>
                {RB_SCORE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="test-field">
              <label>剪切质量</label>
              <select
                value={test.quality || ''}
                onChange={(e) => updateField('quality', e.target.value)}
              >
                <option value="">选择</option>
                {SHEAR_QUALITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'DTT':
        return (
          <>
            <div className="test-field">
              <label>结果</label>
              <input
                type="text"
                value={test.result || ''}
                onChange={(e) => updateField('result', e.target.value)}
                placeholder="输入结果"
              />
            </div>
          </>
        );

      case '槽口测试':
        return (
          <>
            <div className="test-field">
              <label>结果</label>
              <input
                type="text"
                value={test.result || ''}
                onChange={(e) => updateField('result', e.target.value)}
                placeholder="输入结果"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // 生成测试摘要标签
  const formatTestLabel = (test: DepthTest) => {
    switch (test.type) {
      case 'CT':
        return `CT${test.taps || ''}${test.quality || ''}`;
      case 'ECT':
        const ectResult = test.result?.replace('ECT', '') || '';
        return `ECT${ectResult}${test.taps || ''}`;
      case 'PST':
        const pstInfo = test.cut && test.length ? `${test.cut}/${test.length}` : '';
        return `PST${pstInfo}${test.propagation || ''}`;
      case 'RB':
        return `${test.score || 'RB'}${test.quality || ''}`;
      default:
        return test.type;
    }
  };

  return (
    <div className="stability-test-section">
      <h3 className="section-title">稳定性测试记录</h3>
      <p className="section-hint">每个隔离柱测试可记录多个深度的反应</p>

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>暂无测试记录</p>
          <button className="add-group-btn" onClick={onAddGroup}>
            + 添加隔离柱测试
          </button>
        </div>
      ) : (
        <>
          {groups.map((group, groupIndex) => (
            <div key={group.id} className="test-group-card">
              <div className="group-header">
                <span className="group-index">隔离柱 #{groupIndex + 1}</span>
                <button
                  className="remove-group-btn"
                  onClick={() => onRemoveGroup(group.id)}
                  title="删除此隔离柱"
                >
                  ×
                </button>
              </div>

              {/* 添加反应记录 */}
              <div className="tests-container">
                <div className="tests-header">
                  <span>反应记录</span>
                  <div className="add-test-controls">
                    <select
                      value={group.addType}
                      onChange={(e) =>
                        onUpdateGroup(group.id, 'addType', e.target.value as TestType)
                      }
                      className="test-type-select"
                    >
                      {TEST_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button className="add-test-btn" onClick={() => onAddTest(group.id)}>
                      + 添加反应
                    </button>
                  </div>
                </div>

                {group.tests.length === 0 ? (
                  <div className="no-tests">选择测试类型后点击添加反应</div>
                ) : (
                  <div className="tests-list">
                    {group.tests.map((test, testIndex) => (
                      <div key={test.id} className="test-item">
                        <div className="test-header">
                          <span className="test-type-badge">{test.type}</span>
                          <span className="test-label">{formatTestLabel(test)}</span>
                          <button
                            className="remove-test-btn"
                            onClick={() => onRemoveTest(group.id, test.id)}
                            title="删除此反应"
                          >
                            ×
                          </button>
                        </div>

                        {/* 反应深度 */}
                        <div className="reaction-depth">
                          <label>反应深度 (cm)</label>
                          <input
                            type="number"
                            value={group.depth}
                            onChange={(e) => onUpdateGroup(group.id, 'depth', e.target.value)}
                            placeholder="深度"
                          />
                        </div>

                        {/* 测试结果字段 */}
                        <div className="test-fields">{renderTestFields(group, test)}</div>

                        {/* 弱层信息 */}
                        <div className="weak-layer-info">
                          <div className="test-field">
                            <label>弱层晶型</label>
                            <select
                              value={group.weakLayerType}
                              onChange={(e) => onUpdateGroup(group.id, 'weakLayerType', e.target.value)}
                            >
                              <option value="">选择</option>
                              {CRYSTAL_TYPE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="test-field">
                            <label>弱层粒径 (mm)</label>
                            <input
                              type="text"
                              value={group.weakLayerGrainSize}
                              onChange={(e) => onUpdateGroup(group.id, 'weakLayerGrainSize', e.target.value)}
                              placeholder="粒径"
                            />
                          </div>
                        </div>

                        {/* 备注 */}
                        <div className="test-notes">
                          <label>备注</label>
                          <input
                            type="text"
                            value={test.notes || ''}
                            onChange={(e) =>
                              onUpdateTest(group.id, test.id, 'notes', e.target.value)
                            }
                            placeholder="反应备注"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 隔离柱整体备注 */}
              <div className="group-notes">
                <label>隔离柱备注</label>
                <input
                  type="text"
                  value={group.notes}
                  onChange={(e) => onUpdateGroup(group.id, 'notes', e.target.value)}
                  placeholder="整体备注"
                />
              </div>
            </div>
          ))}

          <button className="add-group-btn" onClick={onAddGroup}>
            + 添加隔离柱测试
          </button>
        </>
      )}
    </div>
  );
}
