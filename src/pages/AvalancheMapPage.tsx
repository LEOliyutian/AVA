import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AvalancheMap } from '../components/map/AvalancheMap';
import type { MapObservation } from '../components/map/AvalancheMap';
import { MapLayerPanel } from '../components/map/MapLayerPanel';
import { MapCameraControls } from '../components/map/MapCameraControls';
import { AvalancheEventEditor } from '../components/map/AvalancheEventEditor';
import { SnowpitDetailPanel } from '../components/map/SnowpitDetailPanel';
import { TerrainInfoTooltip } from '../components/map/TerrainInfoTooltip';
import { useMapStore } from '../store/map.store';
import './AvalancheMapPage.css';

export function AvalancheMapPage() {
  const { fetchEvents, fetchSnowpits, snowpitLocations } = useMapStore();

  useEffect(() => {
    fetchEvents();
    fetchSnowpits();
  }, [fetchEvents, fetchSnowpits]);

  const observations: MapObservation[] = useMemo(
    () => snowpitLocations.map((sp) => ({
      id: sp.id,
      location: sp.location,
      observer: sp.observer,
      date: sp.date,
      gps_coordinates: sp.gps_coordinates,
    })),
    [snowpitLocations]
  );

  return (
    <div className="avalanche-map-page">
      {/* 左上角返回按钮 */}
      <Link to="/" className="map-home-btn" title="返回首页">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 2L2 19h20L12 2zm0 3.3L19.07 17H4.93L12 5.3z" />
        </svg>
        <span>TaigaSnow</span>
      </Link>

      <AvalancheMap observations={observations} />
      <MapCameraControls />
      <MapLayerPanel />
      <AvalancheEventEditor />
      <SnowpitDetailPanel />
      <TerrainInfoTooltip />
    </div>
  );
}
