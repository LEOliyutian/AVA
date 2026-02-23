import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useMapStore } from '../../store/map.store';
import type { BaseMap } from '../../store/map.store';
import type { AvalancheEvent } from '../../types/avalanche-event';
import { AVALANCHE_SIZE_COLORS } from '../../types/avalanche-event';
import { parseGpsString } from '../../utils/geo';
import { queryTerrainAt } from '../../utils/dem-analysis';

// 全局 viewer 引用，供摄像机控制等外部组件使用
let _globalViewer: Cesium.Viewer | null = null;
export function getMapViewer(): Cesium.Viewer | null {
  return _globalViewer;
}

// 用户自定义 token 优先，否则保留 Cesium 包自带的默认 token
const USER_TOKEN = import.meta.env.VITE_CESIUM_TOKEN;
if (USER_TOKEN) {
  Cesium.Ion.defaultAccessToken = USER_TOKEN;
}
// Cesium 1.138 自带 defaultAccessToken，可直接用于加载 World Terrain

// 自定义高精度 DEM（上传到 Cesium Ion 后获得的 Asset ID）
const CUSTOM_TERRAIN_ASSET_ID = import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID;

const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || '6c99c7793f41fccc4a55600635a2f938';

// 吉克普林滑雪场坐标（新疆阿勒泰禾木, GCJ02→WGS84 近似）
const JIKEPULIN_CENTER = {
  longitude: 87.527,
  latitude: 48.585,
  height: 8000,
};

// DEM 覆盖范围（与 jikepulin-dem.json 一致）
const DEM_BOUNDS = {
  west: 87.37694444444445,
  east: 87.6775,
  south: 48.43472222222222,
  north: 48.735,
};

export const HOME_VIEW = {
  destination: Cesium.Cartesian3.fromDegrees(
    JIKEPULIN_CENTER.longitude,
    JIKEPULIN_CENTER.latitude,
    JIKEPULIN_CENTER.height
  ),
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-40),
    roll: 0,
  },
};

// 雪坑观测数据接口（地图使用的最小字段集）
export interface MapObservation {
  id: number;
  location?: string | null;
  observer?: string | null;
  date?: string | null;
  gps_coordinates?: string | null;
}

interface AvalancheMapProps {
  observations?: MapObservation[];
}

