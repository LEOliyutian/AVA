import { RISK_MATRIX } from '../../../config';
import './RiskMatrix.css';

interface RiskMatrixProps {
  likelihood: number;
  size: number;
}

export function RiskMatrix({ likelihood, size }: RiskMatrixProps) {
  const activeRow = 5 - likelihood;
  const activeCol = size - 1;

  return (
    <div className="mx-wrap">
      <div className="mx-y">发生概率 LIKELIHOOD</div>
      <table className="mx-grid">
        <tbody>
          {RISK_MATRIX.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cellValue, colIndex) => {
                const isActive = rowIndex === activeRow && colIndex === activeCol;
                return (
                  <td
                    key={colIndex}
                    className={`mx-cell c-${cellValue} ${isActive ? 'active' : ''}`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mx-label">破坏规模 SIZE →</div>
    </div>
  );
}
