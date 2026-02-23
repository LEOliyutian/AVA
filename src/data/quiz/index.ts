import type { CategoryId, QuizQuestion } from '../../types/quiz.types';

const loaders: Record<CategoryId, () => Promise<{ default: QuizQuestion[] }>> = {
  'problem-types': () => import('./problem-types'),
  'danger-scale': () => import('./danger-scale'),
  'terrain': () => import('./terrain'),
  'crystal-types': () => import('./crystal-types'),
  'rescue': () => import('./rescue'),
  'decision': () => import('./decision'),
  'weather': () => import('./weather'),
  'snow-profile': () => import('./snow-profile'),
};

const cache = new Map<CategoryId, QuizQuestion[]>();

/** Load questions for a single category (cached) */
export async function loadCategory(id: CategoryId): Promise<QuizQuestion[]> {
  if (cache.has(id)) return cache.get(id)!;
  const mod = await loaders[id]();
  cache.set(id, mod.default);
  return mod.default;
}

/** Load questions for multiple categories */
export async function loadCategories(ids: CategoryId[]): Promise<QuizQuestion[]> {
  const results = await Promise.all(ids.map(loadCategory));
  return results.flat();
}

/** Load all questions */
export async function loadAllQuestions(): Promise<QuizQuestion[]> {
  const allIds = Object.keys(loaders) as CategoryId[];
  return loadCategories(allIds);
}

/** Clear cache (for testing) */
export function clearQuizCache(): void {
  cache.clear();
}
