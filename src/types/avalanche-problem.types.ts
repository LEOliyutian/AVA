import type { RoseSectorKey } from './forecast.types';

// 雪崩问题类型
export type AvalancheProblemType =
  | '风板雪崩 (Wind Slab)'
  | '新雪板状雪崩 (Storm Slab)'
  | '持久层板状雪崩 (Persistent Slab)'
  | '深层持久层雪崩 (Deep Persistent Slab)'
  | '干松状雪崩 (Loose Dry)'
  | '湿松状雪崩 (Loose Wet)'
  | '湿板状雪崩 (Wet Slab)';

// 可能性等级 1-5
export type LikelihoodLevel = 1 | 2 | 3 | 4 | 5;

// 规模等级 1-5
export type SizeLevel = 1 | 2 | 3 | 4 | 5;

// 雪崩问题
export interface AvalancheProblem {
  type: AvalancheProblemType;
  likelihood: LikelihoodLevel;
  size: SizeLevel;
  sectors: Set<RoseSectorKey>;
  description: string;
}

// 雪崩问题用于序列化的版本（Set -> Array）
export interface SerializedAvalancheProblem {
  type: AvalancheProblemType;
  likelihood: LikelihoodLevel;
  size: SizeLevel;
  sectors: RoseSectorKey[];
  description: string;
}