export function AvalancheMap({ observations = [] }: AvalancheMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const baseLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const isFirstBaseMapRender = useRef(true);
  const eventDataSourceRef = useRef<Cesium.CustomDataSource | null>(null);
  const pitDataSourceRef = useRef<Cesium.CustomDataSource | null>(null);
  const analysisLayerRef = useRef<Cesium.ImageryLayer | null>(null);

  const {
    activeAnalysisLayer,
    baseMap,
    showAvalancheEvents,
    showSnowPits,
    showSkiRuns,
    terrainExaggeration,
    avalancheEvents,
    setTerrainInfo,
  } = useMapStore();

  // 初始化 Cesium Viewer
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // ① 创建 Viewer，baseLayer: false 表示先不加任何底图
    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayer: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      animation: false,
      fullscreenButton: false,
      vrButton: false,
      navigationHelpButton: false,
      infoBox: false,
      creditContainer: document.createElement('div'),
    });

    // ② 添加底图（默认 ArcGIS 卫星影像）
    const baseLayer = new Cesium.ImageryLayer(
      createBaseMapProvider('arcgis')
    );
    viewer.imageryLayers.add(baseLayer);
    baseLayerRef.current = baseLayer;

    // ③ 叠加天地图中文标注
    viewer.imageryLayers.add(
      new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: `https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_TOKEN}`,
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maximumLevel: 18,
        })
      )
    );

    // ④ 叠加 OpenSnowMap 雪道/缆车图层
    const skiLayer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png',
        maximumLevel: 16,
        credit: '(c) www.opensnowmap.org CC-BY-SA',
      })
    );
    viewer.imageryLayers.add(skiLayer);
    // 保存引用以便 toggle
    (viewer as any).__skiLayer = skiLayer;

    // ④ 加载地形高程数据
    // 优先使用自定义 Copernicus DEM (10m/30m)，否则回退到 Cesium World Terrain (~30m)
    loadTerrain(viewer);

    // 开启地形深度测试（标记不会沉入地形下方）
    viewer.scene.globe.depthTestAgainstTerrain = true;

    // 启用光照，增强 3D 立体感
    viewer.scene.globe.enableLighting = true;

    // === 渲染质量优化 ===

    // 1. HiDPI 适配：限制最大 2x，避免 3x 屏幕 9 倍像素渲染导致卡顿
    viewer.resolutionScale = Math.min(window.devicePixelRatio, 2);

    // 2. MSAA 硬件多重采样（需 WebGL2）— 优先使用，比 FXAA 效果更好
    viewer.scene.msaaSamples = 4;
    // 有 MSAA 时关闭 FXAA 避免重复抗锯齿的性能浪费
    viewer.scene.postProcessStages.fxaa.enabled = false;

    // 3. 地形网格精细度：1.5 兼顾质量与性能（默认 2.0，之前 0.75 过于激进）
    viewer.scene.globe.maximumScreenSpaceError = 1.5;

    // 4. 预加载相邻瓦片，减少缩放/旋转时的空白闪烁
    viewer.scene.globe.preloadSiblings = true;
    viewer.scene.globe.tileCacheSize = 1000;

    // 5. HDR + 更好的光照效果
    viewer.scene.highDynamicRange = true;

    // 6. 提升影像瓦片精细度
    viewer.scene.globe.imageryMaximumScreenSpaceError = 1.5;

    // 飞到吉克普林滑雪场（新疆天山），俯视 45° 可直观看到山体起伏
    viewer.camera.flyTo({ ...HOME_VIEW, duration: 2 });

    // 创建数据源
    const eventDS = new Cesium.CustomDataSource('avalanche-events');
    const pitDS = new Cesium.CustomDataSource('snow-pits');
    viewer.dataSources.add(eventDS);
    viewer.dataSources.add(pitDS);
    eventDataSourceRef.current = eventDS;
    pitDataSourceRef.current = pitDS;

    viewerRef.current = viewer;
    _globalViewer = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
      _globalViewer = null;
    };
  }, []);

  // 底图切换
  useEffect(() => {
    // 跳过初始渲染（init effect 已经创建了默认底图）
    if (isFirstBaseMapRender.current) {
      isFirstBaseMapRender.current = false;
      return;
    }
    const viewer = viewerRef.current;
    if (!viewer) return;

    const layers = viewer.imageryLayers;
    const newLayer = new Cesium.ImageryLayer(createBaseMapProvider(baseMap));

    // 在最底层插入新底图，然后移除旧底图
    layers.add(newLayer, 0);
    if (baseLayerRef.current) {
      layers.remove(baseLayerRef.current);
    }
    baseLayerRef.current = newLayer;
  }, [baseMap]);

  // 坡度/朝向/等高线分析图层
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // 清理旧的叠加图层
    if (analysisLayerRef.current) {
      viewer.imageryLayers.remove(analysisLayerRef.current);
      analysisLayerRef.current = null;
    }

    // slope 和 aspect 使用预计算 PNG 叠加，其他保持 globe material
    if (activeAnalysisLayer === 'slope' || activeAnalysisLayer === 'aspect') {
      viewer.scene.globe.material = undefined as unknown as Cesium.Material;
      const imageName = activeAnalysisLayer === 'slope' ? 'slope.png' : 'aspect.png';
      try {
        const provider = new Cesium.SingleTileImageryProvider({
          url: `/terrain/${imageName}`,
          rectangle: Cesium.Rectangle.fromDegrees(
            DEM_BOUNDS.west, DEM_BOUNDS.south,
            DEM_BOUNDS.east, DEM_BOUNDS.north
          ),
        });
        const layer = new Cesium.ImageryLayer(provider, { alpha: 0.7 });
        viewer.imageryLayers.add(layer);
        analysisLayerRef.current = layer;
      } catch (err) {
        console.warn(`加载 ${imageName} 失败，回退到 globe material:`, err);
        viewer.scene.globe.material = activeAnalysisLayer === 'slope'
          ? createSlopeMaterial()
          : createAspectMaterial();
      }
    } else {
      switch (activeAnalysisLayer) {
        case 'avalanche-zone':
          viewer.scene.globe.material = createAvalancheZoneMaterial();
          break;
        case 'contour':
          viewer.scene.globe.material = createContourMaterial();
          break;
        case 'slope-contour':
          viewer.scene.globe.material = createSlopeContourMaterial();
          break;
        default:
          viewer.scene.globe.material = undefined as unknown as Cesium.Material;
      }
    }

    // 切换图层时清除地形查询浮窗
    setTerrainInfo(null);
  }, [activeAnalysisLayer, setTerrainInfo]);

  // 雪道/缆车图层显隐
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const skiLayer = (viewer as any).__skiLayer as Cesium.ImageryLayer | undefined;
    if (skiLayer) {
      skiLayer.show = showSkiRuns;
    }
  }, [showSkiRuns]);

  // 地形夸张度（Cesium 1.107+ 使用 scene.verticalExaggeration）
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.scene.verticalExaggeration = terrainExaggeration;
  }, [terrainExaggeration]);

  // 渲染雪崩事件标记
  useEffect(() => {
    const ds = eventDataSourceRef.current;
    if (!ds) return;

    ds.entities.removeAll();
    if (!showAvalancheEvents) return;

    avalancheEvents.forEach((event) => {
      addAvalancheEventEntity(ds, event);
    });
  }, [avalancheEvents, showAvalancheEvents]);

  // 渲染雪坑标记
  useEffect(() => {
    const ds = pitDataSourceRef.current;
    if (!ds) return;

    ds.entities.removeAll();
    if (!showSnowPits) return;

    observations.forEach((obs) => {
      const coord = parseGpsString(obs.gps_coordinates || '');
      if (!coord) return;

      const groundPos = Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat);
      const abovePos = Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat, LEADER_LINE_HEIGHT);

      // 标线
      ds.entities.add({
        position: groundPos,
        polyline: {
          positions: [groundPos, abovePos],
          width: 1.5,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#3498db').withAlpha(0.5)),
          clampToGround: false,
        },
        properties: { type: 'leader-line' },
      } as Cesium.Entity.ConstructorOptions);

      // 图标（相对地面高度，跟随地形）
      ds.entities.add({
        position: Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat, LEADER_LINE_HEIGHT),
        billboard: {
          image: createSnowPitIcon(),
          width: 28,
          height: 28,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: obs.location || '雪坑',
          font: '12px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -32),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        properties: {
          type: 'snow-pit',
          observationId: obs.id,
        },
      } as Cesium.Entity.ConstructorOptions);
    });
  }, [observations, showSnowPits]);

  // 绑定点击 + 悬浮事件（只创建一次 handler，通过 store.getState() 读取实时状态）
  const clickedEntityRef = useRef<Cesium.Entity | null>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 恢复上一个被点击放大的实体到原始尺寸
    function restoreClickedEntity() {
      const prev = clickedEntityRef.current;
      if (prev?.billboard) {
        const props = prev.properties;
        const type = props?.type?.getValue(Cesium.JulianDate.now());
        if (type === 'avalanche-event') {
          prev.billboard.width = new Cesium.ConstantProperty(32);
          prev.billboard.height = new Cesium.ConstantProperty(32);
        } else if (type === 'snow-pit') {
          prev.billboard.width = new Cesium.ConstantProperty(28);
          prev.billboard.height = new Cesium.ConstantProperty(28);
        }
      }
      clickedEntityRef.current = null;
    }

    // 点击放大实体
    function enlargeEntity(entity: Cesium.Entity) {
      if (!entity.billboard) return;
      const props = entity.properties;
      const type = props?.type?.getValue(Cesium.JulianDate.now());
      if (type === 'avalanche-event') {
        entity.billboard.width = new Cesium.ConstantProperty(44);
        entity.billboard.height = new Cesium.ConstantProperty(44);
      } else if (type === 'snow-pit') {
        entity.billboard.width = new Cesium.ConstantProperty(38);
        entity.billboard.height = new Cesium.ConstantProperty(38);
      }
      clickedEntityRef.current = entity;
    }

    // --- LEFT_CLICK ---
    handler.setInputAction(
      (click: { position: Cesium.Cartesian2 }) => {
        const state = useMapStore.getState();

        // 阻止 Cesium 默认的实体选中行为
        viewer.selectedEntity = undefined;

        // ① 优先检测实体点击（必须在 globe.pick 之前，因为点击浮空图标时 globe.pick 可能返回 null）
        if (state.editMode === 'none') {
          const picked = viewer.scene.pick(click.position);
          if (Cesium.defined(picked) && picked.id instanceof Cesium.Entity) {
            const entity = picked.id as Cesium.Entity;
            const props = entity.properties;
            const entityType = props?.type?.getValue(Cesium.JulianDate.now());

            if (entityType === 'avalanche-event') {
              const eventId = props.eventId.getValue(Cesium.JulianDate.now());
              const event = state.avalancheEvents.find((e) => e.id === eventId);
              if (event) {
                state.setSelectedSnowpit(null);
                state.setSelectedEvent(event);
                restoreClickedEntity();
                enlargeEntity(entity);
              }
              return;
            } else if (entityType === 'snow-pit') {
              const observationId = props.observationId.getValue(Cesium.JulianDate.now());
              if (observationId) {
                state.setSelectedEvent(null);
                state.fetchSnowpitDetail(observationId);
                restoreClickedEntity();
                enlargeEntity(entity);
              }
              return;
            }
          }
        }

        // ② globe pick（地面坐标）
        const ray = viewer.camera.getPickRay(click.position);
        if (!ray) return;
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (!cartesian) return;

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);

        if (state.editMode !== 'none') {
          // 编辑模式：设置坐标并查询坡度/朝向自动填充
          Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic])
            .then(async (updated) => {
              const elevation = updated[0]?.height || 0;
              const terrain = await queryTerrainAt(lat, lng);
              state.setPendingCoordinate({
                lat,
                lng,
                elevation,
                slopeAngle: terrain?.slope,
                aspect: terrain?.aspectLabel !== '平坦' ? terrain?.aspectLabel : undefined,
              });
            });
        } else {
          // 点击空白区域：关闭所有面板，恢复图标尺寸
          restoreClickedEntity();
          state.setSelectedEvent(null);
          state.setSelectedSnowpit(null);

          // 分析图层激活时：显示地形查询浮窗
          const layer = state.activeAnalysisLayer;
          const isAnalysisActive = layer === 'slope' || layer === 'aspect' ||
            layer === 'avalanche-zone' || layer === 'slope-contour';

          if (isAnalysisActive) {
            Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic])
              .then(async (updated) => {
                const elevation = updated[0]?.height || 0;
                const terrain = await queryTerrainAt(lat, lng);
                if (terrain) {
                  state.setTerrainInfo({
                    lat, lng, elevation,
                    slope: terrain.slope,
                    aspect: terrain.aspect,
                    aspectLabel: terrain.aspectLabel,
                    screenX: click.position.x,
                    screenY: click.position.y,
                  });
                }
              });
          }
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    // --- MOUSE_MOVE: 仅切换光标样式（不再放大图标） ---
    handler.setInputAction(
      (move: { endPosition: Cesium.Cartesian2 }) => {
        const state = useMapStore.getState();

        if (state.editMode !== 'none') {
          viewer.canvas.style.cursor = 'crosshair';
          return;
        }

        const picked = viewer.scene.pick(move.endPosition);
        if (Cesium.defined(picked) && picked.id instanceof Cesium.Entity) {
          const props = (picked.id as Cesium.Entity).properties;
          const type = props?.type?.getValue(Cesium.JulianDate.now());
          if (type === 'avalanche-event' || type === 'snow-pit') {
            viewer.canvas.style.cursor = 'pointer';
            return;
          }
        }
        viewer.canvas.style.cursor = 'default';
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );

    return () => handler.destroy();
  }, []); // 空依赖 — handler 只创建一次，状态通过 getState() 读取

  return <div ref={containerRef} className="cesium-container" />;
}

