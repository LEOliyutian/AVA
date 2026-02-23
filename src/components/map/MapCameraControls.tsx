import { useCallback } from 'react';
import * as Cesium from 'cesium';
import { getMapViewer } from './AvalancheMap';
import './MapCameraControls.css';

// 吉克普林滑雪场默认视角
const HOME_VIEW = {
  destination: Cesium.Cartesian3.fromDegrees(87.15, 43.45, 15000),
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-45),
    roll: 0,
  },
};

export function MapCameraControls() {
  const rotateDelta = Cesium.Math.toRadians(5);
  const tiltDelta = Cesium.Math.toRadians(5);

  const zoomIn = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    const camera = viewer.camera;
    camera.zoomIn(camera.positionCartographic.height * 0.3);
  }, []);

  const zoomOut = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    const camera = viewer.camera;
    camera.zoomOut(camera.positionCartographic.height * 0.3);
  }, []);

  const tiltUp = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    viewer.camera.lookUp(tiltDelta);
  }, [tiltDelta]);

  const tiltDown = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    viewer.camera.lookDown(tiltDelta);
  }, [tiltDelta]);

  const rotateLeft = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    viewer.camera.rotateLeft(rotateDelta);
  }, [rotateDelta]);

  const rotateRight = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    viewer.camera.rotateRight(rotateDelta);
  }, [rotateDelta]);

  const resetView = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    viewer.camera.flyTo({ ...HOME_VIEW, duration: 1.5 });
  }, []);

  const topDownView = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    const pos = viewer.camera.positionCartographic;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromRadians(
        pos.longitude,
        pos.latitude,
        pos.height
      ),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
      duration: 1,
    });
  }, []);

  const perspectiveView = useCallback(() => {
    const viewer = getMapViewer();
    if (!viewer) return;
    const pos = viewer.camera.positionCartographic;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromRadians(
        pos.longitude,
        pos.latitude,
        pos.height
      ),
      orientation: {
        heading: viewer.camera.heading,
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 1,
    });
  }, []);

  return (
    <div className="map-camera-controls">
      {/* 视角预设 */}
      <div className="cam-preset-row">
        <button className="cam-btn preset" onClick={resetView} title="回到默认视角">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="cam-btn preset" onClick={topDownView} title="俯视（正下方）">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
          </svg>
        </button>
        <button className="cam-btn preset" onClick={perspectiveView} title="45° 斜视">
          <span style={{ fontSize: 11, fontWeight: 700 }}>3D</span>
        </button>
      </div>

      {/* 方向十字键 */}
      <div className="cam-dpad">
        <button className="cam-btn dpad-up" onClick={tiltUp} title="向上倾斜">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </button>
        <div className="dpad-middle-row">
          <button className="cam-btn dpad-left" onClick={rotateLeft} title="向左旋转">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div className="dpad-center" />
          <button className="cam-btn dpad-right" onClick={rotateRight} title="向右旋转">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        <button className="cam-btn dpad-down" onClick={tiltDown} title="向下倾斜">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
          </svg>
        </button>
      </div>

      {/* 缩放 */}
      <div className="cam-zoom-row">
        <button className="cam-btn zoom" onClick={zoomIn} title="放大">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <button className="cam-btn zoom" onClick={zoomOut} title="缩小">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
