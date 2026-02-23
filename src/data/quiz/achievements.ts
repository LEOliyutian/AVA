import type { AchievementDef, UserQuizProgress, CategoryId } from '../../types/quiz.types';

const ALL_CATEGORIES: CategoryId[] = [
  'problem-types', 'danger-scale', 'terrain', 'crystal-types',
  'rescue', 'decision', 'weather', 'snow-profile',
];

function catMastered(progress: UserQuizProgress, cat: CategoryId): boolean {
  const s = progress.categoryStats[cat];
  return s ? s.mastered >= s.total && s.total > 0 : false;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // 入门
  {
    id: 'first-quiz', name: '初探者', description: '完成第 1 次测验',
    category: '入门', icon: '🌱',
    check: (p) => p.sessions.length >= 1,
  },
  {
    id: 'answer-50', name: '求知者', description: '累计答 50 题',
    category: '入门', icon: '📖',
    check: (p) => p.totalAnswered >= 50,
  },
  {
    id: 'answer-200', name: '学者', description: '累计答 200 题',
    category: '入门', icon: '🎓',
    check: (p) => p.totalAnswered >= 200,
  },

  // 分类精通 ×8
  {
    id: 'master-problem-types', name: '风板专家', description: '掌握「雪崩问题类型」全部题目',
    category: '分类精通', icon: '⚠️',
    check: (p) => catMastered(p, 'problem-types'),
  },
  {
    id: 'master-danger-scale', name: '等级通', description: '掌握「危险等级」全部题目',
    category: '分类精通', icon: '📊',
    check: (p) => catMastered(p, 'danger-scale'),
  },
  {
    id: 'master-terrain', name: '地形师', description: '掌握「地形管理」全部题目',
    category: '分类精通', icon: '⛰️',
    check: (p) => catMastered(p, 'terrain'),
  },
  {
    id: 'master-crystal-types', name: '雪晶学家', description: '掌握「雪晶变质」全部题目',
    category: '分类精通', icon: '❄️',
    check: (p) => catMastered(p, 'crystal-types'),
  },
  {
    id: 'master-rescue', name: '救援先锋', description: '掌握「救援自救」全部题目',
    category: '分类精通', icon: '🆘',
    check: (p) => catMastered(p, 'rescue'),
  },
  {
    id: 'master-decision', name: '决策达人', description: '掌握「决策框架」全部题目',
    category: '分类精通', icon: '🧭',
    check: (p) => catMastered(p, 'decision'),
  },
  {
    id: 'master-weather', name: '气象观察员', description: '掌握「气象观测」全部题目',
    category: '分类精通', icon: '🌤️',
    check: (p) => catMastered(p, 'weather'),
  },
  {
    id: 'master-snow-profile', name: '雪层分析师', description: '掌握「雪层分析」全部题目',
    category: '分类精通', icon: '📐',
    check: (p) => catMastered(p, 'snow-profile'),
  },

  // 连续
  {
    id: 'streak-3', name: '三日连学', description: '连续 3 天答题',
    category: '连续', icon: '🔥',
    check: (p) => p.streak.longest >= 3,
  },
  {
    id: 'streak-7', name: '周学不断', description: '连续 7 天答题',
    category: '连续', icon: '🔥',
    check: (p) => p.streak.longest >= 7,
  },
  {
    id: 'streak-30', name: '月度坚持', description: '连续 30 天答题',
    category: '连续', icon: '🔥',
    check: (p) => p.streak.longest >= 30,
  },

  // 表现
  {
    id: 'perfect-score', name: '满分通过', description: '任意 10+ 题测验 100% 正确',
    category: '表现', icon: '💯',
    check: (p) => p.sessions.some(
      (s) => s.totalQuestions >= 10 && s.score > 0 &&
        Object.keys(s.answers).length === s.totalQuestions &&
        s.completedAt != null &&
        // Check all answers correct
        s.questionIds.every((qid) => {
          const ans = s.answers[qid];
          const h = p.questionHistory[qid];
          // Find the attempt closest to session time
          return h?.attempts.some((a) => a.correct && a.timestamp >= s.startedAt && a.timestamp <= (s.completedAt || Infinity));
        })
    ),
  },
  {
    id: 'exam-master', name: '考试达人', description: '模拟考试得分率 ≥ 90%',
    category: '表现', icon: '🏆',
    check: (p) => p.sessions.some(
      (s) => s.mode === 'exam' && s.completedAt != null && s.totalQuestions > 0 &&
        (s.score / (s.totalQuestions * 10)) >= 0.9
    ),
  },
  {
    id: 'all-rounder', name: '全能选手', description: '所有分类正确率 ≥ 80%',
    category: '表现', icon: '🌟',
    check: (p) => ALL_CATEGORIES.every((cat) => {
      const s = p.categoryStats[cat];
      return s && s.answered >= 10 && (s.correct / s.answered) >= 0.8;
    }),
  },
  {
    id: 'speed-demon', name: '速答王', description: '50 题考试 30 分钟内完成且 ≥ 80%',
    category: '表现', icon: '⚡',
    check: (p) => p.sessions.some(
      (s) => s.mode === 'exam' && s.totalQuestions >= 50 && s.completedAt != null &&
        (s.completedAt - s.startedAt) <= 30 * 60 * 1000 &&
        (s.score / (s.totalQuestions * 10)) >= 0.8
    ),
  },

  // 里程碑
  {
    id: 'master-250', name: '半百', description: '掌握 250 道题目',
    category: '里程碑', icon: '🎯',
    check: (p) => Object.values(p.questionHistory).filter((h) => h.mastered).length >= 250,
  },
  {
    id: 'master-all', name: '全书通关', description: '掌握全部 500 道题目',
    category: '里程碑', icon: '👑',
    check: (p) => Object.values(p.questionHistory).filter((h) => h.mastered).length >= 500,
  },

  // 特殊
  {
    id: 'redemption', name: '知错能改', description: '重新掌握 20 道曾答错的题',
    category: '特殊', icon: '🔄',
    check: (p) => {
      let count = 0;
      for (const h of Object.values(p.questionHistory)) {
        if (h.mastered && h.attempts.some((a) => !a.correct)) count++;
      }
      return count >= 20;
    },
  },
  {
    id: 'scenario-expert', name: '场景专家', description: '答对 30 道情景题',
    category: '特殊', icon: '🎭',
    check: () => false, // Checked dynamically with question type info
  },
];

/** Check for newly unlocked achievements */
export function checkNewAchievements(progress: UserQuizProgress): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!progress.achievements.includes(ach.id) && ach.check(progress)) {
      newlyUnlocked.push(ach.id);
    }
  }
  return newlyUnlocked;
}

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
) as Record<string, AchievementDef>;
