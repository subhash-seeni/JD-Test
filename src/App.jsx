import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionNavigator from './components/QuestionNavigator';
import QuestionCard from './components/QuestionCard';
import ResultsPage from './components/ResultsPage';
import SkipConfirmModal from './components/SkipConfirmModal';
import Toast from './components/Toast';
import { QUESTIONS } from './data/questions';
import { TEST_DURATION_MINUTES, ALLOW_BACK } from './config';
import { gradeAllAnswers } from './graders';
import { sendAssessmentResultsEmail } from './utils/sendResultsEmail';

export default function App() {
  // Shuffle MCQ options once per session while keeping the 22 questions in exact order
  const initializedQuestions = useMemo(() => {
    return QUESTIONS.map((q) => {
      if (q.type === 'mcq' && Array.isArray(q.options)) {
        // Deterministic shuffle copy
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);
        return { ...q, options: shuffled };
      }
      return q;
    });
  }, []);

  const [questions, setQuestions] = useState(initializedQuestions);
  const [candidate, setCandidate] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradedResults, setGradedResults] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const totalDurationSeconds = TEST_DURATION_MINUTES * 60;

  // Count answered questions (non-empty string or selected MCQ)
  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const val = userAnswers[q.id];
      return val !== undefined && val !== null && String(val).trim() !== '';
    }).length;
  }, [questions, userAnswers]);

  // Toast notification helper
  const showToast = useCallback((message, type = 'warning') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Anti-Copy Protection: Right-Click and Copy/Cut Shortcuts
  useEffect(() => {
    // Only enforce anti-copy once test is started and active
    if (!isStarted || isFinished) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      showToast('Right-click is disabled during the test');
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
        // Block copying/cutting from page
        e.preventDefault();
        showToast('Copying is disabled during the test');
      }
    };

    const handleCopyCut = (e) => {
      e.preventDefault();
      showToast('Copying is disabled during the test');
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopyCut);
    window.addEventListener('cut', handleCopyCut);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopyCut);
      window.removeEventListener('cut', handleCopyCut);
    };
  }, [isStarted, isFinished, showToast]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers[currentQuestion?.id];
  const isCurrentAnswered = currentAnswer !== undefined && currentAnswer !== null && String(currentAnswer).trim() !== '';

  const handleStartTest = (candidateInfo) => {
    setCandidate(candidateInfo);
    setIsStarted(true);
    setStartTime(Date.now());
    showToast(`Welcome ${candidateInfo.name}. Assessment timer started.`, 'info');
  };

  const handleAnswerChange = (val) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val
    }));
  };

  const handleNext = () => {
    if (!isCurrentAnswered) {
      setShowSkipModal(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkipConfirm = () => {
    setShowSkipModal(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowSkipModal(false);

    const elapsed = startTime
      ? Math.min(totalDurationSeconds, Math.floor((Date.now() - startTime) / 1000))
      : 0;
    setTimeTakenSeconds(elapsed);

    try {
      // 1. Auto-grade all answers
      const results = await gradeAllAnswers(questions, userAnswers);
      setGradedResults(results);

      // 2. Compute summary metrics for email payload
      let totalScore = 0;
      let mcqCorrect = 0;
      let mcqIncorrect = 0;
      let mcqTotal = 0;
      const topicStats = {
        HTML: { earned: 0, total: 0 },
        CSS: { earned: 0, total: 0 },
        JS: { earned: 0, total: 0 },
        PHP: { earned: 0, total: 0 }
      };

      questions.forEach((q) => {
        const res = results[q.id];
        const s = res ? (res.score || 0) : 0;
        totalScore += s;
        if (topicStats[q.topic]) {
          topicStats[q.topic].earned += s;
          topicStats[q.topic].total += 1;
        }
        if (q.type === 'mcq') {
          mcqTotal += 1;
          if (res && res.isCorrect) mcqCorrect += 1;
          else mcqIncorrect += 1;
        }
      });

      // 3. Dispatch automated email via EmailJS in the background
      sendAssessmentResultsEmail({
        candidate: candidate || { name: 'Anonymous Candidate', email: 'unknown' },
        questions,
        userAnswers,
        gradedResults: results,
        timeTakenSeconds: elapsed,
        totalScore,
        totalQuestions: questions.length,
        mcqStats: { correct: mcqCorrect, incorrect: mcqIncorrect, total: mcqTotal },
        topicStats
      }).catch((emailErr) => {
        // Log to console for debugging as required, never block candidate UI
        console.error('Background email dispatch encountered error:', emailErr);
      });

      setIsFinished(true);
    } catch (err) {
      console.error('Grading error:', err);
      showToast('Encountered an issue grading some answers. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    showToast('Time has expired! Submitting your assessment...', 'warning');
    handleSubmit();
  };

  const handleRetake = () => {
    // Re-shuffle MCQ options
    const freshQuestions = QUESTIONS.map((q) => {
      if (q.type === 'mcq' && Array.isArray(q.options)) {
        return { ...q, options: [...q.options].sort(() => Math.random() - 0.5) };
      }
      return q;
    });

    setQuestions(freshQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsStarted(false);
    setIsFinished(false);
    setGradedResults({});
    setStartTime(null);
    setTimeTakenSeconds(0);
    showToast('Assessment reset. Please re-enter your details to begin.', 'info');
  };

  return (
    <div className="app-container">
      <Header
        isStarted={isStarted}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        durationSeconds={totalDurationSeconds}
        isFinished={isFinished}
        onTimeUp={handleTimeUp}
        candidate={candidate}
      />

      <main className="main-content">
        {!isStarted ? (
          <WelcomeScreen
            onStart={handleStartTest}
            totalQuestions={questions.length}
          />
        ) : !isFinished ? (
          <>
            {/* Question Navigator */}
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              userAnswers={userAnswers}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              isSubmitting={isSubmitting}
            />

            {/* Current Question */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                answer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                onNext={handleNext}
                onPrev={handlePrev}
                onSubmit={handleSubmit}
                onSkip={() => setShowSkipModal(true)}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
                isAnswered={isCurrentAnswered}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        ) : (
          <ResultsPage
            candidate={candidate}
            questions={questions}
            userAnswers={userAnswers}
            gradedResults={gradedResults}
            timeTakenSeconds={timeTakenSeconds}
            totalDurationSeconds={totalDurationSeconds}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Skip confirmation modal */}
      <SkipConfirmModal
        isOpen={showSkipModal}
        questionNumber={currentIndex + 1}
        onCancel={() => setShowSkipModal(false)}
        onConfirm={handleSkipConfirm}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
