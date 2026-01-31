import { useRef } from 'react';
import { Sidebar } from '../components/sidebar';
import { ReportSheet } from '../components/report';
import './MainLayout.css';

export function MainLayout() {
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app-container">
      <Sidebar reportRef={reportRef} />
      <div className="preview-area">
        <ReportSheet ref={reportRef} />
      </div>
    </div>
  );
}
