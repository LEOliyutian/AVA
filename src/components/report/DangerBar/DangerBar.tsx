import { DangerCell } from './DangerCell';
import { useCalculatedRisks } from '../../../store';
import './DangerBar.css';

export function DangerBar() {
  const risks = useCalculatedRisks();

  return (
    <div className="danger-bar">
      <DangerCell
        band="alp"
        title="高山带 High Alpine"
        elevation="> 2200m"
        dangerLevel={risks.alp}
      />
      <DangerCell
        band="tl"
        title="林线带 Treeline"
        elevation="1800m - 2200m"
        dangerLevel={risks.tl}
      />
      <DangerCell
        band="btl"
        title="林线以下 Below Treeline"
        elevation="< 1800m"
        dangerLevel={risks.btl}
      />
    </div>
  );
}
