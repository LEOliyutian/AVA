export type QuestionType = 'single' | 'multiple' | 'truefalse' | 'scenario' | 'image';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CategoryId =
  | 'problem-types'
  | 'danger-scale'
  | 'terrain'
  | 'crystal-types'
  | 'rescue'
  | 'decision'
  | 'weather'
  | 'snow-profile';

export type QuizMode = 'practice' | 'category' | 'exam' | 'review' | 'daily';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  category: CategoryId;
  difficulty: Difficulty;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string | string[];
  explanation: string;
  keyTakeaway: string;
  relatedPage: string;
  scenarioContext?: string;
  imageData?: string;
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  category?: CategoryId;
  startedAt: number;
  completedAt?: number;
  questionIds: string[];
  answers: Record<string, string | string[]>;
  score: number;
  totalQuestions: number;
  correctCount: number;
}

export interface CategoryStats {
  answered: number;
  correct: number;
  mastered: number;
  total: number;
}

export interface QuestionAttempt {
  timestamp: number;
  correct: boolean;
}

export interface QuestionHistory {
  attempts: QuestionAttempt[];
  mastered: boolean;
}

export interface UserQuizProgress {
  totalAnswered: number;
  totalCorrect: number;
  scenarioCorrect: number;
  categoryStats: Record<CategoryId, CategoryStats>;
  questionHistory: Record<string, QuestionHistory>;
  sessions: QuizSession[];
  streak: { current: number; longest: number; lastQuizDate: string };
  achievements: string[];
  dailyChallengeHistory: Record<string, number>;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  totalQuestions: number;
  relatedPage: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  check: (progress: UserQuizProgress) => boolean;
}
