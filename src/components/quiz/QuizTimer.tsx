import { useState, useEffect, useRef } from 'react';

interface QuizTimerProps {
  timeLimit: number; // ms
  startedAt: number;
  onTimeUp: () => void;
}

export function QuizTimer({ timeLimit, startedAt, onTimeUp }: QuizTimerProps) {
  const [remaining, setRemaining] = useState(timeLimit);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = Math.max(0, timeLimit - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit, startedAt]);

  const totalSec = Math.ceil(remaining / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const isLow = totalSec <= 60;

  return (
    <span className={`quiz-timer ${isLow ? 'quiz-timer-low' : ''}`}>
      {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
    </span>
  );
}
