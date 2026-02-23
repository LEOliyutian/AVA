/**
 * GPS 坐标解析和格式化工具
 */

export interface GpsCoordinate {
  lat: number;
  lng: number;
}

/**
 * 解析 GPS 字符串为坐标对象
 * 支持格式：
 *   "N43.5678, E87.1234"
 *   "43.5678, 87.1234"
 *   "43.5678°N, 87.1234°E"
 */
export function parseGpsString(gps: string): GpsCoordinate | null {
  if (!gps || !gps.trim()) return null;

  const cleaned = gps.trim();

  // Format: N43.5678, E87.1234
  const neMatch = cleaned.match(
    /[Nn]\s*([\d.]+)\s*[,，]\s*[Ee]\s*([\d.]+)/
  );
  if (neMatch) {
    return { lat: parseFloat(neMatch[1]), lng: parseFloat(neMatch[2]) };
  }

  // Format: 43.5678°N, 87.1234°E
  const degMatch = cleaned.match(
    /([\d.]+)\s*°?\s*[Nn]\s*[,，]\s*([\d.]+)\s*°?\s*[Ee]/
  );
  if (degMatch) {
    return { lat: parseFloat(degMatch[1]), lng: parseFloat(degMatch[2]) };
  }

  // Format: 43.5678, 87.1234 (plain decimal)
  const plainMatch = cleaned.match(
    /([\d.]+)\s*[,，]\s*([\d.]+)/
  );
  if (plainMatch) {
    const a = parseFloat(plainMatch[1]);
    const b = parseFloat(plainMatch[2]);
    // Heuristic: China latitudes 18-54, longitudes 73-136
    if (a >= 18 && a <= 54 && b >= 73 && b <= 136) {
      return { lat: a, lng: b };
    }
    if (b >= 18 && b <= 54 && a >= 73 && a <= 136) {
      return { lat: b, lng: a };
    }
    // Fallback: first is lat, second is lng
    return { lat: a, lng: b };
  }

  return null;
}

/**
 * 格式化坐标为显示字符串
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${latDir}${Math.abs(lat).toFixed(4)}°, ${lngDir}${Math.abs(lng).toFixed(4)}°`;
}

/**
 * 计算两点间距离（km）- Haversine 公式
 */
export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
