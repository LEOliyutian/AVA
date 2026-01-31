import type { RefObject } from 'react';
import { BasicInfoSection } from './BasicInfoSection';
import { PrimaryProblemSection } from './PrimaryProblemSection';
import { SecondaryProblemSection } from './SecondaryProblemSection';
import { WeatherSection } from './WeatherSection';
import { WeatherObservationSection } from './WeatherObservationSection';
import { ObservationsSection } from './ObservationsSection';
import { SummarySection } from './SummarySection';
import { useForecastStore } from '../../store';
import { exportToJpg, generateFilename } from '../../utils';

interface SidebarProps {
  reportRef: RefObject<HTMLDivElement | null>;
}

export function Sidebar({ reportRef }: SidebarProps) {
  const date = useForecastStore((s) => s.date);

  const handleExport = async () => {
    if (reportRef.current) {
      await exportToJpg(reportRef.current, generateFilename(date));
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>❄️ 吉克普林雪崩预报系统</h2>
        <div style={{ fontSize: 11, opacity: 0.8 }}>仅供专业人员和内部使用</div>
      </div>

      <div className="sidebar-scroll">
        <BasicInfoSection />
        <PrimaryProblemSection />
        <SecondaryProblemSection />
        <WeatherSection />
        <WeatherObservationSection />
        <ObservationsSection />
        <SummarySection />
      </div>

      <button className="btn-download" onClick={handleExport}>
        📥 下载 / 打印预报 (Fix Version)
      </button>
    </div>
  );
}
