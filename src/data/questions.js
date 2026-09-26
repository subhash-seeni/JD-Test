/**
 * Question Bank (22 questions)
 * Difficulty curve: easy -> hardest in middle -> medium at end.
 * Topics: HTML, CSS, JavaScript, PHP (mixed across topics).
 */

export const QUESTIONS = [
  {
    id: 1,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which HTML tag is used to define an unordered list?',
    options: ['<ul>', '<ol>', '<li>', '<list>'],
    correctAnswer: '<ul>'
  },
  {
    id: 2,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property changes the text color of an element?',
    options: ['font-color', 'text-color', 'color', 'background-color'],
    correctAnswer: 'color'
  },
  {
    id: 3,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which keyword is used to declare a variable that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'const'
  },
  {
    id: 4,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'How do you start a PHP script block?',
    options: ['<php>', '<?php', '<script php>', '<%php'],
    correctAnswer: '<?php'
  },
  {
    id: 5,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which attribute is used to provide alternative text for an image?',
    options: ['title', 'alt', 'src', 'description'],
    correctAnswer: 'alt'
  },
  {
    id: 6,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property is used to control the spacing between the border and content inside an element?',
    options: ['margin', 'padding', 'spacing', 'border-spacing'],
    correctAnswer: 'padding'
  },
  {
    id: 7,
    topic: 'JS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a JavaScript function isEven(num) that returns true if a number is even and false otherwise.',
    placeholder: `function isEven(num) {\n  // your code here\n}`,
    functionName: 'isEven',
    testCases: [
      { input: [2], expected: true, label: 'isEven(2)' },
      { input: [3], expected: false, label: 'isEven(3)' },
      { input: [0], expected: true, label: 'isEven(0)' },
      { input: [-4], expected: true, label: 'isEven(-4)' },
      { input: [-7], expected: false, label: 'isEven(-7)' }
    ]
  },
  {
    id: 8,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, which statement includes and evaluates a file, but throws a fatal error and stops script execution if the file is missing?',
    options: ['require', 'include', 'import', 'load_file'],
    correctAnswer: 'require'
  },
  {
    id: 9,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What will [1, 2, 3].map(x => x * 2) return?',
    options: ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'],
    correctAnswer: '[2, 4, 6]'
  },
  {
    id: 10,
    topic: 'PHP',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a PHP function sumArray($arr) that returns the sum of all elements in an array.',
    placeholder: `function sumArray($arr) {\n  // your code here\n}`,
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function sumArray',
        regex: /function\s+sumArray\s*\(/i,
        weight: 0.25
      },
      {
        id: 'return_statement',
        label: 'Contains a return statement',
        regex: /\breturn\b/i,
        weight: 0.25
      },
      {
        id: 'sum_logic',
        label: 'Uses array_sum or loop (foreach / for / while)',
        regex: /(\barray_sum\s*\(|\bforeach\s*\(|\bfor\s*\(|\bwhile\s*\()/i,
        weight: 0.35
      },
      {
        id: 'balanced_braces',
        label: 'Valid block structure (balanced braces)',
        check: (code) => {
          let depth = 0;
          for (let char of code) {
            if (char === '{') depth++;
            if (char === '}') depth--;
            if (depth < 0) return false;
          }
          return depth === 0 && code.includes('{') && code.includes('}');
        },
        weight: 0.15
      }
    ]
  },
  {
    id: 11,
    topic: 'JS',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a JavaScript function reverseString(str) that returns the reversed version of a string, without using the built-in .reverse() array method directly on a string in a one-liner (show your logic).',
    placeholder: `function reverseString(str) {\n  // your code here\n}`,
    functionName: 'reverseString',
    testCases: [
      { input: ['hello'], expected: 'olleh', label: 'reverseString("hello")' },
      { input: [''], expected: '', label: 'reverseString("")' },
      { input: ['a'], expected: 'a', label: 'reverseString("a")' },
      { input: ['racecar'], expected: 'racecar', label: 'reverseString("racecar")' },
      { input: ['world'], expected: 'dlrow', label: 'reverseString("world")' }
    ],
    antiPatternCheck: {
      regex: /\.split\s*\(\s*['"]\s*['"]\s*\)\s*\.reverse\s*\(\s*\)\s*\.join\s*\(\s*['"]\s*['"]\s*\)/,
      penaltyMessage: 'Note: Used one-liner .split().reverse().join() contrary to instruction to show manual logic.'
    }
  },
  {
    id: 12,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'In JavaScript, which description best defines a closure?',
    options: [
      'A function bundled together with references to its surrounding lexical environment',
      'A method used to close open database or socket connections',
      'A function that executes immediately and terminates the event loop',
      'A syntax error caused by an unclosed curly brace'
    ],
    correctAnswer: 'A function bundled together with references to its surrounding lexical environment'
  },
  {
    id: 13,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which CSS layout model is best suited for building a two-dimensional grid layout (rows AND columns)?',
    options: ['Flexbox', 'CSS Grid', 'Float', 'Position: absolute'],
    correctAnswer: 'CSS Grid'
  },
  {
    id: 14,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What does the === operator check for in JavaScript, compared to ==?',
    options: ['Only value', 'Only type', 'Both value and type', 'Nothing, they are identical'],
    correctAnswer: 'Both value and type'
  },
  {
    id: 15,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which superglobal array is used to collect form data sent with the POST method in PHP?',
    options: ['$_GET', '$_POST', '$_REQUEST', '$_FORM'],
    correctAnswer: '$_POST'
  },
  {
    id: 16,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which input type is used to create a checkbox in HTML?',
    options: ['<input type="check">', '<input type="checkbox">', '<checkbox>', '<input type="tick">'],
    correctAnswer: '<input type="checkbox">'
  },
  {
    id: 17,
    topic: 'CSS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a CSS rule that makes all direct children of an element with class .container display in a row with equal spacing between them using Flexbox.',
    placeholder: `.container {\n  /* your code here */\n}`,
    expectedStyles: {
      targetSelector: '.container',
      htmlSnippet: '<div class="container"><div class="item">Item 1</div><div class="item">Item 2</div><div class="item">Item 3</div></div>',
      properties: [
        {
          name: 'display',
          expected: ['flex', 'inline-flex'],
          weight: 0.4,
          label: 'display: flex'
        },
        {
          name: 'justify-content',
          expected: ['space-between'],
          partialMatches: ['space-around', 'space-evenly'],
          partialWeightRatio: 0.7,
          weight: 0.4,
          label: 'justify-content: space-between'
        },
        {
          name: 'flex-direction',
          expected: ['row', ''], // row is default in flex
          weight: 0.2,
          label: 'flex-direction: row (or default)'
        }
      ]
    }
  },
  {
    id: 18,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML attribute is used to specify that a link should open in a new browser tab or window?',
    options: ['target="_blank"', 'href="_new"', 'rel="external"', 'window="open"'],
    correctAnswer: 'target="_blank"'
  },
  {
    id: 19,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which method is used to add an element to the end of an array in JavaScript?',
    options: ['array.push()', 'array.pop()', 'array.shift()', 'array.add()'],
    correctAnswer: 'array.push()'
  },
  {
    id: 20,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a PHP function isPalindrome($str) that returns true if the string reads the same forwards and backwards.',
    placeholder: `function isPalindrome($str) {\n  // your code here\n}`,
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function isPalindrome',
        regex: /function\s+isPalindrome\s*\(/i,
        weight: 0.25
      },
      {
        id: 'return_statement',
        label: 'Contains a return statement',
        regex: /\breturn\b/i,
        weight: 0.25
      },
      {
        id: 'reversal_logic',
        label: 'Contains strrev or reversal loop',
        regex: /(\bstrrev\s*\(|\bfor\s*\(|\bwhile\s*\(|\bforeach\s*\()/i,
        weight: 0.30
      },
      {
        id: 'comparison',
        label: 'Contains comparison operator (== or ===)',
        regex: /(===|==)/,
        weight: 0.20
      }
    ]
  },
  {
    id: 21,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which CSS box-sizing property value ensures padding and border are included within the element\'s total width and height?',
    options: ['border-box', 'content-box', 'padding-box', 'margin-box'],
    correctAnswer: 'border-box'
  },
  {
    id: 22,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML5 semantic tag is best used to wrap the main navigation links of a website?',
    options: ['<div>', '<nav>', '<section>', '<header>'],
    correctAnswer: '<nav>'
  }
];
