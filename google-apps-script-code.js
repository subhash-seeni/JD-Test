/**
 * Google Apps Script Webhook for Assessment Notifications & Test Results
 * 
 * 1. Test Started Alert: Instantly emails you when a candidate begins the test.
 * 2. Executive & Technical Dossier: Delivers strictly ONE comprehensive email with full test context.
 * 
 * Includes:
 * - Built-in CacheService deduplication (strictly guarantees only 1 email per test session)
 * - Clear Auto-Submission vs Manual Submission indicators
 * - Question completion rate & unattempted question tracking
 * - Theory (MCQ) question-by-question review & Practical Code breakdown
 * 
 * 1-MINUTE SETUP / UPDATE INSTRUCTIONS:
 * 1. Open https://script.google.com while logged into your subhash@geotrixteam.com account.
 * 2. Open your existing project (e.g., "Assessment Mailer").
 * 3. Replace all the code in Code.gs with this entire script.
 * 4. Click "Deploy" > "Manage deployments".
 * 5. Click the Edit pencil icon next to your active deployment.
 * 6. Set Version to "New version" and click "Deploy".
 *    (Or if creating a new project, click "Deploy" > "New deployment" > Web app > Anyone).
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.to_email || "subhash@geotrixteam.com";
    var candidateName = data.candidate_name || "Unknown Candidate";
    var candidateEmail = data.candidate_email || "Not provided";

    // =========================================================================
    // EVENT 1: CANDIDATE STARTED TEST
    // =========================================================================
    if (data.event_type === 'test_started') {
      var startedAt = data.started_at || new Date().toLocaleString();
      var duration = data.duration_minutes || 30;
      var totalQ = data.total_questions || 30;

      var startSubject = "🚨 Assessment Started: " + candidateName + " has begun the test";

      var startPlainBody = "JUNIOR DEVELOPER ASSESSMENT - TEST STARTED\n" +
        "==================================================\n\n" +
        "Candidate: " + candidateName + "\n" +
        "Email: " + candidateEmail + "\n" +
        "Started At: " + startedAt + "\n" +
        "Allotted Duration: " + duration + " minutes\n" +
        "Total Questions: " + totalQ + " (Multiple Choice & Live Coding)\n\n" +
        "STATUS: The candidate is actively taking the assessment.\n" +
        "You will receive an automated performance dossier once they submit or time expires.\n\n" +
        "---\nJunior Developer Assessment System";

      var startHtmlBody = '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; line-height: 1.5; background: #f8fafc; padding: 20px;">' +
        '<div style="background: #1e3a8a; padding: 22px 26px; border-radius: 8px 8px 0 0; color: #ffffff;">' +
        '<div style="display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 3px; margin-bottom: 6px;">Live Assessment Alert</div>' +
        '<h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Assessment Started</h1>' +
        '<p style="margin: 4px 0 0; font-size: 13px; color: #bfdbfe;">A candidate has started the technical assessment</p>' +
        '</div>' +

        '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">' +
        '<table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">' +
        '<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; width: 140px;">Candidate Name:</td><td style="font-weight: 700; color: #0f172a;">' + candidateName + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Candidate Email:</td><td><a href="mailto:' + candidateEmail + '" style="color: #2563eb; text-decoration: none; font-weight: 600;">' + candidateEmail + '</a></td></tr>' +
        '<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Started At:</td><td style="color: #0f172a;">' + startedAt + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b;">Time Limit:</td><td style="color: #0f172a;">' + duration + ' minutes (Auto-submits on expiry)</td></tr>' +
        '<tr><td style="padding: 10px 0; color: #64748b;">Questions:</td><td style="color: #0f172a;">' + totalQ + ' Questions (HTML, CSS, JS, PHP)</td></tr>' +
        '</table>' +

        '<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 6px; padding: 14px 16px; font-size: 13px; color: #1e40af;">' +
        '<strong>Live Status:</strong> Candidate is currently working on the assessment. Exactly one email with their complete evaluation, score breakdown, and submitted code will be sent as soon as they finish or time expires.' +
        '</div>' +
        '</div>' +
        '</div>';

      MailApp.sendEmail({
        to: recipient,
        subject: startSubject,
        body: startPlainBody,
        htmlBody: startHtmlBody
      });

      return ContentService.createTextOutput(JSON.stringify({ status: "success", event: "started" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // EVENT 2: ASSESSMENT SUBMITTED (STRICTLY ONE RESULTS DOSSIER)
    // =========================================================================

    // Server-Side Deduplication Lock: Guarantee only 1 email per candidate submission within 3 minutes
    var cache = CacheService.getScriptCache();
    var dedupKey = "mail_lock_" + (candidateEmail || "").toLowerCase().replace(/[^a-zA-Z0-9_]/g, "");
    if (cache.get(dedupKey)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ignored_duplicate",
        message: "Duplicate email blocked: An assessment email for " + candidateEmail + " was already processed."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    // Lock for 3 minutes (180 seconds)
    cache.put(dedupKey, "true", 180);

    var isAutoSubmit = Boolean(data.is_auto_submit);
    var submissionMode = data.submission_mode || (isAutoSubmit ? "Auto-Submitted (Test Time Limit Expired)" : "Manually Submitted by Candidate");
    var completionStats = data.completion_stats || "";
    var totalScore = data.total_score || "N/A";
    var verdictTitle = data.verdict_title || "ASSESSMENT SUBMITTED";
    var verdictBadge = data.verdict_badge || "Evaluation Complete";
    var readiness = data.readiness_level || "Standard Review";
    var executiveSummary = data.executive_summary || "Candidate completed the assessment.";
    var strengths = data.strengths_summary || "None recorded";
    var growth = data.growth_summary || "None recorded";
    var interviewPrompts = data.interview_prompts || "Standard technical questions";
    var mcqBreakdown = data.mcq_breakdown || "N/A";
    var codeScoreBreakdown = data.code_score_breakdown || "N/A";
    var topicBreakdown = data.topic_breakdown || "";
    var mcqDetails = data.mcq_details || "";
    var codeBreakdown = data.code_breakdown || "";
    var timeTaken = data.time_taken || "N/A";
    var timestamp = data.submission_timestamp || new Date().toLocaleString();

    var resultsSubject = "Candidate Assessment: " + candidateName + " - " + verdictBadge + " (" + totalScore + ")" + (isAutoSubmit ? " [Time Expired]" : "");

    // Plain text version
    var resultsPlainBody = "JUNIOR DEVELOPER ASSESSMENT REPORT\n" +
      "==================================================\n\n" +
      "SUBMISSION DETAILS:\n" +
      "Candidate: " + candidateName + " (" + candidateEmail + ")\n" +
      "Submission Type: " + submissionMode + "\n" +
      (completionStats ? "Questions Attempted: " + completionStats + "\n" : "") +
      "Time Taken: " + timeTaken + "\n" +
      "Timestamp: " + timestamp + "\n\n" +
      "--------------------------------------------------\n" +
      "EXECUTIVE SUMMARY (FOR HR & HIRING MANAGERS):\n" +
      "Verdict: " + verdictTitle + " [" + verdictBadge + "]\n" +
      "Readiness: " + readiness + "\n" +
      "Overall Score: " + totalScore + "\n\n" +
      "Assessment Summary:\n" + executiveSummary + "\n\n" +
      "Strengths: " + strengths + "\n" +
      "Areas for Next Round: " + growth + "\n\n" +
      "Suggested Round 2 Interview Questions:\n" + interviewPrompts + "\n\n" +
      "--------------------------------------------------\n" +
      "PERFORMANCE METRICS:\n" +
      "Theory (MCQs): " + mcqBreakdown + "\n" +
      "Practical Coding: " + codeScoreBreakdown + "\n\n" +
      "TOPIC BREAKDOWN:\n" + topicBreakdown + "\n\n" +
      (mcqDetails ? "--------------------------------------------------\nTHEORY (MCQ) QUESTION REVIEW:\n" + mcqDetails + "\n\n" : "") +
      "--------------------------------------------------\n" +
      "TECHNICAL APPENDIX (CANDIDATE CODE & TESTS):\n" +
      codeBreakdown + "\n\n" +
      "---\nAuto-generated by Junior Developer Skills Assessment App";

    // Status pill
    var statusPillHtml = isAutoSubmit
      ? '<span style="display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; background: #dc2626; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-weight: 700; margin-bottom: 8px;">&#9201; Time Expired (Auto-Submitted)</span>'
      : '<span style="display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; background: #16a34a; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-weight: 700; margin-bottom: 8px;">&#10003; Candidate Submitted</span>';

    // Auto submit notice banner
    var autoSubmitNoticeHtml = isAutoSubmit
      ? '<div style="background: #fff7ed; border: 1px solid #fed7aa; border-left: 5px solid #ea580c; border-radius: 6px; padding: 14px 16px; margin-bottom: 22px; font-size: 13.5px; color: #9a3412; line-height: 1.45;">' +
        '<strong>&#9201; Test Auto-Submitted Upon Time Expiration:</strong> The candidate reached the allotted time limit before manual submission. All answers submitted up to that moment were automatically evaluated.' +
        (completionStats ? ' (' + completionStats + ')' : '') +
        '</div>'
      : '';

    // Clean, modern HTML version
    var resultsHtmlBody = '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a; line-height: 1.5; background: #f8fafc; padding: 20px;">' +
      '<div style="background: #0f172a; padding: 22px 26px; border-radius: 8px 8px 0 0; color: #ffffff;">' +
      statusPillHtml +
      '<h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">' + candidateName + '</h1>' +
      '<p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">' + candidateEmail + ' &bull; ' + timeTaken + ' &bull; ' + timestamp + '</p>' +
      '</div>' +

      '<div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; padding: 26px; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">' +
      autoSubmitNoticeHtml +

      '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 6px; padding: 18px 20px; margin-bottom: 22px;">' +
      '<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #166534; letter-spacing: 0.04em;">Hiring Recommendation</div>' +
      '<div style="font-size: 18px; font-weight: 700; color: #15803d; margin: 4px 0;">' + verdictTitle + '</div>' +
      '<p style="margin: 6px 0 0; font-size: 13.5px; color: #14532d; line-height: 1.45;">' + executiveSummary + '</p>' +
      '<div style="margin-top: 10px; font-size: 12.5px; color: #166534;"><strong>Readiness Level:</strong> ' + readiness + '</div>' +
      '</div>' +

      '<table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">' +
      '<tr>' +
      '<td style="width: 33%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px 0 0 6px; text-align: center;">' +
      '<div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Overall Score</div>' +
      '<div style="font-size: 20px; font-weight: 700; color: #2563eb; margin-top: 2px;">' + totalScore + '</div>' +
      '</td>' +
      '<td style="width: 33%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: none; text-align: center;">' +
      '<div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Theory (MCQ)</div>' +
      '<div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px;">' + mcqBreakdown + '</div>' +
      '</td>' +
      '<td style="width: 33%; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: none; border-radius: 0 6px 6px 0; text-align: center;">' +
      '<div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Practical Code</div>' +
      '<div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px;">' + codeScoreBreakdown + '</div>' +
      '</td>' +
      '</tr>' +
      '</table>' +

      (completionStats ? '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 12.5px; color: #475569;"><strong>Questions Completed:</strong> ' + completionStats + '</div>' : '') +

      '<div style="margin-bottom: 22px;">' +
      '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; margin-bottom: 12px;">' +
      '<div style="font-size: 12px; font-weight: 700; color: #166534; margin-bottom: 4px;">&check; Core Strengths:</div>' +
      '<div style="font-size: 13px; color: #334155;">' + strengths + '</div>' +
      '</div>' +
      '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px;">' +
      '<div style="font-size: 12px; font-weight: 700; color: #b45309; margin-bottom: 4px;">&#9888; Areas to Probe in Round 2:</div>' +
      '<div style="font-size: 13px; color: #334155;">' + growth + '</div>' +
      '</div>' +
      '</div>' +

      '<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 14px 16px; margin-bottom: 22px;">' +
      '<div style="font-size: 12px; font-weight: 700; color: #1e40af; margin-bottom: 6px;">Recommended Questions for Technical Interviewer:</div>' +
      '<div style="font-size: 13px; color: #1e3a8a; white-space: pre-wrap;">' + interviewPrompts + '</div>' +
      '</div>' +

      '<h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; margin: 24px 0 8px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Topic Competency Matrix</h3>' +
      '<pre style="background: #f1f5f9; padding: 12px; border-radius: 4px; font-size: 12.5px; font-family: monospace; white-space: pre-wrap; color: #334155;">' + topicBreakdown + '</pre>' +

      (mcqDetails ? '<h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; margin: 24px 0 8px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Theory (MCQ) Question Review</h3>' +
      '<pre style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; font-size: 12px; font-family: monospace; white-space: pre-wrap; color: #1e293b; max-height: 400px; overflow-y: auto;">' + mcqDetails + '</pre>' : '') +

      '<h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; margin: 24px 0 8px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Technical Appendix: Code Submissions & Test Suite Results</h3>' +
      '<pre style="background: #0f172a; color: #f8fafc; padding: 14px; border-radius: 6px; font-size: 12px; font-family: monospace; white-space: pre-wrap; overflow-x: auto; line-height: 1.45;">' + codeBreakdown + '</pre>' +

      '<p style="font-size: 11px; color: #94a3b8; margin-top: 24px; text-align: center;">Assessment Platform &bull; Automated grading for Junior Developer evaluation</p>' +
      '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: recipient,
      subject: resultsSubject,
      body: resultsPlainBody,
      htmlBody: resultsHtmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success", event: "submitted" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
