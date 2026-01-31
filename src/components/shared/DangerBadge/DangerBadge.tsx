import type { DangerLevel } from '../../../types';
import { DANGER_COLORS, DANGER_LABELS } from '../../../config';
import './DangerBadge.css';

interface DangerBadgeProps {
  level: DangerLevel;
  variant?: 'full' | 'mini';
}

export function DangerBadge({ level, variant = 'full' }: DangerBadgeProps) {
  const color = DANGER_COLORS[level];
  const textColor = level === 2 ? '#333' : 'white';
  const label = DANGER_LABELS[level];

  if (variant === 'mini') {
    return (
      <span
        className="mini-badge"
        style={{ backgroundColor: color, color: textColor }}
      >
        {level}
      </span>
    );
  }

  // 提取简短标签（如 "低风险 Low"）
  const shortLabel = label.split(' ').slice(1).join(' ');

  return (
    <div
      className="db-badge"
      style={{ backgroundColor: color, color: textColor }}
    >
      {level} {shortLabel.split(' ')[0]}
    </div>
  );
}
