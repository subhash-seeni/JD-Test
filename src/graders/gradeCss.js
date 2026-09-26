/**
 * CSS Code Grader
 * Renders candidate's CSS scoped to an isolated hidden DOM sandbox,
 * inspects getComputedStyle on target elements, and evaluates matching properties.
 */

export async function gradeCssCode(code, question) {
  if (!code || !code.trim()) {
    return {
      score: 0,
      passedCount: 0,
      totalCount: question.expectedStyles?.properties?.length || 1,
      details: (question.expectedStyles?.properties || []).map((prop) => ({
        property: prop.name,
        expected: prop.label || prop.expected.join(' or '),
        actual: 'none',
        passed: false,
        error: 'No CSS submitted'
      })),
      feedback: 'No CSS code submitted.'
    };
  }

  const { expectedStyles } = question;
  const { targetSelector, htmlSnippet, properties } = expectedStyles;

  // Create isolated container in DOM
  const sandboxId = 'css-sandbox-' + Math.random().toString(36).substring(2, 9);
  const container = document.createElement('div');
  container.id = sandboxId;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '600px';
  container.style.visibility = 'hidden';

  // Scope CSS to avoid modifying global styles
  // Prefix selectors with #sandboxId
  const scopedCss = `
    #${sandboxId} {
      all: initial;
    }
    #${sandboxId} ${code}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = scopedCss;

  container.innerHTML = htmlSnippet;
  container.appendChild(styleEl);
  document.body.appendChild(container);

  try {
    const targetEl = container.querySelector(targetSelector);

    if (!targetEl) {
      return {
        score: 0,
        passedCount: 0,
        totalCount: properties.length,
        details: properties.map((prop) => ({
          property: prop.name,
          expected: prop.label,
          actual: 'Target element not matched',
          passed: false
        })),
        feedback: `Selector "${targetSelector}" was not found in test DOM.`
      };
    }

    const computed = window.getComputedStyle(targetEl);
    let totalScore = 0;
    let passedCount = 0;
    const details = [];

    for (const prop of properties) {
      const actualVal = computed.getPropertyValue(prop.name)?.trim().toLowerCase();
      let matched = false;
      let awardedWeight = 0;

      if (prop.expected.includes(actualVal)) {
        matched = true;
        awardedWeight = prop.weight;
        passedCount++;
      } else if (prop.partialMatches && prop.partialMatches.includes(actualVal)) {
        matched = true;
        awardedWeight = prop.weight * (prop.partialWeightRatio || 0.7);
        passedCount += 0.7;
      }

      totalScore += awardedWeight;

      details.push({
        property: prop.name,
        expected: prop.label || prop.expected.join(' or '),
        actual: actualVal || '(default)',
        passed: matched,
        partial: prop.partialMatches?.includes(actualVal) || false,
        scoreFraction: awardedWeight / prop.weight
      });
    }

    const finalScore = Math.min(1, Math.max(0, Math.round(totalScore * 100) / 100));

    return {
      score: finalScore,
      passedCount: Math.round(passedCount * 10) / 10,
      totalCount: properties.length,
      details,
      feedback: `${Math.round(finalScore * 100)}% CSS criteria satisfied.`
    };
  } catch (err) {
    return {
      score: 0,
      passedCount: 0,
      totalCount: properties.length,
      details: [],
      feedback: `CSS parsing/grading error: ${err.message}`,
      error: err.message
    };
  } finally {
    // Cleanup DOM element
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
