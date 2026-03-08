import { useEffect, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuizSessionStore } from '../store/quizSession.store';
import { useQuizStore } from '../store/quiz.store';
import { QuizTimer } from '../components/quiz/QuizTimer';
import { CATEGORY_MAP } from '../data/quiz/categories';
import type { QuizQuestion } from '../types/quiz.types';
import './QuizSessionPage.css';

const DIFFICULTY_LABEL: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难' };
const DIFFICULTY_CLASS: Record<string, string> = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };

export function QuizSessionPage() {
  const navigate = useNavigate();
  const session = useQuizSessionStore();
  const recordAnswer = useQuizStore((s) => s.recordAnswer);
  const saveSession = useQuizStore((s) => s.saveSession);
  const saveDailyScore = useQuizStore((s) => s.saveDailyScore);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  // Redirect if no active session
  useEffect(() => {
    if (!session.isActive && !session.completedAt) {
      navigate('/safety/quiz');
    }
  }, [session.isActive, session.completedAt, navigate]);

  const question = session.questions[session.currentIndex] as QuizQuestion | undefined;
  const isLast = session.currentIndex === session.questions.length - 1;
  const answered = question ? !!session.answers[question.id] : false;
  const isImmediate = session.isImmediateFeedback();

  const handleAnswer = useCallback((optionId: string) => {
    if (!question || (answered && isImmediate)) return;

    if (question.type === 'multiple') {
      setSelectedMultiple((prev) => {
        if (prev.includes(optionId)) return prev.filter((id) => id !== optionId);
        return [...prev, optionId];
      });
      return;
    }

    const correct = session.answerQuestion(question.id, optionId);
    recordAnswer(question.id, question.category, correct, question.type);
  }, [question, answered, isImmediate, session, recordAnswer]);

  const handleSubmitMultiple = useCallback(() => {
    if (!question || selectedMultiple.length === 0) return;
    const correct = session.answerQuestion(question.id, selectedMultiple);
    recordAnswer(question.id, question.category, correct, question.type);
    setSelectedMultiple([]);
  }, [question, selectedMultiple, session, recordAnswer]);

  const handleNext = useCallback(() => {
    if (isLast) {
      handleComplete();
    } else {
      session.nextQuestion();
      setSelectedMultiple([]);
    }
  }, [isLast, session]);

  const handleComplete = useCallback(() => {
    session.completeSession();
    const score = session.getScore();
    const correctCount = session.getCorrectCount();

    saveSession({
      id: session.sessionId,
      mode: session.mode,
      category: session.category,
      startedAt: session.startedAt,
      completedAt: Date.now(),
      questionIds: session.questions.map((q) => q.id),
      answers: session.answers,
      score,
      correctCount,
      totalQuestions: session.questions.length,
    });

    if (session.mode === 'daily') {
      saveDailyScore(score);
    }

    navigate('/safety/quiz/result');
  }, [session, saveSession, saveDailyScore, navigate]);

  const handleTimeUp = useCallback(() => {
    // Record unanswered questions
    for (const q of session.questions) {
      if (!session.answers[q.id]) {
        recordAnswer(q.id, q.category, false, q.type);
      }
    }
    handleComplete();
  }, [session, recordAnswer, handleComplete]);

  if (!question) return null;

  const catMeta = CATEGORY_MAP[question.category];
  const userAnswer = session.answers[question.id];
  const correctAnswer = question.correctAnswer;

  function getOptionClass(optId: string): string {
    const classes = ['quiz-option'];

    if (question!.type === 'multiple' && !answered) {
      if (selectedMultiple.includes(optId)) classes.push('quiz-option-selected');
      return classes.join(' ');
    }

    if (!answered && !isImmediate) {
      // Exam mode: show selected
      if (userAnswer === optId || (Array.isArray(userAnswer) && userAnswer.includes(optId))) {
        classes.push('quiz-option-selected');
      }
      return classes.join(' ');
    }

    if (answered && isImmediate) {
      const isCorrect = Array.isArray(correctAnswer)
        ? correctAnswer.includes(optId)
        : correctAnswer === optId;
      const isUserChoice = Array.isArray(userAnswer)
        ? userAnswer.includes(optId)
        : userAnswer === optId;

      if (isCorrect) classes.push('quiz-option-correct');
      if (isUserChoice && !isCorrect) classes.push('quiz-option-wrong');
      return classes.join(' ');
    }

    // Exam/daily: just show selected
    if (userAnswer === optId || (Array.isArray(userAnswer) && userAnswer.includes(optId))) {
      classes.push('quiz-option-selected');
    }

    return classes.join(' ');
  }

  const progressPercent = ((session.currentIndex + 1) / session.questions.length) * 100;

  return (
    <div className="quiz-session-page">
      {/* Progress bar */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="quiz-session-container">
        {/* Header */}
        <div className="quiz-session-header">
          <div className="quiz-session-meta">
            {catMeta && <span className="quiz-tag quiz-tag-cat">{catMeta.name}</span>}
            <span className={`quiz-tag ${DIFFICULTY_CLASS[question.difficulty]}`}>
              {DIFFICULTY_LABEL[question.difficulty]}
            </span>
          </div>
          <div className="quiz-session-counter">
            第 {session.currentIndex + 1} 题 / 共 {session.questions.length} 题
          </div>
          {session.timeLimit && (
            <QuizTimer
              timeLimit={session.timeLimit}
              startedAt={session.startedAt}
              onTimeUp={handleTimeUp}
            />
          )}
        </div>

        {/* Scenario context */}
        {question.scenarioContext && (
          <div className="quiz-scenario">
            <span className="quiz-scenario-label">场景描述</span>
            <p>{question.scenarioContext}</p>
          </div>
        )}

        {/* Question */}
        <div className="quiz-question-card">
          <h2 className="quiz-question-text">{question.question}</h2>

          {/* Options */}
          <div className="quiz-options">
            {question.options.map((opt, i) => (
              <button
                key={opt.id}
                className={getOptionClass(opt.id)}
                onClick={() => handleAnswer(opt.id)}
                disabled={answered && isImmediate}
              >
                <span className="quiz-option-prefix">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="quiz-option-text">{opt.text}</span>
                {answered && isImmediate && (
                  <>
                    {(Array.isArray(correctAnswer) ? correctAnswer.includes(opt.id) : correctAnswer === opt.id) && (
                      <span className="quiz-option-icon">✓</span>
                    )}
                    {(Array.isArray(userAnswer) ? userAnswer.includes(opt.id) : userAnswer === opt.id) &&
                     !(Array.isArray(correctAnswer) ? correctAnswer.includes(opt.id) : correctAnswer === opt.id) && (
                      <span className="quiz-option-icon quiz-option-icon-wrong">✗</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Multiple choice submit */}
          {question.type === 'multiple' && !answered && selectedMultiple.length > 0 && (
            <button className="quiz-submit-multiple" onClick={handleSubmitMultiple}>
              确认选择（已选 {selectedMultiple.length} 项）
            </button>
          )}
        </div>

        {/* Explanation panel (immediate feedback) */}
        {answered && isImmediate && (
          <div className={`quiz-explanation ${session.lastAnswerCorrect ? 'quiz-explanation-correct' : 'quiz-explanation-wrong'}`}>
            <div className="quiz-explanation-header">
              {session.lastAnswerCorrect ? '✓ 回答正确' : '✗ 回答错误'}
            </div>
            <p className="quiz-explanation-text">{question.explanation}</p>
            <p className="quiz-explanation-takeaway">
              <strong>核心要点：</strong>{question.keyTakeaway}
            </p>
            {question.relatedPage && (
              <Link to={question.relatedPage} className="quiz-explanation-link">
                了解更多 →
              </Link>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="quiz-nav-btn quiz-nav-prev"
            onClick={() => { session.prevQuestion(); setSelectedMultiple([]); }}
            disabled={session.currentIndex === 0}
          >
            上一题
          </button>

          {!answered && !isImmediate && (
            <button className="quiz-nav-btn quiz-nav-skip" onClick={() => { session.skipQuestion(); setSelectedMultiple([]); }}>
              跳过
            </button>
          )}

          {(answered || !isImmediate) && (
            <button className="quiz-nav-btn quiz-nav-next" onClick={handleNext}>
              {isLast ? (isImmediate && answered ? '查看结果' : '提交') : '下一题'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