// === 地形加载 ===

async function loadTerrain(viewer: Cesium.Viewer) {
  // 优先级 1: Cesium Ion 自定义资产（上传 Copernicus DEM 后获得，带法线，支持坡度/朝向分析）
  if (CUSTOM_TERRAIN_ASSET_ID) {
    try {
      const terrain = await Cesium.CesiumTerrainProvider.fromIonAssetId(
        Number(CUSTOM_TERRAIN_ASSET_ID),
        { requestVertexNormals: true }
      );
      if (!viewer.isDestroyed()) {
        viewer.terrainProvider = terrain;
        console.log('地形: Cesium Ion 自定义资产, ID:', CUSTOM_TERRAIN_ASSET_ID);
        return;
      }
    } catch (err) {
      console.warn('Cesium Ion 自定义地形加载失败，回退 World Terrain:', err);
    }
  }

  // 优先级 2: Cesium World Terrain（默认 ~30m，带法线）
  try {
    const terrain = await Cesium.createWorldTerrainAsync({
      requestWaterMask: false,
      requestVertexNormals: true,
    });
    if (!viewer.isDestroyed()) {
      viewer.terrainProvider = terrain;
    }
  } catch (err) {
    console.warn('地形加载失败，使用椭球面:', err);
  }
}

// === Entity 辅助 ===

