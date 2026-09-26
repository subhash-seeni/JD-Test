import React, { useState, useMemo } from 'react';
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
  Printer,
  Copy,
  Sparkles,
  Brain,
  TrendingUp,
  HelpCircle,
  Briefcase,
  FileText,
  Sliders
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
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'technical' | 'all'
  const [expandedCodeIds, setExpandedCodeIds] = useState({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  const toggleExpand = (id) => {
    setExpandedCodeIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllCode = () => {
    const all = {};
    questions.filter((q) => q.type === 'code').forEach((q) => {
      all[q.id] = true;
    });
    setExpandedCodeIds(all);
  };

  const collapseAllCode = () => {
    setExpandedCodeIds({});
  };

  // 1. Calculate overall metrics
  const totalQuestions = questions.length;
  let totalEarnedPoints = 0;
  let mcqCorrect = 0;
  let mcqIncorrect = 0;
  let mcqTotal = 0;
  let codeEarnedPoints = 0;
  let codeTotal = 0;

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
  const mcqPercentage = mcqTotal > 0 ? Math.round((mcqCorrect / mcqTotal) * 100) : 0;
  const codePercentage = codeTotal > 0 ? Math.round((codeEarnedPoints / codeTotal) * 100) : 0;

  // Format time taken
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const codeQuestions = questions.filter((q) => q.type === 'code');

  // Executive Hiring Insights Calculation
  const evaluation = useMemo(() => {
    let verdictTitle = '';
    let verdictBadge = '';
    let verdictClass = '';
    let readiness = '';
    let recommendation = '';

    if (percentage >= 85) {
      verdictTitle = 'Strong Candidate - Recommended for Hire';
      verdictBadge = 'Exceptional Performance';
      verdictClass = 'verdict-green';
      readiness = 'Immediate readiness for Junior Developer role';
      recommendation = 'Fast-track to next interview round or offer. Candidate demonstrated high accuracy, strong clean coding ability, and solid multi-language understanding.';
    } else if (percentage >= 70) {
      verdictTitle = 'Competent Candidate - Recommended for Next Round';
      verdictBadge = 'Solid Foundation';
      verdictClass = 'verdict-blue';
      readiness = 'Ready for Junior Developer position with standard onboarding';
      recommendation = 'Proceed to technical conversational round. Candidate possesses core engineering competencies in HTML, CSS, JavaScript, and PHP with reliable problem solving.';
    } else if (percentage >= 50) {
      verdictTitle = 'Borderline Candidate - Targeted Review Advised';
      verdictBadge = 'Needs Mentoring';
      verdictClass = 'verdict-yellow';
      readiness = 'Requires structured pairing and mentorship on weaker topics';
      recommendation = 'Conduct focused interview probing hands-on implementation and problem debugging. Candidate understands fundamentals but showed gaps in specific coding patterns.';
    } else {
      verdictTitle = 'Below Benchmark - Not Recommended';
      verdictBadge = 'Skill Gaps Identified';
      verdictClass = 'verdict-red';
      readiness = 'Not currently ready for independent junior engineering tasks';
      recommendation = 'Do not advance at this time. Multiple fundamental gaps were observed in both theoretical concepts and code implementation tasks.';
    }

    // Strengths and growth topics
    const strengths = [];
    const growthAreas = [];
    const interviewQuestions = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const topicPct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
      const topicLabel = topic === 'JS' ? 'JavaScript' : topic;

      if (topicPct >= 75) {
        strengths.push({
          topic,
          label: `${topicLabel} (${topicPct}%)`,
          desc: `Demonstrated strong proficiency in ${topicLabel} syntax and problem solving.`
        });
      } else if (topicPct < 65) {
        growthAreas.push({
          topic,
          label: `${topicLabel} (${topicPct}%)`,
          desc: `Struggled with certain ${topicLabel} concepts or coding tasks.`
        });

        // Generate tailored interview questions based on missed topics
        if (topic === 'PHP') {
          interviewQuestions.push('Ask candidate to explain foreach loop syntax and when to use date() formatting vs DateTime objects in PHP.');
          interviewQuestions.push('Ask candidate to describe the difference between array_filter() and a standard for loop.');
        } else if (topic === 'JS') {
          interviewQuestions.push('Ask candidate how they handle edge cases in JavaScript functions and their experience with array methods.');
        } else if (topic === 'CSS') {
          interviewQuestions.push('Ask candidate to explain CSS Flexbox justify-content and align-items properties on a live whiteboard.');
        } else if (topic === 'HTML') {
          interviewQuestions.push('Ask candidate about semantic HTML tags (<nav>, <article>, <section>) and accessible form elements.');
        }
      }
    });

    // Pacing Analysis
    let pacingNote = '';
    const timeUsedRatio = timeTakenSeconds / totalDurationSeconds;
    if (timeUsedRatio < 0.5) {
      pacingNote = 'Swift Execution: Completed in under half the allotted time, indicating high confidence.';
    } else if (timeUsedRatio <= 0.85) {
      pacingNote = 'Balanced Pace: Worked steadily through both multiple choice and code tasks with good time management.';
    } else {
      pacingNote = 'Deliberate Pace: Utilized almost the entire allotted window to complete the assessment.';
    }

    // Theory vs Hands-On Gap
    let practicalGapNote = '';
    const gap = mcqPercentage - codePercentage;
    if (gap >= 20) {
      practicalGapNote = 'Theory > Practical Gap: Performed noticeably higher on multiple choice theory than on hands-on code writing. Probe real-time debugging during interview.';
    } else if (gap <= -15) {
      practicalGapNote = 'Practical > Theory Strength: Performed better on actual code writing tasks than theoretical memorization questions - strong builder mindset.';
    } else {
      practicalGapNote = 'Well Balanced: Demonstrated equal mastery of theoretical web concepts and practical code implementation.';
    }

    return {
      verdictTitle,
      verdictBadge,
      verdictClass,
      readiness,
      recommendation,
      strengths,
      growthAreas,
      interviewQuestions: interviewQuestions.slice(0, 3),
      pacingNote,
      practicalGapNote
    };
  }, [percentage, mcqPercentage, codePercentage, timeTakenSeconds, totalDurationSeconds, topicStats]);

  // Copy Executive Summary to clipboard for Slack / ATS
  const handleCopySummary = () => {
    const summaryText = `CANDIDATE ASSESSMENT REPORT: ${candidate?.name || 'Anonymous'}
==================================================
Overall Score: ${Math.round(totalEarnedPoints * 10) / 10} / ${totalQuestions} (${percentage}%)
Verdict: ${evaluation.verdictTitle} (${evaluation.verdictBadge})
Readiness: ${evaluation.readiness}

PERFORMANCE BREAKDOWN:
- Theory / MCQ Knowledge: ${mcqCorrect}/${mcqTotal} (${mcqPercentage}%)
- Hands-on Code Implementation: ${Math.round(codeEarnedPoints * 10) / 10}/${codeTotal} pts (${codePercentage}%)
- Time Taken: ${formatTime(timeTakenSeconds)} of ${Math.round(totalDurationSeconds / 60)}m

TOPIC BREAKDOWN:
${Object.entries(topicStats).map(([t, s]) => `* ${t}: ${Math.round(s.earned * 10) / 10}/${s.total} pts (${s.total > 0 ? Math.round((s.earned / s.total) * 100) : 0}%)`).join('\n')}

HIRING SUMMARY:
${evaluation.recommendation}

${evaluation.strengths.length > 0 ? `Key Strengths: ${evaluation.strengths.map(s => s.label).join(', ')}` : ''}
${evaluation.growthAreas.length > 0 ? `Areas to Probe in Round 2: ${evaluation.growthAreas.map(g => g.label).join(', ')}` : ''}
==================================================`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="results-page">
      {/* Submission Confirmation Notification */}
      <div className="submission-confirm-banner">
        <div className="confirm-icon-box">
          <CheckCircle2 size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="confirm-heading">Assessment Successfully Submitted</h2>
          <p className="confirm-subtext">
            All multiple-choice answers and code submissions have been graded. Review the evaluation dossier below.
          </p>
        </div>
        <div className="report-action-buttons">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleCopySummary}
            title="Copy formatted summary to clipboard for ATS or Slack"
          >
            {copiedSummary ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copiedSummary ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm print-hide"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
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
            <div className="candidate-info-cell">
              <Clock size={15} className="candidate-cell-icon" />
              <span>Time Taken: <strong>{formatTime(timeTakenSeconds)}</strong> ({Math.round((timeTakenSeconds / totalDurationSeconds) * 100)}% of limit)</span>
            </div>
          </div>
        )}

        <div className="results-banner-header">
          <div>
            <div className="score-display">
              <span className="score-number">{Math.round(totalEarnedPoints * 10) / 10}</span>
              <span className="score-max">/ {totalQuestions} points ({percentage}%)</span>
            </div>
            <div className={`verdict-pill ${evaluation.verdictClass}`}>
              <Sparkles size={14} />
              <span>{evaluation.verdictBadge}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-outline" onClick={onRetake}>
              <RotateCcw size={16} />
              Retake Assessment
            </button>
          </div>
        </div>

        {/* 3-Column Core Metrics Grid */}
        <div className="results-stats-row">
          <div className="stat-box">
            <div className="stat-label">Theory (MCQ) Accuracy</div>
            <div className="stat-value">{mcqPercentage}%</div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {mcqCorrect} of {mcqTotal} questions correct
            </span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Practical Code Implementation</div>
            <div className="stat-value">{codePercentage}%</div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {Math.round(codeEarnedPoints * 10) / 10} of {codeTotal} pts across {codeQuestions.length} challenges
            </span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Candidate Readiness</div>
            <div className="stat-value" style={{ fontSize: '14px', lineHeight: 1.3, marginTop: '2px' }}>
              {evaluation.readiness}
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Based on Junior Developer benchmarks
            </span>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="results-disclaimer">
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          <span>Code question scores are auto-evaluated against test suites and structural patterns. Recommend spot-checking candidate code for syntax style during technical review.</span>
        </div>
      </div>

      {/* Audience View Switcher Tabs */}
      <div className="audience-tabs-bar print-hide">
        <button
          type="button"
          className={`audience-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <Briefcase size={15} />
          <span>Executive Summary (For Recruiter & HR)</span>
        </button>

        <button
          type="button"
          className={`audience-tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          <Code size={15} />
          <span>Technical Deep-Dive (For Engineering Team)</span>
        </button>

        <button
          type="button"
          className={`audience-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Sliders size={15} />
          <span>Complete Report (All Sections)</span>
        </button>
      </div>

      {/* ======================================================================
          SECTION 1: NON-TECHNICAL / EXECUTIVE SUMMARY VIEW
          ====================================================================== */}
      {(activeTab === 'summary' || activeTab === 'all') && (
        <div className="executive-summary-section">
          {/* Executive Verdict Card */}
          <div className={`verdict-card ${evaluation.verdictClass}`}>
            <div className="verdict-card-header">
              <div className="verdict-icon-wrap">
                {percentage >= 70 ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <span className="verdict-subtext">Hiring Recommendation & Performance Rating</span>
                <h3 className="verdict-title">{evaluation.verdictTitle}</h3>
              </div>
            </div>
            <p className="verdict-recommendation-text">{evaluation.recommendation}</p>
          </div>

          {/* Plain-English Performance Narrative */}
          <div className="narrative-card">
            <h3 className="narrative-title">
              <Brain size={18} className="narrative-icon" />
              <span>Performance Analysis & Executive Takeaway</span>
            </h3>

            <div className="narrative-grid">
              <div className="narrative-item">
                <div className="narrative-item-label">
                  <TrendingUp size={15} /> Pacing & Work Efficiency
                </div>
                <p className="narrative-item-text">{evaluation.pacingNote}</p>
              </div>

              <div className="narrative-item">
                <div className="narrative-item-label">
                  <Code size={15} /> Theory vs Hands-On Coding Balance
                </div>
                <p className="narrative-item-text">{evaluation.practicalGapNote}</p>
              </div>
            </div>

            {/* Strengths & Growth Areas Chips */}
            <div className="strengths-growth-grid">
              <div className="sg-box sg-strengths">
                <div className="sg-header">
                  <Check size={16} />
                  <span>Demonstrated Strengths (Score &ge; 75%)</span>
                </div>
                {evaluation.strengths.length > 0 ? (
                  <ul className="sg-list">
                    {evaluation.strengths.map((s, idx) => (
                      <li key={idx}>
                        <strong>{s.label}:</strong> {s.desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sg-empty">Candidate scored below 75% across individual topic clusters.</p>
                )}
              </div>

              <div className="sg-box sg-growth">
                <div className="sg-header">
                  <AlertTriangle size={16} />
                  <span>Growth Areas to Probe in Round 2 (&lt; 65%)</span>
                </div>
                {evaluation.growthAreas.length > 0 ? (
                  <ul className="sg-list">
                    {evaluation.growthAreas.map((g, idx) => (
                      <li key={idx}>
                        <strong>{g.label}:</strong> {g.desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sg-empty">No critical topic areas fell below 65% benchmark.</p>
                )}
              </div>
            </div>

            {/* Suggested Interview Questions for Recruiter / Non-Tech Interviewers */}
            {evaluation.interviewQuestions.length > 0 && (
              <div className="interview-prompts-box">
                <div className="interview-prompts-title">
                  <HelpCircle size={15} />
                  <span>Recommended Questions for Round 2 Technical Conversation</span>
                </div>
                <ul className="interview-prompts-list">
                  {evaluation.interviewQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          SECTION 2: TECHNICAL / ENGINEERING DEEP-DIVE VIEW
          ====================================================================== */}
      {(activeTab === 'technical' || activeTab === 'all') && (
        <div className="technical-deepdive-section">
          {/* Topic Matrix */}
          <div className="results-section">
            <div className="section-title">
              <span>Technical Competency by Topic</span>
              <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                HTML, CSS, JavaScript, PHP
              </span>
            </div>

            <div className="topic-grid">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
                let competencyTag = 'Competent';
                let competencyClass = 'comp-mid';
                if (pct >= 80) {
                  competencyTag = 'Proficient';
                  competencyClass = 'comp-high';
                } else if (pct < 55) {
                  competencyTag = 'Developing';
                  competencyClass = 'comp-low';
                }

                return (
                  <div key={topic} className="topic-card">
                    <div className="topic-header">
                      <span className={`tag tag-topic ${topic}`}>{topic}</span>
                      <span className={`competency-tag ${competencyClass}`}>{competencyTag}</span>
                    </div>

                    <div className="topic-score-val" style={{ margin: '8px 0 4px', fontSize: '18px', fontWeight: 700 }}>
                      {pct}%
                    </div>

                    <div className="topic-progress-bar">
                      <div className="topic-progress-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Points:</span>
                      <strong>{Math.round(stats.earned * 10) / 10} / {stats.total} pts</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Code-Question Deep-Dive */}
          <div className="results-section">
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} />
                <span>Hands-On Code Implementation Breakdown ({codeQuestions.length} Tasks)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={expandAllCode}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={collapseAllCode}
                >
                  Collapse All
                </button>
              </div>
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
                        <span>Q{q.id}: {q.question.length > 75 ? `${q.question.slice(0, 75)}...` : q.question}</span>
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
                          {isExpanded ? 'Hide Code' : 'Inspect Code & Tests'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="code-item-content">
                        <div style={{ marginBottom: '14px', fontSize: '13px' }}>
                          <strong style={{ color: 'var(--text-secondary)' }}>Full Problem Description:</strong>
                          <div style={{ marginTop: '4px', background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                            {q.question}
                          </div>
                        </div>

                        {/* Notice for PHP as static review */}
                        {q.topic === 'PHP' && (
                          <div className="manual-review-note">
                            <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                            PHP evaluated via static pattern and structural analysis. Evaluator code inspection recommended for style and standards.
                          </div>
                        )}

                        {/* Notice if anti-pattern triggered */}
                        {result.notes && (
                          <div className="manual-review-note" style={{ background: '#fef2f2', color: '#991b1b', marginTop: '6px' }}>
                            {result.notes}
                          </div>
                        )}

                        {/* Breakdown table of test criteria */}
                        {result.details && result.details.length > 0 && (
                          <div style={{ marginTop: '14px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Automated Criteria & Test Suite Results:
                            </div>
                            <table className="code-details-table">
                              <thead>
                                <tr>
                                  <th>Evaluation Criterion / Test Case</th>
                                  <th>Status</th>
                                  <th>Details / Expected vs Actual</th>
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
                                        detail.passed ? 'Pattern verified' : 'Pattern missing or incomplete'
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Submitted Code Viewer */}
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Candidate's Submitted Code:
                          </div>
                          <pre className="code-snippet-box">
                            <code>{result.submittedCode || userAnswers[q.id] || '// No code was submitted'}</code>
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
      )}
    </div>
  );
}
