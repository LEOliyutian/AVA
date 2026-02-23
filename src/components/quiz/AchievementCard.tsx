import './AchievementCard.css';

interface AchievementCardProps {
  icon: string;
  name: string;
  description: string;
  category: string;
  unlocked: boolean;
}

export function AchievementCard({ icon, name, description, category, unlocked }: AchievementCardProps) {
  return (
    <div className={`achievement-card ${unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}>
      <span className="achievement-icon">{icon}</span>
      <div className="achievement-info">
        <span className="achievement-name">{name}</span>
        <span className="achievement-desc">{description}</span>
        <span className="achievement-category">{category}</span>
      </div>
    </div>
  );
}
