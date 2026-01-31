import type { DangerLevel, DangerConfig, DangerTrend, TrendConfig } from '../types';

// 危险等级颜色
export const DANGER_COLORS: Record<DangerLevel, string> = {
  1: '#5cb85c',
  2: '#f0ad4e',
  3: '#ff9800',
  4: '#d9534f',
  5: '#292b2c',
};

// 危险等级标签
export const DANGER_LABELS: Record<DangerLevel, string> = {
  1: '1 低风险 Low',
  2: '2 中等风险 Moderate',
  3: '3 较高风险 Considerable',
  4: '4 高风险 High',
  5: '5 极高风险 Extreme',
};

// 危险等级描述
export const DANGER_DESCRIPTIONS: Record<DangerLevel, string> = {
  1: '总体安全。留意局部地形的不稳定积雪。(Generally safe. Watch for isolated unstable snow.)',
  2: '特定地形风险增加。需仔细评估雪质和地形。(Heightened conditions. Evaluate snow and terrain carefully.)',
  3: '危险条件。必须谨慎评估雪层结构。(Dangerous conditions. Careful snowpack evaluation essential.)',
  4: '非常危险。不建议进入雪崩地形。(Very dangerous. Travel in avalanche terrain not recommended.)',
  5: '避免所有雪崩地形。(Avoid all avalanche terrain.)',
};

// 风险定义（触发概率和后果）
export const RISK_DEFINITIONS: Record<DangerLevel, { prob: string; cons: string }> = {
  1: { prob: '极难触发', cons: '小型雪崩 (Size 1)' },
  2: { prob: '人为可能触发', cons: '小型 - 大型 (Size 1-2)' },
  3: { prob: '人为很可能触发', cons: '大型/致命 (Size 2-3)' },
  4: { prob: '自然/人为极易触发', cons: '大型 - 巨型 (Size 3-4)' },
  5: { prob: '自然确定发生', cons: '巨型 - 灾难级 (Size 4-5)' },
};

// 趋势配置
export const TREND_CONFIG: Record<DangerTrend, TrendConfig> = {
  steady: { text: '➡ 持平 Steady', color: '#555', background: '#eee' },
  rising: { text: '⬆ 增加 Rising', color: '#d9534f', background: '#fce8e6' },
  falling: { text: '⬇ 下降 Falling', color: '#27ae60', background: '#e8f8f5' },
};

// 完整的危险等级配置
export const DANGER_CONFIG: Record<DangerLevel, DangerConfig> = {
  1: {
    color: DANGER_COLORS[1],
    label: DANGER_LABELS[1],
    description: DANGER_DESCRIPTIONS[1],
    prob: RISK_DEFINITIONS[1].prob,
    cons: RISK_DEFINITIONS[1].cons,
  },
  2: {
    color: DANGER_COLORS[2],
    label: DANGER_LABELS[2],
    description: DANGER_DESCRIPTIONS[2],
    prob: RISK_DEFINITIONS[2].prob,
    cons: RISK_DEFINITIONS[2].cons,
  },
  3: {
    color: DANGER_COLORS[3],
    label: DANGER_LABELS[3],
    description: DANGER_DESCRIPTIONS[3],
    prob: RISK_DEFINITIONS[3].prob,
    cons: RISK_DEFINITIONS[3].cons,
  },
  4: {
    color: DANGER_COLORS[4],
    label: DANGER_LABELS[4],
    description: DANGER_DESCRIPTIONS[4],
    prob: RISK_DEFINITIONS[4].prob,
    cons: RISK_DEFINITIONS[4].cons,
  },
  5: {
    color: DANGER_COLORS[5],
    label: DANGER_LABELS[5],
    description: DANGER_DESCRIPTIONS[5],
    prob: RISK_DEFINITIONS[5].prob,
    cons: RISK_DEFINITIONS[5].cons,
  },
};
