/**
 * 稳定性测试标签格式化工具
 */

interface TestLabelInput {
  type: string;
  taps?: number | string;
  result?: string;
  quality?: string;
  cut?: number | string;
  length?: number | string;
  propagation?: string;
  score?: number | string;
}

/**
 * 生成测试摘要标签
 *
 * - CT:  结果码后缀(E/M/H/N) + 敲击次数 + 剪切质量 → "CTE13Q1"
 * - ECT: PV 为独立码输出 "PV"；其余 → "ECTP12"
 * - PST: 切入长度/柱长 + 传播 → "PST20/100END"
 * - RB:  评分 + 剪切质量 → "RB3Q2"
 * - DTT: "DTT" + 结果 → "DTTPass"
 * - 槽口测试: "槽口" + 结果 → "槽口Pass"
 */
export function formatTestLabel(test: TestLabelInput): string {
  switch (test.type) {
    case 'CT': {
      // 结果如 "CTE" → 取后缀 "E"；拼接为 CTE13Q1
      const ctSuffix = test.result?.replace('CT', '') || '';
      return `CT${ctSuffix}${test.taps || ''}${test.quality || ''}`;
    }
    case 'ECT': {
      // PV 是独立结果码（渐进压缩无裂缝传播），不附带敲击次数
      if (test.result === 'PV') {
        return 'PV';
      }
      const ectResult = test.result?.replace('ECT', '') || '';
      return `ECT${ectResult}${test.taps || ''}`;
    }
    case 'PST': {
      const pstInfo = test.cut && test.length ? `${test.cut}/${test.length}` : '';
      return `PST${pstInfo}${test.propagation || ''}`;
    }
    case 'RB':
      return `${test.score || 'RB'}${test.quality || ''}`;
    case 'DTT':
      return `DTT${test.result || ''}`;
    case '槽口测试':
      return `槽口${test.result || ''}`;
    default:
      return test.type;
  }
}
