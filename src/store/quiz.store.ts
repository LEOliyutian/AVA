import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CategoryId,
  UserQuizProgress,
  QuizSession,
  CategoryStats,
  QuestionHistory,
} from '../types/quiz.types';
import { checkNewAchievements } from '../data/quiz/achievements';
import { updateStreak, checkMastery, getTodayStr } from '../utils/quiz';

const ALL_CATEGORIES: CategoryId[] = [
  'problem-types', 'danger-scale', 'terrain', 'crystal-types',
  'rescue', 'decision', 'weather', 'snow-profile',
];

function defaultCategoryStats(): Record<CategoryId, CategoryStats> {
  const totals: Record<CategoryId, number> = {
    'problem-types': 80, 'danger-scale': 60, 'terrain': 70, 'crystal-types': 60,
    'rescue': 70, 'decision': 60, 'weather': 50, 'snow-profile': 50,
  };
  return Object.fromEntries(
    ALL_CATEGORIES.map((id) => [id, { answered: 0, correct: 0, mastered: 0, total: totals[id] }])
  ) as Record<CategoryId, CategoryStats>;
}

function defaultProgress(): UserQuizProgress {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    scenarioCorrect: 0,
    categoryStats: defaultCategoryStats(),
    questionHistory: {},
    sessions: [],
    streak: { current: 0, longest: 0, lastQuizDate: '' },
    achievements: [],
    dailyChallengeHistory: {},
  };
}

interface QuizStoreActions {
  recordAnswer: (questionId: string, category: CategoryId, correct: boolean, questionType?: string) => void;
  saveSession: (session: QuizSession) => void;
  saveDailyScore: (score: number) => void;
  resetProgress: () => void;
  getWrongQuestionIds: () => string[];
  getScenarioCorrectCount: () => number;
}

type QuizStore = UserQuizProgress & QuizStoreActions;

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress(),

      recordAnswer: (questionId, category, correct, questionType?) => {
        set((state) => {
          const now = Date.now();
          // Update question history
          const prev: QuestionHistory = state.questionHistory[questionId] || { attempts: [], mastered: false };
          const attempts = [...prev.attempts, { timestamp: now, correct }].slice(-5);
          const mastered = checkMastery(attempts);
          const wasMastered = prev.mastered;

          const questionHistory = {
            ...state.questionHistory,
            [questionId]: { attempts, mastered },
          };

          // Update category stats
          const catStats = { ...state.categoryStats[category] };
          catStats.answered += 1;
          if (correct) catStats.correct += 1;
          if (mastered && !wasMastered) catStats.mastered += 1;
          if (!mastered && wasMastered) catStats.mastered = Math.max(0, catStats.mastered - 1);

          const categoryStats = { ...state.categoryStats, [category]: catStats };

          // Update streak
          const streak = updateStreak(state.streak);

          // Update totals
          const totalAnswered = state.totalAnswered + 1;
          const totalCorrect = state.totalCorrect + (correct ? 1 : 0);
          const scenarioCorrect = state.scenarioCorrect + (questionType === 'scenario' && correct ? 1 : 0);

          // Check achievements
          const newState: UserQuizProgress = {
            ...state,
            totalAnswered,
            totalCorrect,
            scenarioCorrect,
            categoryStats,
            questionHistory,
            streak,
            achievements: state.achievements,
            sessions: state.sessions,
            dailyChallengeHistory: state.dailyChallengeHistory,
          };
          const newAch = checkNewAchievements(newState);
          const achievements = [...new Set([...state.achievements, ...newAch])];

          return { totalAnswered, totalCorrect, scenarioCorrect, categoryStats, questionHistory, streak, achievements };
        });
      },

      saveSession: (session) => {
        set((state) => {
          const sessions = [session, ...state.sessions].slice(0, 50);
          return { sessions };
        });
      },

      saveDailyScore: (score) => {
        set((state) => ({
          dailyChallengeHistory: {
            ...state.dailyChallengeHistory,
            [getTodayStr()]: score,
          },
        }));
      },

      resetProgress: () => set(defaultProgress()),

      getWrongQuestionIds: () => {
        const { questionHistory } = get();
        return Object.entries(questionHistory)
          .filter(([, h]) => !h.mastered && h.attempts.length > 0 && !h.attempts[h.attempts.length - 1].correct)
          .map(([id]) => id);
      },

      getScenarioCorrectCount: () => {
        return get().scenarioCorrect;
      },
    }),
    {
      name: 'quiz-progress',
      partialize: (state) => ({
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        scenarioCorrect: state.scenarioCorrect,
        categoryStats: state.categoryStats,
        questionHistory: state.questionHistory,
        sessions: state.sessions,
        streak: state.streak,
        achievements: state.achievements,
        dailyChallengeHistory: state.dailyChallengeHistory,
      }),
    }
  )
);
