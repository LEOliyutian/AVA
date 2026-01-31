import './ConclusionSection.css';

interface ConclusionSectionProps {
  conclusion: string;
  onChange: (text: string) => void;
}

export function ConclusionSection({ conclusion, onChange }: ConclusionSectionProps) {
  return (
    <div className="conclusion-section">
      <h3 className="section-title">观测结论与分析</h3>

      <div className="conclusion-card">
        <div className="conclusion-hint">
          <p>请根据雪层剖面和稳定性测试结果，总结以下内容：</p>
          <ul>
            <li>雪层整体稳定性评估</li>
            <li>识别到的弱层及其特征</li>
            <li>潜在的雪崩问题类型</li>
            <li>建议的安全措施</li>
          </ul>
        </div>

        <textarea
          value={conclusion}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入观测结论和分析..."
          rows={8}
        />
      </div>
    </div>
  );
}
