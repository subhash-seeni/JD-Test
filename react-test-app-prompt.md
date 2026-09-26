# Prompt for Antigravity: Junior Developer Assessment Test App

Build a single-page React web application for a developer skills assessment test. Use React (functional components + hooks), plain CSS or Tailwind, and no backend - store everything in local state (with results computed client-side at the end).

## Test content & structure
- Candidate: a junior developer with knowledge of HTML, CSS, JavaScript, and PHP (learning React).
- Use the question bank provided at the end of this prompt (22 questions covering HTML, CSS, JavaScript, PHP, and basic React), mixed across topics (don't group by topic).
- Two question types:
  1. Multiple choice (4 options, single correct answer)
  2. Code snippet write (a textarea where the candidate types code; auto-graded - see "Auto-grading code questions" below)
- Difficulty curve: start with easy questions, place the hardest questions around the middle of the test, and end on medium difficulty. The question bank below is already ordered this way - preserve that order, don't shuffle difficulty, but you may shuffle the 4 MCQ options per question.
- One question per page/screen - no scrolling through a full list.

## Navigation & flow
- "Next" button to advance (disabled until an answer/code is entered, or allow skip with a confirmation - default to allowing skip).
- No going back to previous questions - but make this a configurable constant (`ALLOW_BACK = false`) so it's easy to change later.
- A visible progress bar at the top showing "Question X of Y" and percentage complete.
- A countdown timer for the whole test, total duration 50 minutes (configurable constant between 45–60), visible at all times. Auto-submit when time runs out.

## Auto-grading code questions
Grade code answers automatically, but treat this as best-effort - it will not be 100% accurate, especially for PHP, so store the raw submitted code alongside the auto-score and surface both on the results page for a human to spot-check.

**JavaScript code questions (function-based):**
- Each JS code question in the bank below includes a `testCases` array (input(s) + expected output).
- On submit, take the candidate's code as a string, load it into an isolated execution context - an `iframe` with `sandbox="allow-scripts"` and no `allow-same-origin` (so it can't touch the parent page), or a `Web Worker` - and run each test case against it with a short timeout (e.g. 1–2 seconds) to guard against infinite loops.
- Use `postMessage` to get results back from the sandbox instead of `eval`-ing directly in the main app.
- Score = (test cases passed / total test cases) for that question. Catch and gracefully handle syntax errors or exceptions (0 score for that question, but don't crash the app).
- Do fuzzy comparison on outputs where sensible (e.g., trim whitespace, compare arrays by value not reference).

**CSS code questions:**
- Render the candidate's CSS scoped to a hidden test `<div>` structure matching the question, then read back computed styles (`getComputedStyle`) for the properties the question cares about (e.g., `display`, `justify-content`, `gap`) and compare against expected values.
- Score = matched properties / expected properties.

**PHP code questions:**
- True execution requires a PHP runtime, which a no-backend app doesn't have. Use one of these two approaches (pick the simpler one to implement first, note the other as a future improvement in code comments):
  1. **Best-effort static grading (default, simpler):** Regex/keyword-based checks against the candidate's code - e.g. for `sumArray`, check for a loop or `array_sum`, a `return` statement, and the correct function name/signature. Assign partial credit per matched pattern. Clearly flag this question type as "auto-graded (approximate) - recommend manual review" on the results page.
  2. **In-browser PHP execution (optional, more accurate):** Use the `php-wasm` package (a WebAssembly PHP interpreter that runs client-side, no backend needed) to actually execute the candidate's PHP function against test cases, same pass/fail scoring as the JS questions. Note the extra bundle size and load time as a tradeoff.
- Implementation should default to option 1 and leave a clearly commented spot to swap in option 2 later.

**General:**
- Each code question's data object should carry its grading metadata (`testCases` for JS, `expectedStyles` for CSS, `gradingPatterns` for PHP) so the grader is generic and driven by the question bank, not hardcoded per question.
- On the results page, show a per-code-question breakdown: score (e.g. "2/3 test cases passed" or "approximate: 60%"), and a toggle to view the candidate's actual submitted code.

## Results
- On the last question, show a "Submit Test" button.
- Results page shows: total score (MCQs + auto-graded code combined), number correct/incorrect for MCQs, per-question breakdown for code questions (see above), time taken, and a breakdown by topic (HTML/CSS/JS/PHP/React).
- Add a small disclaimer near the total score: "Code question scores are auto-graded and approximate - please spot-check before final evaluation."

## Anti-copy protection
- Disable text selection across the site using CSS (`user-select: none`).
- Disable right-click context menu.
- Disable copy/cut keyboard shortcuts (Ctrl+C, Ctrl+X) and show a small toast/message like "Copying is disabled during the test" if attempted.
- Exception: the candidate should still be able to type freely into the code-answer textarea (typing must work normally, only copying FROM the page should be blocked).

## Visual design
- Clean, minimal, professional UI.
- Border-radius should be small/subtle only (e.g., 4–6px) - avoid pill-shaped buttons or heavily rounded cards.
- Clear typography hierarchy, generous spacing, a neutral color palette (e.g., dark text on white/light gray background, one accent color for buttons/progress bar).
- Responsive layout that works on a laptop screen at minimum.

## Code structure
- Componentize: `App`, `QuestionCard`, `ProgressBar`, `Timer`, `ResultsPage`, `CodeGrader` (or `graders/` folder with `gradeJs.js`, `gradeCss.js`, `gradePhp.js`), and a separate `questions.js` data file holding the question bank below (so it's easy to edit/add questions later).
- Add comments explaining where to plug in a backend (e.g., submit results to an API, or swap the PHP static grader for php-wasm) later.

---

## Question Bank (22 questions, ordered easy → hard-in-middle → medium)

Use this exact order and content. Format each as an object with: `id`, `topic`, `type` (`mcq` or `code`), `difficulty`, `question`, and:
- for `mcq`: `options` + `correctAnswer`
- for `code` (JS): `placeholder` + `testCases` (array of `{ input, expected }`)
- for `code` (CSS): `placeholder` + `expectedStyles`
- for `code` (PHP): `placeholder` + `gradingPatterns` (array of regex/keyword checks, each worth partial credit)

1. **[HTML | mcq | easy]** Which HTML tag is used to define an unordered list?
   - Options: `<ul>`, `<ol>`, `<li>`, `<list>`
   - Correct: `<ul>`

2. **[CSS | mcq | easy]** Which CSS property changes the text color of an element?
   - Options: `font-color`, `text-color`, `color`, `background-color`
   - Correct: `color`

3. **[JS | mcq | easy]** Which keyword is used to declare a variable that cannot be reassigned?
   - Options: `var`, `let`, `const`, `static`
   - Correct: `const`

4. **[PHP | mcq | easy]** How do you start a PHP script block?
   - Options: `<php>`, `<?php`, `<script php>`, `<%php`
   - Correct: `<?php`

5. **[HTML | mcq | easy]** Which attribute is used to provide alternative text for an image?
   - Options: `title`, `alt`, `src`, `description`
   - Correct: `alt`

6. **[CSS | mcq | easy]** Which CSS property is used to control the spacing between the border and content inside an element?
   - Options: `margin`, `padding`, `spacing`, `border-spacing`
   - Correct: `padding`

7. **[JS | code | medium]** Write a JavaScript function `isEven(num)` that returns `true` if a number is even and `false` otherwise.
   - Placeholder: `function isEven(num) {\n  // your code here\n}`
   - Test cases: `isEven(2) => true`, `isEven(3) => false`, `isEven(0) => true`, `isEven(-4) => true`, `isEven(-7) => false`

8. **[React | mcq | medium]** In React, which hook is used to manage state in a functional component?
   - Options: `useEffect`, `useState`, `useRef`, `useContext`
   - Correct: `useState`

9. **[JS | mcq | hard]** What will `[1, 2, 3].map(x => x * 2)` return?
   - Options: `[1, 2, 3]`, `[2, 4, 6]`, `6`, `undefined`
   - Correct: `[2, 4, 6]`

10. **[PHP | code | hard]** Write a PHP function `sumArray($arr)` that returns the sum of all elements in an array.
    - Placeholder: `function sumArray($arr) {\n  // your code here\n}`
    - Grading patterns: contains `function sumArray`, contains `return`, contains a loop (`foreach`/`for`/`while`) OR `array_sum`, does not contain obvious syntax errors (unbalanced braces)

11. **[JS | code | hard]** Write a JavaScript function `reverseString(str)` that returns the reversed version of a string, without using the built-in `.reverse()` array method directly on a string in a one-liner (show your logic).
    - Placeholder: `function reverseString(str) {\n  // your code here\n}`
    - Test cases: `reverseString("hello") => "olleh"`, `reverseString("") => ""`, `reverseString("a") => "a"`, `reverseString("racecar") => "racecar"`, `reverseString("React") => "tcaeR"`

12. **[React | mcq | hard]** What is the correct way to pass data from a parent component to a child component in React?
    - Options: `State`, `Props`, `Context only`, `Redux only`
    - Correct: `Props`

13. **[CSS | mcq | hard]** Which CSS layout model is best suited for building a two-dimensional grid layout (rows AND columns)?
    - Options: `Flexbox`, `CSS Grid`, `Float`, `Position: absolute`
    - Correct: `CSS Grid`

14. **[JS | mcq | hard]** What does the `===` operator check for in JavaScript, compared to `==`?
    - Options: `Only value`, `Only type`, `Both value and type`, `Nothing, they are identical`
    - Correct: `Both value and type`

15. **[PHP | mcq | medium]** Which superglobal array is used to collect form data sent with the POST method in PHP?
    - Options: `$_GET`, `$_POST`, `$_REQUEST`, `$_FORM`
    - Correct: `$_POST`

16. **[HTML | mcq | medium]** Which input type is used to create a checkbox in HTML?
    - Options: `<input type="check">`, `<input type="checkbox">`, `<checkbox>`, `<input type="tick">`
    - Correct: `<input type="checkbox">`

17. **[CSS | code | medium]** Write a CSS rule that makes all direct children of an element with class `.container` display in a row with equal spacing between them using Flexbox.
    - Placeholder: `.container {\n  /* your code here */\n}`
    - Expected styles (on `.container`): `display: flex`, `justify-content: space-between` (accept `space-around`/`space-evenly` as partial credit), `flex-direction: row` (default, so implicit pass if `display: flex` and no `column` set)

18. **[React | mcq | medium]** What does JSX stand for / represent in React?
    - Options: `JavaScript XML`, `Java Syntax Extension`, `JSON XML`, `JavaScript Extra`
    - Correct: `JavaScript XML`

19. **[JS | mcq | medium]** Which method is used to add an element to the end of an array in JavaScript?
    - Options: `array.push()`, `array.pop()`, `array.shift()`, `array.add()`
    - Correct: `array.push()`

20. **[PHP | code | medium]** Write a PHP function `isPalindrome($str)` that returns `true` if the string reads the same forwards and backwards.
    - Placeholder: `function isPalindrome($str) {\n  // your code here\n}`
    - Grading patterns: contains `function isPalindrome`, contains `return`, contains `strrev` OR a manual reversal loop, contains a comparison (`==`/`===`)

21. **[React | mcq | medium]** Which hook would you use to run a side effect (like an API call) when a component mounts?
    - Options: `useState`, `useMemo`, `useEffect`, `useCallback`
    - Correct: `useEffect`

22. **[HTML | mcq | medium]** Which HTML5 semantic tag is best used to wrap the main navigation links of a website?
    - Options: `<div>`, `<nav>`, `<section>`, `<header>`
    - Correct: `<nav>`
