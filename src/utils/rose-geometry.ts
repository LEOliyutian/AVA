import type { ElevationBand, Direction } from '../types';

// 海拔带配置（内圈到外圈）
export const BAND_CONFIG: { id: ElevationBand; r1: number; r2: number }[] = [
  { id: 'alp', r1: 5, r2: 20 },  // 内圈 - 高山带
  { id: 'tl', r1: 20, r2: 35 }, // 中圈 - 林线
  { id: 'btl', r1: 35, r2: 49 }, // 外圈 - 林线下
];

// 方向列表（顺时针从北开始）
export const DIRECTIONS: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/**
 * 将角度转换为弧度
 */
function degToRad(angle: number): number {
  return ((angle - 90) * Math.PI) / 180;
}

/**
 * 计算圆上的点坐标
 */
function polarToCart(cx: number, cy: number, radius: number, angle: number): { x: number; y: number } {
  const rad = degToRad(angle);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/**
 * 生成扇形的 SVG path
 */
export function generateSectorPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const start1 = polarToCart(cx, cy, outerRadius, endAngle);
  const end1 = polarToCart(cx, cy, outerRadius, startAngle);
  const start2 = polarToCart(cx, cy, innerRadius, endAngle);
  const end2 = polarToCart(cx, cy, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${start1.x} ${start1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end1.x} ${end1.y}`,
    `L ${end2.x} ${end2.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${start2.x} ${start2.y}`,
    'Z',
  ].join(' ');
}

/**
 * 获取方向对应的起始角度
 */
export function getDirectionAngle(direction: Direction): number {
  const index = DIRECTIONS.indexOf(direction);
  return index * 45 - 90 - 22.5;
}
