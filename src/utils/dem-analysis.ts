/**
 * 运行时 DEM 坡度/朝向查询模块
 *
 * 懒加载预计算的坡度和朝向二进制数据，
 * 提供坐标→地形属性的精确查询（双线性插值）。
 */

// DEM 元数据（与 jikepulin-dem.json 一致）
const DEM_META = {
  width: 1082,
  height: 1081,
  west: 87.37694444444445,
  east: 87.6775,
  south: 48.43472222222222,
  north: 48.735,
  pixelWidth: 0.0002777777777777778,
  pixelHeight: 0.0002777777777777778,
};

// 朝向标签映射
const ASPECT_LABELS: Record<string, [number, number]> = {
  N:  [337.5, 22.5],
  NE: [22.5, 67.5],
  E:  [67.5, 112.5],
  SE: [112.5, 157.5],
  S:  [157.5, 202.5],
  SW: [202.5, 247.5],
  W:  [247.5, 292.5],
  NW: [292.5, 337.5],
};

function getAspectLabel(deg: number): string {
  if (deg < 0) return '平坦';
  for (const [label, [min, max]] of Object.entries(ASPECT_LABELS)) {
    if (label === 'N') {
      if (deg >= 337.5 || deg < 22.5) return 'N';
    } else if (deg >= min && deg < max) {
      return label;
    }
  }
  return 'N';
}

// 缓存加载的二进制数据
let slopeData: Float32Array | null = null;
let aspectData: Float32Array | null = null;
let loadingPromise: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (slopeData && aspectData) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const [slopeResp, aspectResp] = await Promise.all([
      fetch('/terrain/slope-data.bin'),
      fetch('/terrain/aspect-data.bin'),
    ]);

    if (!slopeResp.ok || !aspectResp.ok) {
      throw new Error('无法加载地形分析数据，请先运行 npm run compute-terrain');
    }

    const [slopeBuf, aspectBuf] = await Promise.all([
      slopeResp.arrayBuffer(),
      aspectResp.arrayBuffer(),
    ]);

    slopeData = new Float32Array(slopeBuf);
    aspectData = new Float32Array(aspectBuf);
  })();

  return loadingPromise;
}

/**
 * 坐标→像素映射（返回浮点像素坐标）
 */
function coordToPixel(lat: number, lng: number): { px: number; py: number } | null {
  if (
    lng < DEM_META.west || lng > DEM_META.east ||
    lat < DEM_META.south || lat > DEM_META.north
  ) {
    return null;
  }

  // DEM 数据行方向是 north→south（第 0 行 = 最北）
  const px = (lng - DEM_META.west) / DEM_META.pixelWidth;
  const py = (DEM_META.north - lat) / DEM_META.pixelHeight;

  return { px, py };
}

/**
 * 双线性插值
 */
function bilinearSample(data: Float32Array, px: number, py: number): number {
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const x1 = Math.min(x0 + 1, DEM_META.width - 1);
  const y1 = Math.min(y0 + 1, DEM_META.height - 1);

  const fx = px - x0;
  const fy = py - y0;

  const v00 = data[y0 * DEM_META.width + x0];
  const v10 = data[y0 * DEM_META.width + x1];
  const v01 = data[y1 * DEM_META.width + x0];
  const v11 = data[y1 * DEM_META.width + x1];

  return (
    v00 * (1 - fx) * (1 - fy) +
    v10 * fx * (1 - fy) +
    v01 * (1 - fx) * fy +
    v11 * fx * fy
  );
}

export interface TerrainQueryResult {
  slope: number;       // 坡度（度）
  aspect: number;      // 朝向（度，-1 表示平坦）
  aspectLabel: string; // 朝向标签 (N/NE/E/SE/S/SW/W/NW/平坦)
}

/**
 * 查询指定坐标的坡度和朝向
 *
 * @param lat 纬度
 * @param lng 经度
 * @returns 坡度/朝向信息，或 null（坐标超出 DEM 范围）
 */
export async function queryTerrainAt(
  lat: number,
  lng: number
): Promise<TerrainQueryResult | null> {
  await ensureLoaded();

  const pixel = coordToPixel(lat, lng);
  if (!pixel || !slopeData || !aspectData) return null;

  const slope = bilinearSample(slopeData, pixel.px, pixel.py);
  const aspect = bilinearSample(aspectData, pixel.px, pixel.py);

  return {
    slope: Math.round(slope * 10) / 10,
    aspect: aspect < 0 ? -1 : Math.round(aspect * 10) / 10,
    aspectLabel: getAspectLabel(aspect),
  };
}

/**
 * 检查地形分析数据是否可用
 */
export async function isTerrainAnalysisAvailable(): Promise<boolean> {
  try {
    await ensureLoaded();
    return slopeData !== null && aspectData !== null;
  } catch {
    return false;
  }
}
