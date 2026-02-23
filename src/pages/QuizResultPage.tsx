import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuizSessionStore } from '../store/quizSession.store';
import { useQuizStore } from '../store/quiz.store';
import { CATEGORY_MAP } from '../data/quiz/categories';
import { isAnswerCorrect } from '../utils/quiz';
import type { CategoryId } from '../types/quiz.types';
import './QuizResultPage.css';

export function QuizResultPage() {
  const navigate = useNavigate();
  const session = useQuizSessionStore();
  const newAchievements = useQuizStore((s) => s.achievements);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { score, correctCount, totalQuestions, percentage, categoryBreakdown, wrongQuestions } = useMemo(() => {
    const score = session.getScore();
    const correctCount = session.getCorrectCount();
    const totalQuestions = session.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Category breakdown
    const catMap: Record<string, { correct: number; total: number }> = {};
    for (const q of session.questions) {
      if (!catMap[q.category]) catMap[q.category] = { correct: 0, total: 0 };
      catMap[q.category].total++;
      if (isAnswerCorrect(q, session.answers[q.id])) {
        catMap[q.category].correct++;
      }
    }

    const wrongQuestions = session.questions.filter(
      (q) => !isAnswerCorrect(q, session.answers[q.id])
    );

    return { score, correctCount, totalQuestions, percentage, categoryBreakdown: catMap, wrongQuestions };
  }, [session]);

  if (totalQuestions === 0) {
    navigate('/safety/quiz');
    return null;
  }

  const gradeColor = percentage >= 90 ? 'var(--success)' :
    percentage >= 70 ? 'var(--accent)' :
    percentage >= 50 ? 'var(--warning)' : 'var(--error)';

  const gradeLabel = percentage >= 90 ? '优秀' :
    percentage >= 70 ? '良好' :
    percentage >= 50 ? '及格' : '需要加强';

  return (
    <div className="taiga-page">
      <main className="taiga-main quiz-result-main">
        {/* Score display */}
        <div className="quiz-result-score" style={{ '--grade-color': gradeColor } as React.CSSProperties}>
          <div className="quiz-result-score-big">{percentage}%</div>
          <div className="quiz-result-score-label">{gradeLabel}</div>
          <div className="quiz-result-score-detail">
            {correctCount}/{totalQuestions} 题正确 · 得分 {score}
          </div>
          {session.completedAt && session.startedAt && (
            <div className="quiz-result-time">
              用时 {Math.ceil((session.completedAt - session.startedAt) / 1000 / 60)} 分钟
            </div>
          )}
        </div>

        {/* Category breakdown bar chart */}
        {Object.keys(categoryBreakdown).length > 1 && (
          <div className="quiz-result-chart">
            <h3 className="quiz-result-section-title">分类正确率</h3>
            <div className="quiz-result-bars">
              {Object.entries(categoryBreakdown).map(([catId, data]) => {
                const pct = Math.round((data.correct / data.total) * 100);
                const meta = CATEGORY_MAP[catId];
                return (
                  <div key={catId} className="quiz-result-bar-row">
                    <span className="quiz-result-bar-label">{meta?.name || catId}</span>
                    <div className="quiz-result-bar-track">
                      <div
                        className="quiz-result-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="quiz-result-bar-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wrong questions */}
        {wrongQuestions.length > 0 && (
          <div className="quiz-result-wrong">
            <h3 className="quiz-result-section-title">
              错题回顾（{wrongQuestions.length} 题）
            </h3>
            <div className="quiz-result-wrong-list">
              {wrongQuestions.map((q) => {
                const expanded = expandedId === q.id;
                const userAns = session.answers[q.id];
                const correctOpt = q.options.find((o) =>
                  Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(o.id) : q.correctAnswer === o.id
                );
                const userOpt = q.options.find((o) =>
                  Array.isArray(userAns) ? userAns.includes(o.id) : userAns === o.id
                );

                return (
                  <div key={q.id} className="quiz-wrong-item">
                    <button
                      className="quiz-wrong-header"
                      onClick={() => setExpandedId(expanded ? null : q.id)}
                    >
                      <span className="quiz-wrong-q">{q.question}</span>
                      <span className="quiz-wrong-toggle">{expanded ? '收起' : '展开'}</span>
                    </button>
                    {expanded && (
                      <div className="quiz-wrong-detail">
                        <p className="quiz-wrong-answer">
                          <span className="quiz-wrong-label-bad">你的答案：</span>
                          {userOpt?.text || (Array.isArray(userAns)
                            ? q.options.filter((o) => userAns.includes(o.id)).map((o) => o.text).join('、')
                            : '未作答'
                          )}
                        </p>
                        <p className="quiz-wrong-answer">
                          <span className="quiz-wrong-label-good">正确答案：</span>
                          {Array.isArray(q.correctAnswer)
                            ? q.options.filter((o) => q.correctAnswer.includes(o.id)).map((o) => o.text).join('、')
                            : correctOpt?.text
                          }
                        </p>
                        <p className="quiz-wrong-explanation">{q.explanation}</p>
                        <p className="quiz-wrong-takeaway">
                          <strong>核心要点：</strong>{q.keyTakeaway}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="quiz-result-actions">
          {wrongQuestions.length > 0 && (
            <button
              className="quiz-result-btn quiz-result-btn-outline"
              onClick={() => {
                session.startSession({
                  mode: 'review',
                  questions: wrongQuestions,
                });
                navigate('/safety/quiz/session');
              }}
            >
              重做错题
            </button>
          )}
          <button
            className="quiz-result-btn quiz-result-btn-primary"
            onClick={() => navigate('/safety/quiz')}
          >
            返回题库首页
          </button>
        </div>
      </main>
    </div>
  );
}
