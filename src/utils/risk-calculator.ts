import type { DangerLevel, ElevationBand, RoseSectorKey, AvalancheProblem } from '../types';
import { getRiskLevel } from '../config';

interface CalculatedRisk {
  alp: DangerLevel;
  tl: DangerLevel;
  btl: DangerLevel;
}

/**
 * 检查扇区集合中是否包含特定海拔带的扇区
 */
function hasSectorsInBand(sectors: Set<RoseSectorKey>, band: ElevationBand): boolean {
  for (const sector of sectors) {
    if (sector.startsWith(band)) {
      return true;
    }
  }
  return false;
}

/**
 * 计算各海拔带的危险等级
 */
export function calculateRisk(
  primaryProblem: AvalancheProblem,
  secondaryProblem: AvalancheProblem | null,
  secondaryEnabled: boolean
): CalculatedRisk {
  const bands: ElevationBand[] = ['alp', 'tl', 'btl'];
  const result: CalculatedRisk = { alp: 1, tl: 1, btl: 1 };

  // 计算主要问题的风险等级
  const primaryRisk = getRiskLevel(primaryProblem.likelihood, primaryProblem.size);

  // 计算次要问题的风险等级
  const secondaryRisk = secondaryProblem && secondaryEnabled
    ? getRiskLevel(secondaryProblem.likelihood, secondaryProblem.size)
    : 1;

  for (const band of bands) {
    let maxRisk: DangerLevel = 1;

    // 检查主要问题是否影响该海拔带
    if (hasSectorsInBand(primaryProblem.sectors, band)) {
      maxRisk = Math.max(maxRisk, primaryRisk) as DangerLevel;
    }

    // 检查次要问题是否影响该海拔带
    if (secondaryEnabled && secondaryProblem && hasSectorsInBand(secondaryProblem.sectors, band)) {
      maxRisk = Math.max(maxRisk, secondaryRisk) as DangerLevel;
    }

    result[band] = maxRisk;
  }

  return result;
}
