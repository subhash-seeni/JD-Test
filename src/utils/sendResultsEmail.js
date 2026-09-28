import emailjs from '@emailjs/browser';
import {
  GOOGLE_APPS_SCRIPT_URL,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  RECIPIENT_EMAIL
} from '../emailConfig.js';

// In-flight & session deduplication lock to guarantee strictly one results email per session
let isDispatchingResults = false;
let lastDispatchedCandidateKey = '';
let lastDispatchedAt = 0;

/**
 * Format and send the candidate's assessment results
 * Structured for both Non-Technical HR/Recruiters and Technical Engineering Leads
 * Primary: Google Apps Script Webhook (Google Workspace native, free)
 * Secondary: EmailJS (if configured)
 */
export async function sendAssessmentResultsEmail({
  candidate,
  questions,
  userAnswers,
  gradedResults,
  timeTakenSeconds,
  totalScore,
  totalQuestions,
  mcqStats,
  topicStats,
  isAutoSubmit = false
}) {
  const candidateKey = `${(candidate?.email || '').trim().toLowerCase()}_${(candidate?.name || '').trim().toLowerCase()}`;
  const now = Date.now();

  // Deduplication guard: block any duplicate submission calls within 60 seconds
  if (isDispatchingResults) {
    console.warn('[sendAssessmentResultsEmail] Blocked duplicate call: results dispatch currently in progress.');
    return { success: true, duplicatePrevented: true };
  }
  if (lastDispatchedCandidateKey === candidateKey && now - lastDispatchedAt < 60000) {
    console.warn('[sendAssessmentResultsEmail] Blocked duplicate call: results already dispatched for this candidate in the last 60s.');
    return { success: true, duplicatePrevented: true };
  }

  isDispatchingResults = true;
  lastDispatchedCandidateKey = candidateKey;
  lastDispatchedAt = now;

  try {
    // Format time taken
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    const timeFormatted = `${minutes}m ${seconds}s`;

    const percentage = Math.round((totalScore / totalQuestions) * 100);
    const codeQuestions = questions.filter((q) => q.type === 'code');
    const mcqQuestions = questions.filter((q) => q.type === 'mcq');

    let codeEarned = 0;
    codeQuestions.forEach((q) => {
      codeEarned += gradedResults[q.id]?.score || 0;
    });
    const codePercentage = codeQuestions.length > 0 ? Math.round((codeEarned / codeQuestions.length) * 100) : 0;
    const mcqPercentage = mcqStats.total > 0 ? Math.round((mcqStats.correct / mcqStats.total) * 100) : 0;

    // Track answered vs unanswered
    const answeredCount = questions.filter((q) => {
      const val = userAnswers[q.id];
      return val !== undefined && val !== null && String(val).trim() !== '';
    }).length;
    const unansweredCount = totalQuestions - answeredCount;
    const completionStats = `${answeredCount} of ${totalQuestions} questions attempted (${unansweredCount} unanswered)`;

    const submissionMode = isAutoSubmit
      ? 'Auto-Submitted (Test Time Limit Expired)'
      : 'Manually Submitted by Candidate';

    // Executive Hiring Insights
    let verdictTitle = '';
    let verdictBadge = '';
    let readiness = '';
    let executiveSummary = '';

    if (percentage >= 85) {
      verdictTitle = 'STRONG HIRE RECOMMENDATION';
      verdictBadge = 'Exceptional Performance (Top Tier)';
      readiness = 'Immediate readiness for Junior Developer role';
      executiveSummary = `Candidate ${candidate.name} demonstrated high mastery across both front-end (HTML/CSS) and back-end (JavaScript/PHP). Code challenges were completed cleanly with strong pattern adherence. Recommended for fast-tracking to final round or offer.`;
    } else if (percentage >= 70) {
      verdictTitle = 'RECOMMENDED FOR NEXT ROUND';
      verdictBadge = 'Solid Foundation (Competent)';
      readiness = 'Ready for Junior Developer position with standard onboarding';
      executiveSummary = `Candidate ${candidate.name} demonstrated a solid grasp of core web development, responsive CSS, JavaScript logic, and PHP backend scripting. Ready for standard engineering tickets with light mentorship.`;
    } else if (percentage >= 50) {
      verdictTitle = 'BORDERLINE - TARGETED TECHNICAL REVIEW REQUIRED';
      verdictBadge = 'Needs Mentoring';
      readiness = 'Requires structured pairing and mentorship on weaker topics';
      executiveSummary = `Candidate ${candidate.name} shows foundational promise but exhibited gaps in specific code implementations and logic. Recommend a targeted technical conversation to probe debugging skills.`;
    } else {
      verdictTitle = 'BELOW BENCHMARK - NOT RECOMMENDED';
      verdictBadge = 'Significant Skill Gaps';
      readiness = 'Not currently ready for independent junior engineering tasks';
      executiveSummary = `Candidate ${candidate.name} struggled across multiple topics, scoring below passing thresholds on both theory and code implementation.`;
    }

    if (isAutoSubmit && unansweredCount > 0) {
      executiveSummary += ` Note: Candidate ran out of time before completing all questions (${unansweredCount} questions left unattempted).`;
    }

    // Strengths & Growth Areas
    const strengths = [];
    const growthAreas = [];
    const interviewQuestions = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const topicPct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
      const label = topic === 'JS' ? 'JavaScript' : topic;
      if (topicPct >= 75) {
        strengths.push(`${label} (${topicPct}%)`);
      } else if (topicPct < 65) {
        growthAreas.push(`${label} (${topicPct}%)`);
        if (topic === 'PHP') {
          interviewQuestions.push('Ask candidate to explain PHP foreach loop syntax and array_filter() vs standard iteration.');
        } else if (topic === 'JS') {
          interviewQuestions.push('Ask candidate about handling edge cases in JavaScript functions and array methods.');
        } else if (topic === 'CSS') {
          interviewQuestions.push('Ask candidate to explain CSS Flexbox space-between vs space-around.');
        }
      }
    });

    // Format topic breakdown string
    const topicLines = Object.entries(topicStats).map(([topic, stats]) => {
      const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
      return `${topic}: ${Math.round(stats.earned * 10) / 10} / ${stats.total} pts (${pct}%)`;
    }).join('\n');

    // Format full MCQ breakdown string
    const mcqDetails = mcqQuestions.map((q) => {
      const res = gradedResults[q.id];
      const userAns = userAnswers[q.id];
      const isAnswered = userAns !== undefined && userAns !== null && String(userAns).trim() !== '';
      const isCorrect = res && res.isCorrect;
      const status = !isAnswered ? 'SKIPPED / UNANSWERED' : isCorrect ? 'CORRECT' : 'INCORRECT';

      let out = `[Q${q.id} - ${q.topic}] ${q.question}\nResult: [${status}]`;
      if (isAnswered) {
        out += `\nCandidate Selected: ${userAns}`;
        if (!isCorrect) {
          out += `\nCorrect Answer: ${q.correctAnswer}`;
        }
      } else {
        out += `\nCandidate Selected: (No answer provided - timed out / skipped)\nCorrect Answer: ${q.correctAnswer}`;
      }
      return out;
    }).join('\n\n');

    // Format code questions breakdown string
    const codeDetails = codeQuestions.map((q) => {
      const res = gradedResults[q.id] || {};
      const scorePct = Math.round((res.score || 0) * 100);
      const submitted = res.submittedCode || userAnswers[q.id] || '// None provided';

      let criteriaSummary = '';
      if (res.details && res.details.length > 0) {
        criteriaSummary = res.details.map((d, i) => {
          const itemLabel = d.label || d.property || `Test Case ${i + 1}`;
          const itemStatus = d.passed ? 'PASSED' : 'FAILED';
          return `   - [${itemStatus}] ${itemLabel}`;
        }).join('\n');
      }

      return `==================================================
[Q${q.id} - ${q.topic}] ${q.question}
Score: ${scorePct}% (${res.passedCount || 0}/${res.totalCount || 0} criteria)
Criteria Breakdown:
${criteriaSummary || '   - Automated checks completed'}

Submitted Code:
${submitted}
==================================================`;
    }).join('\n\n');

    const payload = {
      to_email: RECIPIENT_EMAIL,
      candidate_name: candidate?.name || 'Anonymous Candidate',
      candidate_email: candidate?.email || 'Not provided',
      total_score: `${Math.round(totalScore * 10) / 10} / ${totalQuestions} (${percentage}%)`,
      submission_mode: submissionMode,
      is_auto_submit: Boolean(isAutoSubmit),
      completion_stats: completionStats,
      answered_count: answeredCount,
      unanswered_count: unansweredCount,
      verdict_title: verdictTitle,
      verdict_badge: verdictBadge,
      readiness_level: readiness,
      executive_summary: executiveSummary,
      strengths_summary: strengths.join(', ') || 'General fundamentals',
      growth_summary: growthAreas.join(', ') || 'None identified',
      interview_prompts: interviewQuestions.join('\n- ') || 'Standard round 2 technical review',
      mcq_breakdown: `${mcqStats.correct} / ${mcqStats.total} correct (${mcqPercentage}%) [${mcqStats.unanswered || 0} unattempted]`,
      code_score_breakdown: `${Math.round(codeEarned * 10) / 10} / ${codeQuestions.length} pts (${codePercentage}%)`,
      topic_breakdown: topicLines,
      mcq_details: mcqDetails,
      code_breakdown: codeDetails,
      time_taken: timeFormatted,
      submission_timestamp: new Date().toLocaleString()
    };

    // 1. PRIMARY: Google Apps Script Webhook (Google Workspace)
    if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL') {
      try {
        console.log('Sending assessment results via Google Apps Script Webhook...');
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        console.log('Results dispatched to Google Apps Script webhook successfully.');
        return { success: true };
      } catch (err) {
        console.error('Failed to dispatch to Google Apps Script Webhook:', err);
      }
    }

    // 2. SECONDARY: EmailJS Fallback
    if (
      EMAILJS_SERVICE_ID !== 'service_placeholder' &&
      EMAILJS_TEMPLATE_ID !== 'template_placeholder' &&
      EMAILJS_PUBLIC_KEY !== 'public_key_placeholder'
    ) {
      try {
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          payload,
          EMAILJS_PUBLIC_KEY
        );
        console.log('Email sent successfully via EmailJS:', response.status);
        return { success: true };
      } catch (err) {
        console.error('Failed to send via EmailJS:', err);
      }
    }

    console.info(
      'Assessment results generated. Set GOOGLE_APPS_SCRIPT_URL in src/emailConfig.js to receive live emails in subhash@geotrixteam.com.'
    );
    console.log('Assessment Results Payload:', payload);
    return { success: true, simulated: true };
  } finally {
    isDispatchingResults = false;
  }
}

/**
 * Dispatch an instant notification when a candidate starts the assessment
 */
export async function sendTestStartedEmail({ candidate, totalQuestions, durationMinutes }) {
  const payload = {
    event_type: 'test_started',
    to_email: RECIPIENT_EMAIL,
    candidate_name: candidate?.name || 'Anonymous Candidate',
    candidate_email: candidate?.email || 'Not provided',
    total_questions: totalQuestions,
    duration_minutes: durationMinutes,
    started_at: new Date().toLocaleString()
  };

  if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL') {
    try {
      console.log('Sending test start notification via Google Apps Script Webhook...');
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      console.log('Test start notification dispatched successfully.');
      return { success: true };
    } catch (err) {
      console.error('Failed to dispatch test start notification:', err);
    }
  }

  console.info('Test start notification logged (webhook URL placeholder or simulation mode):', payload);
  return { success: true, simulated: true };
}
