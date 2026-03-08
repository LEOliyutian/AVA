import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quiz.store';
import { useQuizSessionStore } from '../store/quizSession.store';
import { QUIZ_CATEGORIES } from '../data/quiz/categories';
import { loadCategory, loadAllQuestions } from '../data/quiz/index';
import { shuffle, smartSelect, selectExamQuestions, selectDailyQuestions, getTodayStr, categoryMasteryPercent } from '../utils/quiz';
import { ACHIEVEMENTS } from '../data/quiz/achievements';
import { CategoryRing } from '../components/quiz/CategoryRing';
import { AchievementCard } from '../components/quiz/AchievementCard';
import type { CategoryId } from '../types/quiz.types';
import './QuizHubPage.css';

export function QuizHubPage() {
  const navigate = useNavigate();
  const progress = useQuizStore();
  const startSession = useQuizSessionStore((s) => s.startSession);
  const [loading, setLoading] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const totalMastered = Object.values(progress.categoryStats).reduce((s, c) => s + c.mastered, 0);
  const todayDone = !!progress.dailyChallengeHistory[getTodayStr()];

  async function handleQuickPractice() {
    setLoading(true);
    try {
      const all = await loadAllQuestions();
      const selected = smartSelect(all, progress.questionHistory, 10);
      startSession({ mode: 'practice', questions: selected });
      navigate('/safety/quiz/session');
    } finally {
      setLoading(false);
    }
  }

  async function handleExam() {
    setLoading(true);
    try {
      const all = await loadAllQuestions();
      const selected = selectExamQuestions(all, progress.questionHistory, 50);
      startSession({ mode: 'exam', questions: selected, timeLimit: 60 * 60 * 1000 });
      navigate('/safety/quiz/session');
    } finally {
      setLoading(false);
    }
  }

  async function handleCategory(catId: CategoryId) {
    setLoading(true);
    try {
      const questions = await loadCategory(catId);
      startSession({ mode: 'category', questions: shuffle(questions), category: catId });
      navigate('/safety/quiz/session');
    } finally {
      setLoading(false);
    }
  }

  async function handleDaily() {
    if (todayDone) return;
    setLoading(true);
    try {
      const all = await loadAllQuestions();
      const selected = selectDailyQuestions(all, 5);
      startSession({ mode: 'daily', questions: selected, timeLimit: 3 * 60 * 1000 });
      navigate('/safety/quiz/session');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview() {
    setLoading(true);
    try {
      const wrongIds = progress.getWrongQuestionIds();
      if (wrongIds.length === 0) {
        setLoading(false);
        return;
      }
      const all = await loadAllQuestions();
      const wrongQuestions = all.filter((q) => wrongIds.includes(q.id));
      startSession({ mode: 'review', questions: shuffle(wrongQuestions) });
      navigate('/safety/quiz/session');
    } finally {
      setLoading(false);
    }
  }

  const wrongCount = progress.getWrongQuestionIds().length;

  return (
    <div className="taiga-page">
      <main className="taiga-main">
        <div className="quiz-hub-back">
          <Link to="/safety">← 安全知识中心</Link>
        </div>

        {/* Hero */}
        <div className="quiz-hub-hero">
          <span className="safety-home-tag">Knowledge Quiz</span>
          <h1 className="safety-home-title">安全知识测验</h1>
          <p className="safety-home-subtitle">
            检验你的雪崩安全知识，巩固野外安全技能
          </p>
        </div>

        {/* Stats bar */}
        {progress.totalAnswered > 0 && (
          <div className="quiz-hub-stats">
            <div className="quiz-hub-stat">
              <span className="quiz-hub-stat-value">{progress.totalAnswered}</span>
              <span className="quiz-hub-stat-label">总答题</span>
            </div>
            <div className="quiz-hub-stat">
              <span className="quiz-hub-stat-value">{accuracy}%</span>
              <span className="quiz-hub-stat-label">正确率</span>
            </div>
            <div className="quiz-hub-stat">
              <span className="quiz-hub-stat-value">
                {progress.streak.current > 0 && '🔥 '}{progress.streak.current}
              </span>
              <span className="quiz-hub-stat-label">连续天数</span>
            </div>
            <div className="quiz-hub-stat">
              <span className="quiz-hub-stat-value">{totalMastered}/500</span>
              <span className="quiz-hub-stat-label">已掌握</span>
            </div>
          </div>
        )}

        {/* Mode selection */}
        <div className="quiz-hub-modes">
          <button className="quiz-mode-card" onClick={handleQuickPractice} disabled={loading}>
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>快速练习</h3>
            <p>随机 10 题，即时反馈</p>
          </button>

          <button className="quiz-mode-card" onClick={handleExam} disabled={loading}>
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h6" />
              </svg>
            </div>
            <h3>模拟考试</h3>
            <p>50 题，60 分钟限时</p>
          </button>

          <button className="quiz-mode-card quiz-mode-card-outline" onClick={() => {}} disabled={loading}>
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h3>分类练习</h3>
            <p>选择下方分类开始</p>
          </button>

          <button
            className={`quiz-mode-card ${todayDone ? 'quiz-mode-done' : ''}`}
            onClick={handleDaily}
            disabled={loading || todayDone}
          >
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M12 14l-2 2 2 2" />
              </svg>
            </div>
            <h3>每日挑战</h3>
            <p>{todayDone ? '今日已完成' : '5 题，3 分钟限时'}</p>
          </button>

          <button
            className="quiz-mode-card"
            onClick={handleReview}
            disabled={loading || wrongCount === 0}
          >
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </div>
            <h3>错题回顾</h3>
            <p>{wrongCount > 0 ? `${wrongCount} 道错题待复习` : '暂无错题'}</p>
          </button>

          <button className="quiz-mode-card" onClick={() => setShowAchievements(!showAchievements)} disabled={loading}>
            <div className="quiz-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h3>成就徽章</h3>
            <p>{progress.achievements.length}/24 已解锁</p>
          </button>
        </div>

        {/* Achievements panel */}
        {showAchievements && (
          <div className="quiz-hub-achievements">
            <h2 className="quiz-hub-section-title">成就徽章</h2>
            <div className="quiz-hub-achievements-grid">
              {ACHIEVEMENTS.map((ach) => (
                <AchievementCard
                  key={ach.id}
                  icon={ach.icon}
                  name={ach.name}
                  description={ach.description}
                  category={ach.category}
                  unlocked={progress.achievements.includes(ach.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category rings */}
        <div className="quiz-hub-categories">
          <h2 className="quiz-hub-section-title">分类掌握度</h2>
          <div className="quiz-hub-rings">
            {QUIZ_CATEGORIES.map((cat) => {
              const stats = progress.categoryStats[cat.id];
              const percent = categoryMasteryPercent(stats);
              return (
                <CategoryRing
                  key={cat.id}
                  name={cat.name}
                  subtitle={cat.subtitle}
                  percent={percent}
                  mastered={stats.mastered}
                  total={cat.totalQuestions}
                  to={cat.relatedPage}
                />
              );
            })}
          </div>
          <div className="quiz-hub-cat-buttons">
            {QUIZ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="quiz-cat-btn"
                onClick={() => handleCategory(cat.id)}
                disabled={loading}
              >
                {cat.name}
                <span className="quiz-cat-btn-count">{cat.totalQuestions} 题</span>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="quiz-hub-loading">
            <div className="loading-spinner" />
            <span>加载题目中...</span>
          </div>
        )}
      </main>
    </div>
  );
}
