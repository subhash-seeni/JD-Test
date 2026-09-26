import React from 'react';
import CodeEditor from './CodeEditor';
import { ArrowRight, ArrowLeft, Send, SkipForward } from 'lucide-react';
import { ALLOW_SKIP } from '../config';

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
  onNext,
  onPrev,
  onSubmit,
  onSkip,
  isFirst,
  isLast,
  isAnswered,
  isSubmitting
}) {
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleResetCode = () => {
    onAnswerChange(question.placeholder || '');
  };

  return (
    <div className="question-card">
      <div className="meta-row">
        <div className="meta-tags">
          <span className={`tag tag-topic ${question.topic}`}>
            {question.topic}
          </span>
          <span className="tag tag-type">
            {question.type === 'mcq' ? 'Multiple Choice' : 'Code Implementation'}
          </span>
        </div>
        <span className={`tag-difficulty difficulty-${question.difficulty}`}>
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      <h1 className="question-text">{question.question}</h1>

      {question.type === 'mcq' ? (
        <div className="mcq-options-grid" role="radiogroup" aria-label="Question options">
          {question.options.map((option, idx) => {
            const isSelected = answer === option;
            const letter = optionLetters[idx] || String(idx + 1);

            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`mcq-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onAnswerChange(option)}
              >
                <span className="mcq-key">{letter}</span>
                <span className="mcq-label">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <CodeEditor
          question={question}
          value={answer ?? question.placeholder ?? ''}
          onChange={onAnswerChange}
          onReset={handleResetCode}
        />
      )}

      {/* Navigation Footer */}
      <div className="action-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onPrev}
            disabled={isFirst || isSubmitting}
            title={isFirst ? 'You are on the first question' : 'Go back to previous question'}
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          {ALLOW_SKIP && !isAnswered && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSkip}
              disabled={isSubmitting}
              title="Skip this question for now"
            >
              <SkipForward size={16} />
              Skip
            </button>
          )}
        </div>

        <div>
          {isLast ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? 'Grading & Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNext}
              disabled={isSubmitting}
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
