import type { AvalancheProblemType, LikelihoodLevel, SizeLevel } from '../types';

// 雪崩问题类型选项
export const AVALANCHE_PROBLEM_TYPES: AvalancheProblemType[] = [
  '风板雪崩 (Wind Slab)',
  '新雪板状雪崩 (Storm Slab)',
  '持久层板状雪崩 (Persistent Slab)',
  '深层持久层雪崩 (Deep Persistent Slab)',
  '干松状雪崩 (Loose Dry)',
  '湿松状雪崩 (Loose Wet)',
  '湿板状雪崩 (Wet Slab)',
];

// 可能性选项
export const LIKELIHOOD_OPTIONS: { value: LikelihoodLevel; label: string }[] = [
  { value: 1, label: '1 不太可能 (Unlikely)' },
  { value: 2, label: '2 可能 (Possible)' },
  { value: 3, label: '3 很可能 (Likely)' },
  { value: 4, label: '4 非常可能 (Very Likely)' },
  { value: 5, label: '5 确定 (Certain)' },
];

// 规模选项
export const SIZE_OPTIONS: { value: SizeLevel; label: string }[] = [
  { value: 1, label: '1 小型 (Small)' },
  { value: 2, label: '2 大型 (Large)' },
  { value: 3, label: '3 非常大 (Very Large)' },
  { value: 4, label: '4 历史级 (Historic)' },
  { value: 5, label: '5 灾难级 (Catastrophic)' },
];

// 可能性文本映射
export const LIKELIHOOD_TEXT: Record<LikelihoodLevel, string> = {
  1: '不太可能 Unlikely',
  2: '可能 Possible',
  3: '很可能 Likely',
  4: '非常可能 Very Likely',
  5: '确定 Certain',
};

// 获取雪崩问题的中文名称
export function getProblemTypeName(type: AvalancheProblemType): string {
  return type.split(' (')[0];
}
