import { gradeJsCode } from './gradeJs.js';
import { gradeCssCode } from './gradeCss.js';
import { gradePhpCode } from './gradePhp.js';

/**
 * Unified Grading Dispatcher
 * Automatically grades MCQ or Code (JS/CSS/PHP)
 */
export async function gradeAnswer(question, answer) {
  if (question.type === 'mcq') {
    const isCorrect = answer === question.correctAnswer;
    return {
      type: 'mcq',
      questionId: question.id,
      topic: question.topic,
      submittedAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      score: isCorrect ? 1 : 0
    };
  }

  // Code Question Grading
  const code = (answer || '').trim();
  let gradeResult;

  if (question.topic === 'JS') {
    gradeResult = await gradeJsCode(code, question);
  } else if (question.topic === 'CSS') {
    gradeResult = await gradeCssCode(code, question);
  } else if (question.topic === 'PHP') {
    gradeResult = await gradePhpCode(code, question);
  } else {
    gradeResult = {
      score: 0,
      passedCount: 0,
      totalCount: 1,
      feedback: 'Unknown question format'
    };
  }

  return {
    type: 'code',
    questionId: question.id,
    topic: question.topic,
    submittedCode: answer,
    ...gradeResult
  };
}

/**
 * Batch grade all answers when submitting test
 */
export async function gradeAllAnswers(questions, userAnswers) {
  const gradedResults = {};
  for (const q of questions) {
    const ans = userAnswers[q.id];
    gradedResults[q.id] = await gradeAnswer(q, ans);
  }
  return gradedResults;
}
