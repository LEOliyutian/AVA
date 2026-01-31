import { FormGroup, Textarea } from '../ui';
import { useForecastStore } from '../../store';

export function ObservationsSection() {
  const observations = useForecastStore((s) => s.observations);
  const setSnowpack = useForecastStore((s) => s.setSnowpack);
  const setActivity = useForecastStore((s) => s.setActivity);

  return (
    <FormGroup title="5. 野外观测详情 (Observations)">
      <Textarea
        label="雪层结构讨论 (Snowpack)"
        value={observations.snowpack}
        onChange={(e) => setSnowpack(e.target.value)}
      />

      <Textarea
        label="近期雪崩活动 (Avalanche Activity)"
        style={{ marginTop: 15 }}
        value={observations.activity}
        onChange={(e) => setActivity(e.target.value)}
      />
    </FormGroup>
  );
}
