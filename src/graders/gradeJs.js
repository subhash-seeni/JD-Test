/**
 * JavaScript Code Grader
 * Executes candidate code inside an isolated Web Worker (or sandboxed iframe)
 * with a strict timeout to guard against infinite loops.
 * Returns { score, passedCount, totalCount, details, error }
 */

import { JS_TIMEOUT_MS } from '../config.js';

/**
 * Fuzzy comparison function for test results
 */
export function fuzzyCompare(actual, expected) {
  if (actual === expected) return true;
  if (typeof actual === 'string' && typeof expected === 'string') {
    return actual.trim() === expected.trim();
  }
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    return actual.every((val, idx) => fuzzyCompare(val, expected[idx]));
  }
  if (typeof actual === 'object' && typeof expected === 'object' && actual !== null && expected !== null) {
    try {
      return JSON.stringify(actual) === JSON.stringify(expected);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Worker script code template that receives candidate code, tests it against test cases,
 * and posts results back via postMessage.
 */
const WORKER_SCRIPT = `
self.onmessage = function(e) {
  const { code, functionName, testCases } = e.data;
  const results = [];

  try {
    // Isolated evaluation inside worker scope (has no access to DOM, cookies, or parent window)
    const factory = new Function(\`
      "use strict";
      \${code};
      if (typeof \${functionName} !== 'function') {
        throw new Error('Function "' + '\${functionName}' + '" is not defined or is not a function');
      }
      return \${functionName};
    \`);

    const userFunc = factory();

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      try {
        // Deep clone inputs so user mutation doesn't taint
        const inputArgs = JSON.parse(JSON.stringify(tc.input));
        const actual = userFunc(...inputArgs);
        results.push({
          index: i,
          label: tc.label,
          input: tc.input,
          expected: tc.expected,
          actual: actual,
          passed: null, // Evaluated with fuzzy comparison in main thread
          error: null
        });
      } catch (err) {
        results.push({
          index: i,
          label: tc.label,
          input: tc.input,
          expected: tc.expected,
          actual: undefined,
          passed: false,
          error: err.message || String(err)
        });
      }
    }

    self.postMessage({ success: true, results: results });
  } catch (err) {
    self.postMessage({ success: false, error: err.message || String(err) });
  }
};
`;

/**
 * Executes JS code in a Web Worker with strict timeout
 */
export async function gradeJsCode(code, question) {
  if (!code || !code.trim()) {
    return {
      score: 0,
      passedCount: 0,
      totalCount: question.testCases.length,
      details: question.testCases.map((tc) => ({
        label: tc.label,
        expected: tc.expected,
        actual: null,
        passed: false,
        error: 'No code submitted'
      })),
      feedback: 'No code was provided for this question.'
    };
  }

  const { functionName, testCases, antiPatternCheck } = question;

  return new Promise((resolve) => {
    let worker;
    let blobUrl;
    let timeoutId;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (worker) {
        try {
          worker.terminate();
        } catch (_) {}
      }
      if (blobUrl) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch (_) {}
      }
    };

    try {
      const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);

      // Guard against infinite loops with timeout
      timeoutId = setTimeout(() => {
        cleanup();
        resolve({
          score: 0,
          passedCount: 0,
          totalCount: testCases.length,
          details: testCases.map((tc) => ({
            label: tc.label,
            expected: tc.expected,
            actual: 'Execution Timed Out',
            passed: false,
            error: `Execution exceeded ${JS_TIMEOUT_MS}ms limit (possible infinite loop)`
          })),
          feedback: `Execution timed out (> ${JS_TIMEOUT_MS}ms). Please check for infinite loops or recursion.`,
          error: 'Execution Timed Out'
        });
      }, JS_TIMEOUT_MS);

      worker.onmessage = (event) => {
        cleanup();
        const data = event.data;

        if (!data.success) {
          // Syntax or definition error
          resolve({
            score: 0,
            passedCount: 0,
            totalCount: testCases.length,
            details: testCases.map((tc) => ({
              label: tc.label,
              expected: tc.expected,
              actual: 'Execution Error',
              passed: false,
              error: data.error
            })),
            feedback: `Syntax/Runtime Error: ${data.error}`,
            error: data.error
          });
          return;
        }

        // Compare test case results
        let passedCount = 0;
        const details = data.results.map((res) => {
          if (res.error) {
            return res;
          }
          const isPassed = fuzzyCompare(res.actual, res.expected);
          if (isPassed) passedCount++;
          return {
            ...res,
            passed: isPassed
          };
        });

        let notes = [];
        if (antiPatternCheck && antiPatternCheck.regex && antiPatternCheck.regex.test(code)) {
          notes.push(antiPatternCheck.penaltyMessage);
        }

        const score = testCases.length > 0 ? passedCount / testCases.length : 0;

        resolve({
          score: Math.round(score * 100) / 100,
          passedCount,
          totalCount: testCases.length,
          details,
          feedback: `${passedCount} of ${testCases.length} test cases passed.`,
          notes: notes.join(' ')
        });
      };

      worker.onerror = (err) => {
        cleanup();
        resolve({
          score: 0,
          passedCount: 0,
          totalCount: testCases.length,
          details: testCases.map((tc) => ({
            label: tc.label,
            expected: tc.expected,
            actual: 'Error',
            passed: false,
            error: err.message || 'Worker execution failed'
          })),
          feedback: `Worker error: ${err.message || 'Execution failed'}`,
          error: err.message
        });
      };

      // Dispatch to worker
      worker.postMessage({
        code,
        functionName,
        testCases
      });
    } catch (e) {
      cleanup();
      resolve({
        score: 0,
        passedCount: 0,
        totalCount: testCases.length,
        details: [],
        feedback: `Failed to initialize test sandbox: ${e.message}`,
        error: e.message
      });
    }
  });
}
