import { useState } from 'react';
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
  const [uid] = useState(() => Math.random().toString(36).slice(2, 8));
  const gradId = `rg-${uid}`;
  const hlId = `rh-${uid}`;

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
    <div className="rose-diagram-wrapper" style={{ width: size, height: size }}>
      <svg viewBox="-2 -2 104 104" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id={gradId} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef0f4" />
          </radialGradient>
          <radialGradient id={hlId} cx="38%" cy="28%" r="45%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 背景圆和辅助线 */}
        <circle cx={cx} cy={cy} r={49} fill={`url(#${gradId})`} stroke="#c0c5cf" strokeWidth={0.8} />
        <circle cx={cx} cy={cy} r={35} fill="none" stroke="#cfd4dc" strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={20} fill="none" stroke="#cfd4dc" strokeWidth={0.5} />

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

        {/* 高光覆盖 - 3D 凸起效果 */}
        <ellipse cx={42} cy={36} rx={30} ry={25} fill={`url(#${hlId})`} pointerEvents="none" />

        {/* 方向标记 - 四个主方向 */}
        <text x={50} y={6} fontSize={8} fill="#555" fontWeight="700" textAnchor="middle">N</text>
        <text x={50} y={99} fontSize={8} fill="#555" fontWeight="700" textAnchor="middle">S</text>
        <text x={97} y={53} fontSize={8} fill="#555" fontWeight="700" textAnchor="middle">E</text>
        <text x={3} y={53} fontSize={8} fill="#555" fontWeight="700" textAnchor="middle">W</text>
      </svg>
    </div>
  );
}
