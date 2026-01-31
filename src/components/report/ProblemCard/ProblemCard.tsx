import { RoseDiagram, RiskMatrix } from '../../shared';
import { getProblemTypeName, LIKELIHOOD_TEXT } from '../../../config';
import type { AvalancheProblem } from '../../../types';
import './ProblemCard.css';

interface ProblemCardProps {
  problem: AvalancheProblem;
  variant: 'primary' | 'secondary';
}

export function ProblemCard({ problem, variant }: ProblemCardProps) {
  const isPrimary = variant === 'primary';
  const tagColor = isPrimary ? 'var(--c-4)' : 'var(--c-2)';
  const tagText = isPrimary ? '主要问题 Primary' : '次要问题 Secondary';

  return (
    <div className="prob-card">
      <div className="prob-vis">
        <div className="tag" style={{ background: tagColor }}>
          {tagText}
        </div>
        <RoseDiagram
          sectors={problem.sectors}
          variant={variant}
          editable={false}
          size={110}
        />
        <RiskMatrix likelihood={problem.likelihood} size={problem.size} />
      </div>
      <div className="prob-dat">
        <h3 className="prob-type">{getProblemTypeName(problem.type)}</h3>
        <p className="prob-txt">{problem.description}</p>
        <div className="input-row" style={{ borderTop: '1px dashed #eee', paddingTop: 15 }}>
          <div className="input-item">
            <span className="wx-sub">发生概率 LIKELIHOOD</span>
            <span className="wx-big">{LIKELIHOOD_TEXT[problem.likelihood]}</span>
          </div>
          <div className="input-item">
            <span className="wx-sub">破坏规模 SIZE</span>
            <span className="wx-big">{problem.size}级</span>
          </div>
        </div>
      </div>
    </div>
  );
}
