import type { QuizQuestion, Difficulty, UserQuizProgress, CategoryId } from '../types/quiz.types';

/** Fisher-Yates shuffle */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deterministic seed-based RNG (mulberry32) */
export function seededRng(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Get daily seed from date string YYYY-MM-DD */
export function getDailySeed(dateStr?: string): number {
  const d = dateStr || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = ((hash << 5) - hash + d.charCodeAt(i)) | 0;
  }
  return hash;
}

/** Get today's date string YYYY-MM-DD */
export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Difficulty multiplier */
export function difficultyMultiplier(d: Difficulty): number {
  return d === 'easy' ? 1 : d === 'medium' ? 1.5 : 2;
}

/** Calculate score for a single answer */
export function calcQuestionScore(
  question: QuizQuestion,
  userAnswer: string | string[] | undefined,
  mode: 'practice' | 'category' | 'exam' | 'review' | 'daily'
): number {
  const correct = isAnswerCorrect(question, userAnswer);
  const mult = difficultyMultiplier(question.difficulty);

  if (mode === 'daily') {
    return correct ? 20 * mult : 0;
  }
  if (mode === 'exam') {
    return correct ? 10 * mult : userAnswer ? -3 : 0;
  }
  // practice, category, review
  return correct ? 10 * mult : 0;
}

/** Check if answer is correct */
export function isAnswerCorrect(
  question: QuizQuestion,
  userAnswer: string | string[] | undefined
): boolean {
  if (!userAnswer) return false;

  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(userAnswer)) return false;
    const correct = [...question.correctAnswer].sort();
    const user = [...userAnswer].sort();
    return correct.length === user.length && correct.every((v, i) => v === user[i]);
  }
  return userAnswer === question.correctAnswer;
}

/** Calculate total score for a session */
export function calcSessionScore(
  questions: QuizQuestion[],
  answers: Record<string, string | string[]>,
  mode: 'practice' | 'category' | 'exam' | 'review' | 'daily'
): number {
  return questions.reduce((sum, q) => sum + calcQuestionScore(q, answers[q.id], mode), 0);
}

/** Smart question selection: prioritize unanswered/wrong */
export function smartSelect(
  questions: QuizQuestion[],
  history: UserQuizProgress['questionHistory'],
  count: number
): QuizQuestion[] {
  const unansweredOrWrong: QuizQuestion[] = [];
  const answeredOnce: QuizQuestion[] = [];
  const mastered: QuizQuestion[] = [];

  for (const q of questions) {
    const h = history[q.id];
    if (!h || h.attempts.length === 0 || !h.attempts[h.attempts.length - 1].correct) {
      unansweredOrWrong.push(q);
    } else if (!h.mastered) {
      answeredOnce.push(q);
    } else {
      mastered.push(q);
    }
  }

  const result: QuizQuestion[] = [];
  const target70 = Math.ceil(count * 0.7);
  const target20 = Math.ceil(count * 0.2);

  // 70% from unanswered/wrong
  result.push(...shuffle(unansweredOrWrong).slice(0, target70));
  // 20% from answered once
  result.push(...shuffle(answeredOnce).slice(0, target20));
  // 10% from mastered
  result.push(...shuffle(mastered).slice(0, count));

  // Deduplicate and trim
  const seen = new Set<string>();
  const unique: QuizQuestion[] = [];
  for (const q of result) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      unique.push(q);
    }
    if (unique.length >= count) break;
  }

  return unique;
}

/** Check if question is mastered (answered correctly 2+ times in a row) */
export function checkMastery(attempts: { correct: boolean }[]): boolean {
  if (attempts.length < 2) return false;
  return attempts[attempts.length - 1].correct && attempts[attempts.length - 2].correct;
}

/** Calculate category mastery percentage */
export function categoryMasteryPercent(stats: { mastered: number; total: number }): number {
  if (stats.total === 0) return 0;
  return Math.round((stats.mastered / stats.total) * 100);
}

/** Shuffle options for a question (preserve numeric order if applicable) */
export function shuffleOptions(question: QuizQuestion): QuizQuestion {
  // Don't shuffle true/false
  if (question.type === 'truefalse') return question;

  // Check if options look numeric/ordered (e.g., "10cm", "20cm", "30cm")
  const numPattern = /^\d/;
  const allNumeric = question.options.every((o) => numPattern.test(o.text));
  if (allNumeric) return question;

  return { ...question, options: shuffle(question.options) };
}

/** Update streak based on today's quiz */
export function updateStreak(streak: UserQuizProgress['streak']): UserQuizProgress['streak'] {
  const today = getTodayStr();
  if (streak.lastQuizDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newCurrent = streak.lastQuizDate === yesterdayStr ? streak.current + 1 : 1;
  return {
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastQuizDate: today,
  };
}

/** Generate session ID */
export function generateSessionId(): string {
  return `qs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Weight categories for exam mode */
const EXAM_WEIGHTS: Record<CategoryId, number> = {
  'problem-types': 10,
  'danger-scale': 7,
  'terrain': 8,
  'crystal-types': 7,
  'rescue': 8,
  'decision': 7,
  'weather': 6,
  'snow-profile': 6,
};

/** Select weighted questions for exam mode */
export function selectExamQuestions(
  allQuestions: QuizQuestion[],
  history: UserQuizProgress['questionHistory'],
  total: number = 50
): QuizQuestion[] {
  const byCategory: Record<string, QuizQuestion[]> = {};
  for (const q of allQuestions) {
    (byCategory[q.category] ??= []).push(q);
  }

  const totalWeight = Object.values(EXAM_WEIGHTS).reduce((a, b) => a + b, 0);
  const result: QuizQuestion[] = [];

  for (const [cat, weight] of Object.entries(EXAM_WEIGHTS)) {
    const count = Math.round((weight / totalWeight) * total);
    const pool = byCategory[cat] || [];
    result.push(...smartSelect(pool, history, count));
  }

  return shuffle(result).slice(0, total);
}

/** Select daily challenge questions (deterministic for the day) */
export function selectDailyQuestions(
  allQuestions: QuizQuestion[],
  count: number = 5
): QuizQuestion[] {
  const seed = getDailySeed();
  const rng = seededRng(seed);
  return shuffle(allQuestions, rng).slice(0, count);
}
