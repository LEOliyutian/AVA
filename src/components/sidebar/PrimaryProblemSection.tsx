import { FormGroup, Select, Textarea } from '../ui';
import { RoseDiagram } from '../shared';
import { useForecastStore } from '../../store';
import {
  AVALANCHE_PROBLEM_TYPES,
  LIKELIHOOD_OPTIONS,
  SIZE_OPTIONS,
} from '../../config';
import type { AvalancheProblemType, LikelihoodLevel, SizeLevel } from '../../types';

export function PrimaryProblemSection() {
  const problem = useForecastStore((s) => s.primaryProblem);
  const setPrimaryType = useForecastStore((s) => s.setPrimaryType);
  const setPrimaryLikelihood = useForecastStore((s) => s.setPrimaryLikelihood);
  const setPrimarySize = useForecastStore((s) => s.setPrimarySize);
  const togglePrimarySector = useForecastStore((s) => s.togglePrimarySector);
  const setPrimaryDescription = useForecastStore((s) => s.setPrimaryDescription);

  return (
    <FormGroup title="2. 主要雪崩问题 (Primary Problem)" borderColor="#d9534f">
      <Select
        options={AVALANCHE_PROBLEM_TYPES.map((t) => ({ value: t, label: t }))}
        value={problem.type}
        onChange={(value) => setPrimaryType(value as AvalancheProblemType)}
      />

      <div className="input-row" style={{ marginTop: 10 }}>
        <Select
          label="发生可能性"
          options={LIKELIHOOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={problem.likelihood}
          onChange={(value) => setPrimaryLikelihood(Number(value) as LikelihoodLevel)}
        />
        <Select
          label="破坏规模"
          options={SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={problem.size}
          onChange={(value) => setPrimarySize(Number(value) as SizeLevel)}
        />
      </div>

      <div className="rose-wrap">
        <RoseDiagram
          sectors={problem.sectors}
          onToggle={togglePrimarySector}
          variant="primary"
          editable
        />
        <div className="rose-instr">
          点击扇区选择方位。
          <br />
          <b>内圈=高山, 中圈=林线, 外圈=林下</b>
        </div>
      </div>

      <Textarea
        label="雪崩问题描述"
        style={{ marginTop: 10 }}
        value={problem.description}
        onChange={(e) => setPrimaryDescription(e.target.value)}
      />
    </FormGroup>
  );
}
