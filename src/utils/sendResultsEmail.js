import emailjs from '@emailjs/browser';
import {
  GOOGLE_APPS_SCRIPT_URL,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  RECIPIENT_EMAIL
} from '../emailConfig';

/**
 * Format and send the candidate's assessment results
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
  topicStats
}) {
  // Format time taken
  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  // Format topic breakdown string
  const topicLines = Object.entries(topicStats).map(([topic, stats]) => {
    const pct = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;
    return `${topic}: ${Math.round(stats.earned * 10) / 10} / ${stats.total} pts (${pct}%)`;
  }).join('\n');

  // Format code questions breakdown string
  const codeQuestions = questions.filter(q => q.type === 'code');
  const codeDetails = codeQuestions.map(q => {
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

    return `--------------------------------------------------
[Q${q.id} - ${q.topic}] ${q.question}
Score: ${scorePct}% (${res.passedCount || 0}/${res.totalCount || 0} criteria)
Criteria Details:
${criteriaSummary}

Submitted Code:
${submitted}
--------------------------------------------------`;
  }).join('\n\n');

  const payload = {
    to_email: RECIPIENT_EMAIL,
    candidate_name: candidate.name || 'Anonymous Candidate',
    candidate_email: candidate.email || 'Not provided',
    total_score: `${Math.round(totalScore * 10) / 10} / ${totalQuestions} (${Math.round((totalScore / totalQuestions) * 100)}%)`,
    mcq_breakdown: `${mcqStats.correct} / ${mcqStats.total} correct (${mcqStats.incorrect} incorrect/skipped)`,
    topic_breakdown: topicLines,
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
        mode: 'no-cors', // Standard for Google Apps Script Web App endpoints
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

  // If neither is configured yet, log detailed report to console
  console.info(
    'Assessment results generated. Set GOOGLE_APPS_SCRIPT_URL in src/emailConfig.js to receive live emails in subhash@geotrixteam.com.'
  );
  console.log('Assessment Results Payload:', payload);
  return { success: true, simulated: true };
}
