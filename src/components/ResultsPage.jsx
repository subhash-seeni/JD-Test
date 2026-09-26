import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Code,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  X,
  User,
  Mail,
  Send,
  FileCheck
} from 'lucide-react';

export default function ResultsPage({
  candidate,
  questions,
  userAnswers,
  gradedResults,
  timeTakenSeconds,
  totalDurationSeconds,
  onRetake
}) {
  const [expandedCodeIds, setExpandedCodeIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedCodeIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 1. Calculate overall score (MCQ + Code combined)
  const totalQuestions = questions.length;
  let totalEarnedPoints = 0;
  let mcqCorrect = 0;
  let mcqIncorrect = 0;
  let mcqTotal = 0;
  let codeEarnedPoints = 0;
  let codeTotal = 0;

  // Topic aggregations
  const topicStats = {
    HTML: { earned: 0, total: 0 },
    CSS: { earned: 0, total: 0 },
    JS: { earned: 0, total: 0 },
    PHP: { earned: 0, total: 0 }
  };

  questions.forEach((q) => {
    const result = gradedResults[q.id];
    const score = result ? (result.score || 0) : 0;
    totalEarnedPoints += score;

    if (topicStats[q.topic]) {
      topicStats[q.topic].earned += score;
      topicStats[q.topic].total += 1;
    }

    if (q.type === 'mcq') {
      mcqTotal += 1;
      if (result && result.isCorrect) {
        mcqCorrect += 1;
      } else {
        mcqIncorrect += 1;
      }
    } else {
      codeTotal += 1;
      codeEarnedPoints += score;
    }
  });

  const percentage = Math.round((totalEarnedPoints / totalQuestions) * 100);

  // Format time taken
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Code questions list
  const codeQuestions = questions.filter((q) => q.type === 'code');

  return (
    <div className="results-page">
      {/* Submission Confirmation Notification */}
      <div className="submission-confirm-banner">
        <div className="confirm-icon-box">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h2 className="confirm-heading">Submitted</h2>
          <p className="confirm-subtext">
            Your assessment has been successfully submitted.
          </p>
        </div>
      </div>

      {/* Top Banner with Total Score & Candidate Details */}
      <div className="results-banner">
        {/* Candidate Profile Strip */}
        {candidate && (
          <div className="candidate-profile-strip">
            <div className="candidate-info-cell">
              <User size={15} className="candidate-cell-icon" />
              <span>Candidate: <strong>{candidate.name}</strong></span>
            </div>
            <div className="candidate-info-cell">
              <Mail size={15} className="candidate-cell-icon" />
              <span>Email: <strong>{candidate.email}</strong></span>
            </div>
          </div>
        )}

        <div className="results-banner-header">
          <div>
            <div className="score-display">
              <span className="score-number">{Math.round(totalEarnedPoints * 10) / 10}</span>
              <span className="score-max">/ {totalQuestions} points ({percentage}%)</span>
            </div>
            <div className={`score-badge ${percentage >= 70 ? 'score-pass' : 'score-warn'}`}>
              {percentage >= 70 ? 'Satisfactory Performance' : 'Needs Review'}
            </div>
          </div>

          <button className="btn btn-outline" onClick={onRetake}>
            <RotateCcw size={16} />
            Retake Assessment
          </button>
        </div>

        {/* Disclaimer as specified in prompt */}
        <div className="results-disclaimer">
          <AlertTriangle size={16} />
          <span>Code question scores are auto-graded and approximate - please spot-check before final evaluation.</span>
        </div>

        {/* Summary Stats */}
        <div className="results-stats-row">
          <div className="stat-box">
            <div className="stat-label">MCQ Performance</div>
            <div className="stat-value">{mcqCorrect} / {mcqTotal} correct</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mcqIncorrect} incorrect or skipped</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Code Score</div>
            <div className="stat-value">{Math.round(codeEarnedPoints * 10) / 10} / {codeTotal} pts</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Across 5 implementation tasks</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Time Taken</div>
            <div className="stat-value">{formatTime(timeTakenSeconds)}</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Allowed: {Math.round(totalDurationSeconds / 60)}m</span>
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="results-section">
        <div className="section-title">
          <span>Performance by Topic</span>
          <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
            HTML, CSS, JavaScript, PHP
          </span>
        </div>

        <div className="topic-grid">
          {Object.entries(topicStats).map(([topic, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
            return (
              <div key={topic} className="topic-card">
                <div className="topic-header">
                  <span className={`tag tag-topic ${topic}`}>{topic}</span>
                  <span className="topic-score-val">{pct}%</span>
                </div>
                <div className="topic-progress-bar">
                  <div className="topic-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {Math.round(stats.earned * 10) / 10} / {stats.total} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Code-Question Breakdown */}
      <div className="results-section">
        <div className="section-title">
          <span>Code Implementation Breakdown</span>
          <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
            5 Questions Auto-Graded
          </span>
        </div>

        <div className="code-breakdown-list">
          {codeQuestions.map((q) => {
            const result = gradedResults[q.id] || { score: 0, details: [] };
            const isExpanded = !!expandedCodeIds[q.id];
            const scorePercent = Math.round((result.score || 0) * 100);

            let badgeClass = 'badge-red';
            if (scorePercent >= 80) badgeClass = 'badge-green';
            else if (scorePercent >= 40) badgeClass = 'badge-yellow';

            return (
              <div key={q.id} className="code-breakdown-item">
                <div className="code-item-header" onClick={() => toggleExpand(q.id)}>
                  <div className="code-item-title">
                    <span className={`tag tag-topic ${q.topic}`}>{q.topic}</span>
                    <span>Q{q.id}: {q.question.slice(0, 65)}...</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`code-item-badge ${badgeClass}`}>
                      Score: {scorePercent}%
                    </span>
                    <button
                      type="button"
                      className="btn-editor-action"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {isExpanded ? 'Hide Code' : 'View Code'}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="code-item-content">
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Question Prompt:</strong> {q.question}
                    </div>

                    {/* Notice for PHP as required by prompt */}
                    {q.topic === 'PHP' && (
                      <div className="manual-review-note">
                        <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                        Auto-graded (approximate static evaluation) - recommend manual code review.
                      </div>
                    )}

                    {/* Notice if anti-pattern triggered for Q11 */}
                    {result.notes && (
                      <div className="manual-review-note" style={{ background: '#fef2f2', color: '#991b1b', marginTop: '6px' }}>
                        {result.notes}
                      </div>
                    )}

                    {/* Breakdown table of test criteria */}
                    {result.details && result.details.length > 0 && (
                      <table className="code-details-table">
                        <thead>
                          <tr>
                            <th>Evaluation Criterion / Test Case</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.details.map((detail, idx) => (
                            <tr key={idx}>
                              <td>
                                {detail.label || detail.property || `Test Case ${idx + 1}`}
                              </td>
                              <td>
                                {detail.passed ? (
                                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    <Check size={14} /> Passed
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                    <X size={14} /> Failed
                                  </span>
                                )}
                              </td>
                              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                {detail.error ? (
                                  <span style={{ color: 'var(--danger)' }}>{detail.error}</span>
                                ) : detail.actual !== undefined ? (
                                  `Expected: ${JSON.stringify(detail.expected)} | Output: ${JSON.stringify(detail.actual)}`
                                ) : (
                                  detail.passed ? 'Pattern satisfied' : 'Pattern missing'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Submitted Code Viewer */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Candidate's Submitted Code:
                      </div>
                      <pre className="code-snippet-box">
                        <code>{result.submittedCode || '// No code submitted'}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
