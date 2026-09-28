/**
 * Global Configuration for Assessment App
 * Change constants here to tune assessment behavior
 */

// Total duration of the test in minutes (45 mins for 30 questions)
export const TEST_DURATION_MINUTES = 45;

// Whether the candidate is allowed to navigate back to previous questions
// Set to true as requested
export const ALLOW_BACK = true;

// Whether the candidate can skip unanswered questions (with confirmation)
export const ALLOW_SKIP = true;

// Maximum timeout for sandboxed JS code execution in ms
export const JS_TIMEOUT_MS = 2000;

// API endpoint placeholder to submit results if connected to a backend in future
export const BACKEND_API_ENDPOINT = null; // e.g. "https://api.yourdomain.com/v1/assessments/submit"