// 标线（leader line）高度：标记悬浮在地面上方，通过竖线连接地面
const LEADER_LINE_HEIGHT = 80; // 米

function addAvalancheEventEntity(ds: Cesium.CustomDataSource, event: AvalancheEvent) {
  const color = AVALANCHE_SIZE_COLORS[event.size] || '#ff9800';
  const groundPos = Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude);
  const abovePos = Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude, LEADER_LINE_HEIGHT);

  // 标线（地面 → 悬浮位置）
  ds.entities.add({
    position: groundPos,
    polyline: {
      positions: [groundPos, abovePos],
      width: 1.5,
      material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.6)),
      clampToGround: false,
    },
    properties: { type: 'leader-line' },
  } as Cesium.Entity.ConstructorOptions);

  // 图标（相对地面高度，跟随地形）
  ds.entities.add({
    position: Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude, LEADER_LINE_HEIGHT),
    billboard: {
      image: createAvalancheIcon(color),
      width: 32,
      height: 32,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: {
      text: event.size,
      font: 'bold 11px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      outlineColor: Cesium.Color.BLACK,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -36),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    properties: {
      type: 'avalanche-event',
      eventId: event.id,
    },
  } as Cesium.Entity.ConstructorOptions);
}

// Canvas 图标生成（2x 分辨率适配 HiDPI）— 缓存避免重复创建
const ICON_SCALE = Math.min(window.devicePixelRatio || 1, 2);

