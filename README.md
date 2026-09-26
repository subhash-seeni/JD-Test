# Junior Developer Skills Assessment Test App

A responsive, single-page React web application designed for evaluating candidates on core full-stack web development competencies: **HTML, CSS, JavaScript, and PHP**.

Built with React hooks, modern CSS, sandboxed browser-side auto-graders, and automatic results transmission directly to Google Workspace email.

---

## 🌟 Key Features

1. **Candidate Registration & Welcome Screen**
   - Collects candidate's full name and email address before starting.
   - Comprehensive guidelines, instruction cards, and topic overview.
   - The 50-minute test timer **only begins** after clicking *"Start Test"*.

2. **22 Carefully Curated Questions (Difficulty Curve)**
   - **HTML** (5 questions): Semantic tags, lists, image accessibility, form inputs, anchor attributes.
   - **CSS** (5 questions): Color, padding, CSS Grid, Box Model (`border-box`), and hands-on Flexbox container styling.
   - **JavaScript** (7 questions): Variables, immutability, operators, array manipulation, closures, and 2 hands-on coding challenges (`isEven`, `reverseString`).
   - **PHP** (5 questions): Script tags, superglobals (`$_POST`), file imports (`require` vs `include`), and 2 hands-on coding challenges (`sumArray`, `isPalindrome`).

3. **Sandboxed In-Browser Auto-Grading**
   - **JavaScript**: Executes candidate code inside an isolated Web Worker with strict timeout limits (guarding against infinite loops) and fuzzy comparison.
   - **CSS**: Renders candidate code scoped to an isolated hidden DOM tree and inspects `getComputedStyle` against expected layout metrics.
   - **PHP**: Structural pattern evaluation with partial credit, clearly flagged for human spot-check.

4. **Candidate Flow & Anti-Copy Protection**
   - One question per screen.
   - **Answer Persistence**: Candidates can navigate back and forth using **Previous / Next** or jump directly via the **Question Navigator (1–22)** without losing answers or code.
   - **Anti-Cheat Measures**: Text selection disabled, right-click context menu disabled, and copy/cut shortcuts intercepted with notification toasts. Code editor typing and tab indentation remain fully functional.

5. **Automated Results Delivery (Google Workspace)**
   - Results, scores, topic breakdown, and the candidate's raw submitted code are dispatched directly to **`subhash@geotrixteam.com`** via Google Apps Script upon submission.

---

## 🚀 Live Deployment on GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the site whenever changes are pushed to `main`.

### To Enable GitHub Pages:
1. Push this repository to GitHub and ensure it is **Public**.
2. Go to your repository's **Settings** tab.
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select:
   👉 **`GitHub Actions`**
5. That's it! GitHub Actions will run the workflow and provide you with your live URL:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## ⚙️ Configuration

- [src/config.js](src/config.js): Customize test duration (`TEST_DURATION_MINUTES = 30`), navigation permissions (`ALLOW_BACK = true`), and execution timeouts.
- [src/data/questions.js](src/data/questions.js): Edit, add, or customize questions, test cases, and difficulty order.
- [src/emailConfig.js](src/emailConfig.js): Contains the Google Apps Script Webhook URL and recipient email address.
