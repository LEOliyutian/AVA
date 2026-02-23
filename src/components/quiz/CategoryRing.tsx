import { Link } from 'react-router-dom';
import './CategoryRing.css';

interface CategoryRingProps {
  name: string;
  subtitle: string;
  percent: number;
  mastered: number;
  total: number;
  to: string;
}

export function CategoryRing({ name, subtitle, percent, mastered, total, to }: CategoryRingProps) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Link to={to} className="category-ring">
      <svg className="category-ring-svg" viewBox="0 0 100 100">
        <circle
          className="category-ring-bg"
          cx="50" cy="50" r={r}
          fill="none" strokeWidth="6"
        />
        <circle
          className="category-ring-progress"
          cx="50" cy="50" r={r}
          fill="none" strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="46" textAnchor="middle" className="category-ring-percent">
          {percent}%
        </text>
        <text x="50" y="60" textAnchor="middle" className="category-ring-count">
          {mastered}/{total}
        </text>
      </svg>
      <div className="category-ring-label">
        <span className="category-ring-name">{name}</span>
        <span className="category-ring-subtitle">{subtitle}</span>
      </div>
    </Link>
  );
}