const _avalancheIconCache = new Map<string, HTMLCanvasElement>();
function createAvalancheIcon(color: string): HTMLCanvasElement {
  const cached = _avalancheIconCache.get(color);
  if (cached) return cached;

  const s = ICON_SCALE;
  const canvas = document.createElement('canvas');
  canvas.width = 32 * s;
  canvas.height = 32 * s;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(s, s);

  ctx.beginPath();
  ctx.moveTo(16, 2);
  ctx.lineTo(30, 28);
  ctx.lineTo(2, 28);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 16, 20);

  _avalancheIconCache.set(color, canvas);
  return canvas;
}

let _snowPitIconCache: HTMLCanvasElement | null = null;
function createSnowPitIcon(): HTMLCanvasElement {
  if (_snowPitIconCache) return _snowPitIconCache;

  const s = ICON_SCALE;
  const canvas = document.createElement('canvas');
  canvas.width = 28 * s;
  canvas.height = 28 * s;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(s, s);

  ctx.beginPath();
  ctx.arc(14, 14, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', 14, 15);

  _snowPitIconCache = canvas;
  return canvas;
}

// === Globe Material 着色 ===

function createSlopeMaterial(): Cesium.Material {
  return Cesium.Material.fromType('SlopeRamp', {
    image: createSlopeGradientImage(),
  });
}

function createAspectMaterial(): Cesium.Material {
  return Cesium.Material.fromType('AspectRamp', {
    image: createAspectGradientImage(),
  });
}

function createAvalancheZoneMaterial(): Cesium.Material {
  return Cesium.Material.fromType('SlopeRamp', {
    image: createAvalancheZoneGradientImage(),
  });
}

function createContourMaterial(): Cesium.Material {
  return Cesium.Material.fromType('ElevationContour', {
    width: 1.5,
    spacing: 50.0,    // 50m 间距（原 100m），滑雪场尺度更清晰
    color: Cesium.Color.WHITE.withAlpha(0.9),
  });
}

function createSlopeContourMaterial(): Cesium.Material {
  return new Cesium.Material({
    fabric: {
      type: 'SlopeContour',
      materials: {
        contourMaterial: {
          type: 'ElevationContour',
          uniforms: {
            spacing: 50.0,    // 50m 间距，与独立等高线图层一致
            width: 1.5,
            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
          },
        },
        slopeRampMaterial: {
          type: 'SlopeRamp',
          uniforms: {
            image: createSlopeGradientImage(),
          },
        },
      },
      components: {
        diffuse: 'mix(slopeRampMaterial.diffuse, contourMaterial.diffuse, contourMaterial.alpha)',
        alpha: 'max(slopeRampMaterial.alpha, contourMaterial.alpha)',
      },
    },
  });
}

// === 底图 Provider 工厂 ===

function createBaseMapProvider(baseMap: BaseMap): Cesium.UrlTemplateImageryProvider {
  switch (baseMap) {
    case 'google':
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        subdomains: ['0', '1', '2', '3'],
        maximumLevel: 20,
      });
    case 'tianditu':
      return new Cesium.UrlTemplateImageryProvider({
        url: `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_TOKEN}`,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maximumLevel: 18,
      });
    case 'topo':
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c'],
        maximumLevel: 17,
        credit: '(c) OpenTopoMap CC-BY-SA',
      });
    case 'arcgis':
    default:
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
      });
  }
}

function createSlopeGradientImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  // 坡度色带：针对雪崩评估优化 (角度/90° = canvas位置)
  // 0-20°: 安全区 (绿色)
  g.addColorStop(0, 'rgba(120,200,120,0.5)');       // 0° 平地
  g.addColorStop(0.222, 'rgba(180,220,100,0.6)');    // 20° 低风险
  // 25-30°: 注意区 (黄色)
  g.addColorStop(0.278, 'rgba(255,230,0,0.75)');     // 25° 开始关注
  g.addColorStop(0.333, 'rgba(255,180,0,0.85)');     // 30° 雪崩起始角度
  // 35-40°: 高危区 (橙→红)
  g.addColorStop(0.378, 'rgba(255,100,30,0.9)');     // 34° 典型触发角度
  g.addColorStop(0.389, 'rgba(255,50,30,0.92)');     // 35° 最高频雪崩角度
  g.addColorStop(0.444, 'rgba(220,20,20,0.92)');     // 40° 高危
  // 45°+: 极陡区 (紫色，自然释放)
  g.addColorStop(0.5, 'rgba(180,0,180,0.9)');        // 45° 极陡
  g.addColorStop(0.667, 'rgba(140,0,140,0.85)');     // 60° 悬崖
  g.addColorStop(1.0, 'rgba(100,0,120,0.8)');        // 90° 垂直
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 1);
  return canvas;
}

function createAspectGradientImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, 'rgba(0,100,255,0.7)');
  g.addColorStop(0.125, 'rgba(100,200,255,0.7)');
  g.addColorStop(0.25, 'rgba(240,240,240,0.6)');
  g.addColorStop(0.375, 'rgba(255,200,150,0.7)');
  g.addColorStop(0.5, 'rgba(255,140,0,0.7)');
  g.addColorStop(0.625, 'rgba(160,80,40,0.7)');
  g.addColorStop(0.75, 'rgba(60,60,60,0.7)');
  g.addColorStop(0.875, 'rgba(40,60,160,0.7)');
  g.addColorStop(1.0, 'rgba(0,100,255,0.7)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 1);
  return canvas;
}

function createAvalancheZoneGradientImage(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 1);
  // 雪崩危险区高亮：仅着色 25°-50° 区间
  const start = Math.floor(256 * 0.278);  // 25°
  const peak = Math.floor(256 * 0.389);   // 35° (最高频)
  const end = Math.floor(256 * 0.556);    // 50°
  const g = ctx.createLinearGradient(start, 0, end, 0);
  g.addColorStop(0, 'rgba(255,230,0,0.5)');           // 25° 边缘
  g.addColorStop((peak - start) / (end - start) * 0.7, 'rgba(255,120,0,0.8)');  // ~32°
  g.addColorStop((peak - start) / (end - start), 'rgba(255,30,30,0.9)');        // 35° 峰值
  g.addColorStop(0.85, 'rgba(200,0,100,0.85)');       // ~45°
  g.addColorStop(1.0, 'rgba(150,0,150,0.7)');         // 50° 边缘
  ctx.fillStyle = g;
  ctx.fillRect(start, 0, end - start, 1);
  return canvas;
}
