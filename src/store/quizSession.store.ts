import { create } from 'zustand';
import type { QuizQuestion, QuizMode, CategoryId } from '../types/quiz.types';
import { shuffleOptions, calcQuestionScore, isAnswerCorrect, generateSessionId } from '../utils/quiz';

interface QuizSessionState {
  sessionId: string;
  mode: QuizMode;
  category?: CategoryId;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, string | string[]>;
  startedAt: number;
  completedAt?: number;
  timeLimit?: number; // ms
  isActive: boolean;
  showingResult: boolean; // for immediate feedback modes
  lastAnswerCorrect?: boolean;
}

interface QuizSessionActions {
  startSession: (params: {
    mode: QuizMode;
    questions: QuizQuestion[];
    category?: CategoryId;
    timeLimit?: number;
  }) => void;
  answerQuestion: (questionId: string, answer: string | string[]) => boolean;
  nextQuestion: () => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
  completeSession: () => void;
  dismissResult: () => void;
  getScore: () => number;
  getCorrectCount: () => number;
  isImmediateFeedback: () => boolean;
  reset: () => void;
}

type QuizSessionStore = QuizSessionState & QuizSessionActions;

const initialState: QuizSessionState = {
  sessionId: '',
  mode: 'practice',
  questions: [],
  currentIndex: 0,
  answers: {},
  startedAt: 0,
  isActive: false,
  showingResult: false,
};

export const useQuizSessionStore = create<QuizSessionStore>()((set, get) => ({
  ...initialState,

  startSession: ({ mode, questions, category, timeLimit }) => {
    const shuffled = questions.map(shuffleOptions);
    set({
      sessionId: generateSessionId(),
      mode,
      category,
      questions: shuffled,
      currentIndex: 0,
      answers: {},
      startedAt: Date.now(),
      completedAt: undefined,
      timeLimit,
      isActive: true,
      showingResult: false,
      lastAnswerCorrect: undefined,
    });
  },

  answerQuestion: (questionId, answer) => {
    const { questions } = get();
    const question = questions.find((q) => q.id === questionId);
    if (!question) return false;

    const correct = isAnswerCorrect(question, answer);
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
      showingResult: state.isImmediateFeedback(),
      lastAnswerCorrect: correct,
    }));
    return correct;
  },

  nextQuestion: () => {
    set((state) => {
      const next = state.currentIndex + 1;
      if (next >= state.questions.length) return state;
      return { currentIndex: next, showingResult: false, lastAnswerCorrect: undefined };
    });
  },

  prevQuestion: () => {
    set((state) => {
      if (state.currentIndex <= 0) return state;
      return { currentIndex: state.currentIndex - 1, showingResult: false, lastAnswerCorrect: undefined };
    });
  },

  skipQuestion: () => {
    const { nextQuestion } = get();
    nextQuestion();
  },

  completeSession: () => {
    set({ completedAt: Date.now(), isActive: false });
  },

  dismissResult: () => {
    set({ showingResult: false });
  },

  getScore: () => {
    const { questions, answers, mode } = get();
    return questions.reduce(
      (sum, q) => sum + calcQuestionScore(q, answers[q.id], mode),
      0
    );
  },

  getCorrectCount: () => {
    const { questions, answers } = get();
    return questions.filter((q) => isAnswerCorrect(q, answers[q.id])).length;
  },

  isImmediateFeedback: () => {
    const { mode } = get();
    return mode === 'practice' || mode === 'category' || mode === 'review';
  },

  reset: () => set(initialState),
}));
