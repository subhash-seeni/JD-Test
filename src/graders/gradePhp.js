/**
 * PHP Code Grader
 * Defaults to Option 1: Best-effort static regex & structural parsing with partial credit.
 * Clearly flagged as "auto-graded (approximate) - recommend manual review".
 * 
 * ============================================================================
 * FUTURE EXTENSION: Option 2 (In-Browser WebAssembly PHP Execution)
 * To swap in real PHP execution without a backend:
 * 1. Install `php-wasm` or `@php-wasm/web`: `npm install @php-wasm/web`
 * 2. In this file, import `{ PhpWeb } from '@php-wasm/web'`
 * 3. Initialize the WASM runtime: `const php = await PhpWeb.load('8.2')`
 * 4. Run `const output = await php.run({ code: candidateCode + "\n echo json_encode(sumArray([1,2,3]));" })`
 * 5. Compare outputs similar to `gradeJs.js`.
 * Tradeoffs: Adds ~10MB WASM binary download and initial initialization delay.
 * ============================================================================
 */

export async function gradePhpCode(code, question) {
  if (!code || !code.trim()) {
    return {
      score: 0,
      passedCount: 0,
      totalCount: question.gradingPatterns?.length || 1,
      isApproximate: true,
      details: (question.gradingPatterns || []).map((pattern) => ({
        label: pattern.label,
        passed: false,
        weight: pattern.weight,
        matched: false
      })),
      feedback: 'No PHP code was submitted.'
    };
  }

  const { gradingPatterns = [] } = question;
  let totalScore = 0;
  let passedCount = 0;
  const details = [];

  for (const item of gradingPatterns) {
    let matched = false;

    if (item.regex) {
      matched = item.regex.test(code);
    } else if (typeof item.check === 'function') {
      try {
        matched = item.check(code);
      } catch {
        matched = false;
      }
    }

    if (matched) {
      totalScore += item.weight;
      passedCount++;
    }

    details.push({
      id: item.id,
      label: item.label,
      passed: matched,
      weight: item.weight
    });
  }

  const finalScore = Math.min(1, Math.max(0, Math.round(totalScore * 100) / 100));

  return {
    score: finalScore,
    passedCount,
    totalCount: gradingPatterns.length,
    isApproximate: true,
    details,
    feedback: `Approximate score: ${Math.round(finalScore * 100)}% (${passedCount}/${gradingPatterns.length} structural patterns verified). Recommend manual review.`
  };
}
