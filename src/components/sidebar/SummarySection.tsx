import { FormGroup, Textarea } from '../ui';
import { useForecastStore } from '../../store';

export function SummarySection() {
  const summary = useForecastStore((s) => s.summary);
  const setSummary = useForecastStore((s) => s.setSummary);

  return (
    <FormGroup title="6. 结论/摘要 (Summary)">
      <Textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        style={{ minHeight: 100 }}
      />
    </FormGroup>
  );
}
