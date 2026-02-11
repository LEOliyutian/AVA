import './WeatherInfoSection.css';

interface WeatherInfoSectionProps {
  date: string;
  recorder: string;
  tempMin: number | '';
  tempMax: number | '';
  onDateChange: (date: string) => void;
  onRecorderChange: (recorder: string) => void;
  onTempMinChange: (temp: number | '') => void;
  onTempMaxChange: (temp: number | '') => void;
}

export function WeatherInfoSection({
  date,
  recorder,
  tempMin,
  tempMax,
  onDateChange,
  onRecorderChange,
  onTempMinChange,
  onTempMaxChange,
}: WeatherInfoSectionProps) {
  return (
    <div className="weather-info-section">
      <h3 className="section-title">基本信息</h3>

      <div className="info-card">
        {/* 第一行：日期、记录员 */}
        <div className="info-row">
          <div className="info-field">
            <label>
              观测日期 <span className="required">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>
              记录员 <span className="required">*</span>
            </label>
            <input
              type="text"
              value={recorder}
              onChange={(e) => onRecorderChange(e.target.value)}
              placeholder="记录员姓名"
            />
          </div>
        </div>

        {/* 第二行：最低/最高气温 */}
        <div className="info-row">
          <div className="info-field">
            <label>最低气温 (°C)</label>
            <input
              type="number"
              value={tempMin}
              onChange={(e) =>
                onTempMinChange(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="-20"
            />
          </div>
          <div className="info-field">
            <label>最高气温 (°C)</label>
            <input
              type="number"
              value={tempMax}
              onChange={(e) =>
                onTempMaxChange(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
