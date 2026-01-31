import { FormGroup, Select, Textarea } from '../ui';
import { RoseDiagram } from '../shared';
import { useForecastStore } from '../../store';
import {
  AVALANCHE_PROBLEM_TYPES,
  LIKELIHOOD_OPTIONS,
  SIZE_OPTIONS,
} from '../../config';
import type { AvalancheProblemType, LikelihoodLevel, SizeLevel } from '../../types';

export function SecondaryProblemSection() {
  const problem = useForecastStore((s) => s.secondaryProblem);
  const enabled = useForecastStore((s) => s.secondaryEnabled);
  const setSecondaryEnabled = useForecastStore((s) => s.setSecondaryEnabled);
  const setSecondaryType = useForecastStore((s) => s.setSecondaryType);
  const setSecondaryLikelihood = useForecastStore((s) => s.setSecondaryLikelihood);
  const setSecondarySize = useForecastStore((s) => s.setSecondarySize);
  const toggleSecondarySector = useForecastStore((s) => s.toggleSecondarySector);
  const setSecondaryDescription = useForecastStore((s) => s.setSecondaryDescription);

  const titleRight = (
    <input
      type="checkbox"
      checked={enabled}
      onChange={(e) => setSecondaryEnabled(e.target.checked)}
      style={{ width: 'auto', transform: 'scale(1.2)' }}
    />
  );

  return (
    <FormGroup
      title="3. 次要雪崩问题 (Secondary)"
      borderColor="#f0ad4e"
      titleRight={titleRight}
    >
      <div
        style={{
          opacity: enabled ? 1 : 0.4,
          pointerEvents: enabled ? 'auto' : 'none',
        }}
      >
        <Select
          options={AVALANCHE_PROBLEM_TYPES.map((t) => ({ value: t, label: t }))}
          value={problem.type}
          onChange={(value) => setSecondaryType(value as AvalancheProblemType)}
        />

        <div className="input-row" style={{ marginTop: 10 }}>
          <Select
            label="发生可能性"
            options={LIKELIHOOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={problem.likelihood}
            onChange={(value) => setSecondaryLikelihood(Number(value) as LikelihoodLevel)}
          />
          <Select
            label="破坏规模"
            options={SIZE_OPTIONS.slice(0, 4).map((o) => ({ value: o.value, label: o.label }))}
            value={problem.size}
            onChange={(value) => setSecondarySize(Number(value) as SizeLevel)}
          />
        </div>

        <div className="rose-wrap">
          <RoseDiagram
            sectors={problem.sectors}
            onToggle={toggleSecondarySector}
            variant="secondary"
            editable
          />
          <div className="rose-instr">次要问题分布方位</div>
        </div>

        <Textarea
          label="雪崩问题描述"
          style={{ marginTop: 10 }}
          value={problem.description}
          onChange={(e) => setSecondaryDescription(e.target.value)}
        />
      </div>
    </FormGroup>
  );
}
