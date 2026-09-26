import React from 'react';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import { CheckCircle, UserCheck } from 'lucide-react';

export default function Header({
  isStarted,
  answeredCount,
  totalQuestions,
  durationSeconds,
  isFinished,
  onTimeUp,
  candidate
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-section">
          <span className="brand-badge">DevSkills</span>
          <h1 className="brand-title">Junior Developer Assessment</h1>
        </div>

        <div className="header-status">
          {!isStarted ? (
            <div className="status-pill status-ready">
              <span>Ready to Start</span>
            </div>
          ) : !isFinished ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {candidate?.name && (
                <div className="candidate-tag" title={`Candidate: ${candidate.name} (${candidate.email})`}>
                  <UserCheck size={13} />
                  <span>{candidate.name}</span>
                </div>
              )}
              <Timer
                durationSeconds={durationSeconds}
                onTimeUp={onTimeUp}
                isActive={isStarted && !isFinished}
              />
            </div>
          ) : (
            <div className="timer-pill" style={{ color: 'var(--success)', borderColor: 'var(--success-border)', background: 'var(--success-bg)' }}>
              <CheckCircle size={15} />
              <span>Assessment Completed</span>
            </div>
          )}
        </div>
      </div>

      {isStarted && !isFinished && (
        <ProgressBar answeredCount={answeredCount} total={totalQuestions} />
      )}
    </header>
  );
}
