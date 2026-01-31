import type { RoseSectorKey } from '../../../types';
import { BAND_CONFIG, DIRECTIONS, generateSectorPath, getDirectionAngle } from '../../../utils';
import './RoseDiagram.css';

interface RoseDiagramProps {
  sectors: Set<RoseSectorKey> | RoseSectorKey[] | string[];
  onToggle?: (sector: RoseSectorKey) => void;
  variant?: 'primary' | 'secondary';
  editable?: boolean;
  size?: number;
}

export function RoseDiagram({
  sectors,
  onToggle,
  variant = 'primary',
  editable = false,
  size = 100,
}: RoseDiagramProps) {
  const fillClass = variant === 'primary' ? 'fill-p1' : 'fill-p2';
  const cx = 50;
  const cy = 50;

  // 统一转换为 Set 便于查询
  const sectorsSet = sectors instanceof Set
    ? sectors
    : new Set(sectors as RoseSectorKey[]);

  const handleClick = (sector: RoseSectorKey) => {
    if (editable && onToggle) {
      onToggle(sector);
    }
  };

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="-2 -2 104 104" style={{ width: '100%', height: '100%' }}>
        {/* 背景圆和辅助线 */}
        <circle cx={cx} cy={cy} r={49} fill="#fff" stroke="#ccc" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={35} fill="none" stroke="#ccc" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={20} fill="none" stroke="#ccc" strokeWidth={0.5} />

        {/* 扇区 */}
        {BAND_CONFIG.map((band) =>
          DIRECTIONS.map((dir) => {
            const key: RoseSectorKey = `${band.id}_${dir}`;
            const startAngle = getDirectionAngle(dir);
            const path = generateSectorPath(cx, cy, band.r1, band.r2, startAngle, startAngle + 45);
            const isSelected = sectorsSet.has(key);

            return (
              <path
                key={key}
                d={path}
                className={`rose-sec ${isSelected ? fillClass : 'fill-base'}`}
                onClick={() => handleClick(key)}
                style={{ cursor: editable ? 'pointer' : 'default' }}
              />
            );
          })
        )}

        {/* 北方标记 */}
        <text x={50} y={8} fontSize={8} fill="#aaa" textAnchor="middle">
          N
        </text>
      </svg>
    </div>
  );
}
