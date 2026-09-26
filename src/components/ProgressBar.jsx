import React from 'react';

export default function ProgressBar({ answeredCount, total }) {
  const percent = Math.min(100, Math.round((answeredCount / total) * 100));

  return (
    <div className="header-progress-wrap">
      <div className="header-progress-inner">
        <span className="progress-text">
          {answeredCount} of {total} Questions Answered
        </span>
        <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-percent">{percent}%</span>
      </div>
    </div>
  );
}
