import React from 'react';
import { Check } from 'lucide-react';

export default function QuestionNavigator({
  questions,
  currentIndex,
  userAnswers,
  onSelectQuestion,
  isSubmitting
}) {
  const isQuestionAnswered = (q) => {
    const val = userAnswers[q.id];
    return val !== undefined && val !== null && String(val).trim() !== '';
  };

  return (
    <div className="navigator-container">
      <div className="navigator-header">
        <span className="navigator-title">Question Navigator</span>
        <div className="navigator-legend">
          <span className="legend-item">
            <span className="legend-indicator answered" /> Answered
          </span>
          <span className="legend-item">
            <span className="legend-indicator current" /> Current
          </span>
          <span className="legend-item">
            <span className="legend-indicator unanswered" /> Unanswered
          </span>
        </div>
      </div>

      <div className="navigator-grid" role="navigation" aria-label="Question Navigator">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const answered = isQuestionAnswered(q);

          let itemClass = 'nav-item';
          if (isCurrent) itemClass += ' current';
          if (answered) itemClass += ' answered';

          return (
            <button
              key={q.id}
              type="button"
              className={itemClass}
              onClick={() => onSelectQuestion(idx)}
              disabled={isSubmitting}
              title={`Question ${idx + 1} (${q.topic} - ${q.type === 'mcq' ? 'MCQ' : 'Code'}): ${answered ? 'Answered' : 'Unanswered'}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="nav-number">{idx + 1}</span>
              {answered && !isCurrent && (
                <Check size={10} className="nav-check-icon" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
