import type { DangerLevel } from '../types';

// 5x5 风险矩阵: [Likelihood 5..1][Size 1..5]
// 行：从上到下是 5(Certain) 到 1(Unlikely)
// 列：从左到右是 1(Small) 到 5(Catastrophic)
export const RISK_MATRIX: DangerLevel[][] = [
  [3, 4, 4, 5, 5], // 5 Certain
  [2, 3, 4, 4, 5], // 4 Very Likely
  [2, 3, 3, 4, 4], // 3 Likely
  [1, 2, 3, 3, 4], // 2 Possible
  [1, 1, 2, 3, 3], // 1 Unlikely
];

// 根据可能性和规模计算危险等级
export function getRiskLevel(likelihood: number, size: number): DangerLevel {
  const row = 5 - likelihood; // 转换为矩阵行索引
  const col = size - 1;       // 转换为矩阵列索引
  return RISK_MATRIX[row][col];
}
