/**
 * Question Bank (30 questions)
 * Difficulty curve: easy -> moderate -> coding challenges -> consolidating at end.
 * Topics: HTML, CSS, JavaScript, PHP.
 * Covers PHP: foreach loops, date functions, array/string functions, function declaration & invocation.
 */

export const QUESTIONS = [
  // Q1 - HTML (Easy MCQ) - Refreshed
  {
    id: 1,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which HTML tag is used to create a drop-down list of selectable options in a web form?',
    options: ['<select>', '<dropdown>', '<input type="dropdown">', '<optionlist>'],
    correctAnswer: '<select>'
  },

  // Q2 - CSS (Easy MCQ) - Refreshed
  {
    id: 2,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property controls the boldness or thickness of text?',
    options: ['font-weight', 'font-bold', 'text-thickness', 'font-style'],
    correctAnswer: 'font-weight'
  },

  // Q3 - JS (Easy MCQ) - Refreshed
  {
    id: 3,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which JavaScript keyword declares a block-scoped variable that can be reassigned later?',
    options: ['let', 'var', 'const', 'def'],
    correctAnswer: 'let'
  },

  // Q4 - PHP (Easy MCQ)
  {
    id: 4,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'How do you start a standard PHP script block?',
    options: ['<?php', '<php>', '<script php>', '<%php'],
    correctAnswer: '<?php'
  },

  // Q5 - HTML (Easy MCQ)
  {
    id: 5,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which attribute is used to provide alternative text for an image element?',
    options: ['alt', 'title', 'src', 'description'],
    correctAnswer: 'alt'
  },

  // Q6 - CSS (Easy MCQ)
  {
    id: 6,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property is used to control the spacing between the border and the inner content of an element?',
    options: ['padding', 'margin', 'spacing', 'border-spacing'],
    correctAnswer: 'padding'
  },

  // Q7 - JS (Medium Code) - Refreshed (findMax)
  {
    id: 7,
    topic: 'JS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a JavaScript function findMax(numbers) that takes an array of numbers and returns the largest number in the array.',
    placeholder: `function findMax(numbers) {\n  // your code here\n}`,
    functionName: 'findMax',
    hints: [
      'Accept an array of numbers as argument',
      'Iterate through the array or use Math.max(...numbers)',
      'Return the largest numeric value'
    ],
    testCases: [
      { input: [[3, 7, 2, 9, 4]], expected: 9, label: 'findMax([3, 7, 2, 9, 4])' },
      { input: [[-10, -3, -50]], expected: -3, label: 'findMax([-10, -3, -50])' },
      { input: [[42]], expected: 42, label: 'findMax([42])' },
      { input: [[0, 0, 0]], expected: 0, label: 'findMax([0, 0, 0])' },
      { input: [[-5, 10, 2]], expected: 10, label: 'findMax([-5, 10, 2])' },
      { input: [[100, 250, 80]], expected: 250, label: 'findMax([100, 250, 80])' }
    ]
  },

  // Q8 - PHP (Medium MCQ)
  {
    id: 8,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, which statement includes and evaluates a file, but throws a fatal error and stops script execution if the file is missing?',
    options: ['require', 'include', 'import', 'load_file'],
    correctAnswer: 'require'
  },

  // Q9 - JS (Hard MCQ)
  {
    id: 9,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What will [1, 2, 3].map(x => x * 2) return?',
    options: ['[2, 4, 6]', '[1, 2, 3]', '6', 'undefined'],
    correctAnswer: '[2, 4, 6]'
  },

  // Q10 - PHP (Foreach Loop - Medium Code) - NEW
  {
    id: 10,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function calculateCartTotal($items) that accepts an array of cart items, where each item is an associative array with 'price' and 'quantity' keys. Use a foreach loop to calculate and return the total cost of all items in the cart.",
    placeholder: `function calculateCartTotal($items) {\n  // your code here\n}`,
    hints: [
      'Define function calculateCartTotal($items)',
      'Use a foreach loop: foreach ($items as $item)',
      'Multiply price by quantity for each item and add to a running total',
      'Return the accumulated total sum'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function calculateCartTotal($items)',
        regex: /function\s+calculateCartTotal\s*\(/i,
        weight: 0.20
      },
      {
        id: 'foreach_loop',
        label: 'Uses foreach loop to iterate through items array',
        regex: /\bforeach\s*\(\s*\$[a-zA-Z0-9_]+\s+as\s+/i,
        weight: 0.30
      },
      {
        id: 'calc_multiplication',
        label: 'Multiplies item price by quantity and accumulates',
        check: (code) => {
          return /\*/.test(code) && /(price|quantity|qty|\[['"]?\w+['"]?\]|\$[a-zA-Z0-9_]+)/i.test(code);
        },
        weight: 0.25
      },
      {
        id: 'return_total',
        label: 'Contains return statement for calculated total',
        regex: /\breturn\s+\$[a-zA-Z0-9_]+/i,
        weight: 0.15
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
        weight: 0.10
      }
    ]
  },

  // Q11 - PHP (Foreach Loop - Easy MCQ) - NEW
  {
    id: 11,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In PHP, which of the following is the correct syntax for a foreach loop to iterate through an associative array while accessing both the key and the value?',
    options: [
      'foreach ($array as $key => $value) { ... }',
      'foreach ($array as $value => $key) { ... }',
      'foreach ($key => $value in $array) { ... }',
      'for ($array as $key : $value) { ... }'
    ],
    correctAnswer: 'foreach ($array as $key => $value) { ... }'
  },

  // Q12 - JS (Hard Code) - Refreshed (countVowels)
  {
    id: 12,
    topic: 'JS',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a JavaScript function countVowels(str) that counts and returns the total number of vowels (a, e, i, o, u, case-insensitive) in a given string.',
    placeholder: `function countVowels(str) {\n  // your code here\n}`,
    functionName: 'countVowels',
    hints: [
      'Count all occurrences of vowels: a, e, i, o, u',
      'Must be case-insensitive (e.g., handles "A", "E")',
      'Return 0 for empty strings or strings without vowels'
    ],
    testCases: [
      { input: ['hello'], expected: 2, label: 'countVowels("hello")' },
      { input: ['JavaScript'], expected: 3, label: 'countVowels("JavaScript")' },
      { input: ['xyz'], expected: 0, label: 'countVowels("xyz")' },
      { input: ['AEIOU'], expected: 5, label: 'countVowels("AEIOU")' },
      { input: [''], expected: 0, label: 'countVowels("")' },
      { input: ['Web Developer'], expected: 4, label: 'countVowels("Web Developer")' }
    ]
  },

  // Q13 - JS (Hard MCQ) - Refreshed (typeof null)
  {
    id: 13,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'In JavaScript, what does the expression typeof null evaluate to?',
    options: ['"object"', '"null"', '"undefined"', '"number"'],
    correctAnswer: '"object"'
  },

  // Q14 - CSS (Hard MCQ)
  {
    id: 14,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which CSS layout model is specifically designed for building a two-dimensional layout (handling rows AND columns simultaneously)?',
    options: ['CSS Grid', 'Flexbox', 'Float', 'Position: absolute'],
    correctAnswer: 'CSS Grid'
  },

  // Q15 - PHP (Date Function - Medium Code) - NEW
  {
    id: 15,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function formatCustomDateTime($timestamp) that takes a UNIX timestamp integer and uses PHP's built-in date() function to return a formatted date and time string in the format 'Y-m-d H:i:s' (e.g. '2026-03-30 14:30:00').",
    placeholder: `function formatCustomDateTime($timestamp) {\n  // your code here\n}`,
    hints: [
      'Call PHP built-in date($format, $timestamp)',
      "Use format string 'Y-m-d H:i:s' (24-hour format with leading zeros)",
      'Return the formatted date string'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function formatCustomDateTime($timestamp)',
        regex: /function\s+formatCustomDateTime\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_date_func',
        label: 'Calls built-in date() function',
        regex: /\bdate\s*\(/i,
        weight: 0.25
      },
      {
        id: 'format_string',
        label: "Uses exact format 'Y-m-d H:i:s'",
        regex: /['"]Y-m-d\s+H:i:s['"]/,
        weight: 0.30
      },
      {
        id: 'return_statement',
        label: 'Returns formatted date with timestamp parameter',
        regex: /\breturn\s+(date\s*\(|\$[a-zA-Z0-9_]+)/i,
        weight: 0.15
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
        weight: 0.10
      }
    ]
  },

  // Q16 - PHP (Date Function - Easy MCQ) - NEW
  {
    id: 16,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: "In PHP, which date() format string outputs the date and time in 24-hour format with leading zeros like '2026-05-15 09:30:00'?",
    options: [
      "date('Y-m-d H:i:s')",
      "date('yyyy-mm-dd hh:mm:ss')",
      "date('Y-M-D h:i:s')",
      "date('d-m-Y H:i:s')"
    ],
    correctAnswer: "date('Y-m-d H:i:s')"
  },

  // Q17 - CSS (Medium Code)
  {
    id: 17,
    topic: 'CSS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a CSS rule that makes all direct children of an element with class .container display in a row with equal spacing between them using Flexbox.',
    placeholder: `.container {\n  /* your code here */\n}`,
    hints: [
      'Target selector: .container',
      'Set display to flex',
      'Set justify-content to space-between',
      'flex-direction is row by default'
    ],
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
          expected: ['row', ''],
          weight: 0.2,
          label: 'flex-direction: row (or default)'
        }
      ]
    }
  },

  // Q18 - PHP (Function Declaration & Invocation - Medium Code) - NEW
  {
    id: 18,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write PHP code that:\n1. Declares a function named calculateDiscount($originalPrice, $discountPercent) that calculates and returns the price after applying the discount.\n2. Calls the function with $originalPrice = 100 and $discountPercent = 20, storing the returned result in a variable named $finalPrice.",
    placeholder: `// 1. Declare the calculateDiscount function\nfunction calculateDiscount($originalPrice, $discountPercent) {\n  // your code here\n}\n\n// 2. Call the function and assign to $finalPrice\n$finalPrice = calculateDiscount(100, 20);`,
    hints: [
      'Declare function calculateDiscount($originalPrice, $discountPercent)',
      'Calculate: $originalPrice - ($originalPrice * ($discountPercent / 100))',
      'Return the final discounted value',
      'Call calculateDiscount(100, 20) and assign to $finalPrice'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function calculateDiscount($originalPrice, $discountPercent)',
        regex: /function\s+calculateDiscount\s*\(\s*\$[a-zA-Z0-9_]+\s*,\s*\$[a-zA-Z0-9_]+\s*\)/i,
        weight: 0.25
      },
      {
        id: 'discount_calculation',
        label: 'Calculates discounted price math formula',
        check: (code) => {
          return /(-|\*|\/)/.test(code) && /(price|discount|100|\$[a-zA-Z0-9_]+)/i.test(code);
        },
        weight: 0.25
      },
      {
        id: 'return_statement',
        label: 'Returns the discounted price',
        regex: /\breturn\b/i,
        weight: 0.15
      },
      {
        id: 'function_invocation',
        label: 'Calls calculateDiscount with arguments',
        regex: /\bcalculateDiscount\s*\(\s*(100|\$[a-zA-Z0-9_]+)\s*,\s*(20|\$[a-zA-Z0-9_]+)\s*\)/i,
        weight: 0.25
      },
      {
        id: 'variable_assignment',
        label: 'Assigns result to $finalPrice',
        regex: /\$finalPrice\s*=\s*calculateDiscount/i,
        weight: 0.10
      }
    ]
  },

  // Q19 - PHP (Function Declaration with Default Arg - Medium MCQ) - NEW
  {
    id: 19,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, how do you declare a function with an optional parameter having a default value of 0.08 for $taxRate, and call it without passing that second argument?',
    options: [
      'function addTax($amount, $taxRate = 0.08) { ... } called with addTax(50);',
      'def addTax($amount, $taxRate: 0.08) { ... } called with addTax(50);',
      'function addTax($amount, $taxRate == 0.08) { ... } called with call addTax(50);',
      'addTax = function($amount, default $taxRate = 0.08) { ... } called with addTax.exec(50);'
    ],
    correctAnswer: 'function addTax($amount, $taxRate = 0.08) { ... } called with addTax(50);'
  },

  // Q20 - PHP (Array Functions - Medium Code) - NEW
  {
    id: 20,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function filterEvenNumbers($numbers) that takes an array of integers and uses PHP's array_filter() function to return an array containing only the even numbers, re-indexed using array_values().",
    placeholder: `function filterEvenNumbers($numbers) {\n  // your code here\n}`,
    hints: [
      'Declare function filterEvenNumbers($numbers)',
      'Use array_filter($numbers, callback) to filter even numbers ($n % 2 === 0)',
      'Use array_values() to reset array keys',
      'Return the filtered array'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function filterEvenNumbers($numbers)',
        regex: /function\s+filterEvenNumbers\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_array_filter',
        label: 'Uses built-in array_filter() function',
        regex: /\barray_filter\s*\(/i,
        weight: 0.30
      },
      {
        id: 'even_modulo_check',
        label: 'Checks for even numbers with modulo operator (% 2 == 0)',
        regex: /%\s*2\s*===?\s*0/i,
        weight: 0.25
      },
      {
        id: 'uses_array_values_or_return',
        label: 'Re-indexes using array_values() and returns array',
        regex: /(\barray_values\s*\(|\breturn\b)/i,
        weight: 0.15
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
        weight: 0.10
      }
    ]
  },

  // Q21 - PHP (String Functions - Medium Code) - NEW
  {
    id: 21,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function formatUserProfileSlug($rawUsername) that takes a username string, trims leading and trailing whitespace using trim(), converts all characters to lowercase using strtolower(), and replaces internal spaces with hyphens ('-') using str_replace(), returning the cleaned slug.",
    placeholder: `function formatUserProfileSlug($rawUsername) {\n  // your code here\n}`,
    hints: [
      'trim($rawUsername) strips whitespace from boundaries',
      'strtolower(...) converts all characters to lowercase',
      "str_replace(' ', '-', ...) replaces spaces with hyphens",
      'Return the cleaned slug string'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function formatUserProfileSlug',
        regex: /function\s+formatUserProfileSlug\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_trim',
        label: 'Uses trim() to strip boundary whitespace',
        regex: /\btrim\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_strtolower',
        label: 'Uses strtolower() to convert to lowercase',
        regex: /\b(mb_)?strtolower\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_str_replace',
        label: "Uses str_replace() to replace spaces with hyphens ('-')",
        regex: /\bstr_replace\s*\(/i,
        weight: 0.25
      },
      {
        id: 'return_statement',
        label: 'Returns the formatted slug string',
        regex: /\breturn\b/i,
        weight: 0.15
      }
    ]
  },

  // Q22 - PHP (Array/String Functions - Medium MCQ) - NEW
  {
    id: 22,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: "Which PHP function is used to join elements of an array into a single string with a specified separator (e.g. converting ['PHP', 'MySQL', 'JavaScript'] into 'PHP, MySQL, JavaScript')?",
    options: ['implode()', 'explode()', 'array_join()', 'str_split()'],
    correctAnswer: 'implode()'
  },

  // Q23 - PHP (Array/String Functions - Easy MCQ) - NEW
  {
    id: 23,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: "In PHP, which function splits a string into an array by a specified delimiter (e.g. breaking 'apple,banana,orange' at each comma)?",
    options: ['explode()', 'implode()', 'str_split()', 'array_slice()'],
    correctAnswer: 'explode()'
  },

  // Q24 - PHP (Environment Variables - Medium MCQ) - Refreshed
  {
    id: 24,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which PHP superglobal array contains server information, request headers, client IP, and script execution paths?',
    options: ['$_SERVER', '$_ENV', '$_GLOBAL', '$_REQUEST'],
    correctAnswer: '$_SERVER'
  },

  // Q25 - PHP (General PHP - Hard Code) - Preserved
  {
    id: 25,
    topic: 'PHP',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a PHP function sumArray($arr) that returns the sum of all elements in an array.',
    placeholder: `function sumArray($arr) {\n  // your code here\n}`,
    hints: [
      'Declare function sumArray($arr)',
      'Use array_sum($arr) or iterate using a foreach loop',
      'Return the calculated total'
    ],
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

  // Q26 - HTML (Medium MCQ)
  {
    id: 26,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which input type is used to create a checkbox element in HTML?',
    options: ['<input type="checkbox">', '<input type="check">', '<checkbox>', '<input type="tick">'],
    correctAnswer: '<input type="checkbox">'
  },

  // Q27 - HTML (Medium MCQ)
  {
    id: 27,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML attribute is used to specify that a link should open in a new browser tab or window?',
    options: ['target="_blank"', 'href="_new"', 'rel="external"', 'window="open"'],
    correctAnswer: 'target="_blank"'
  },

  // Q28 - JS (Medium MCQ)
  {
    id: 28,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which method is used to append a new element to the end of an array in JavaScript?',
    options: ['array.push()', 'array.pop()', 'array.shift()', 'array.add()'],
    correctAnswer: 'array.push()'
  },

  // Q29 - CSS (Medium MCQ)
  {
    id: 29,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'medium',
    question: "Which CSS box-sizing property value ensures that padding and border are included within the element's total width and height?",
    options: ['border-box', 'content-box', 'padding-box', 'margin-box'],
    correctAnswer: 'border-box'
  },

  // Q30 - HTML (Medium MCQ)
  {
    id: 30,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML5 semantic tag is specifically designated to wrap the primary navigation links of a website?',
    options: ['<nav>', '<div>', '<section>', '<header>'],
    correctAnswer: '<nav>'
  }
];
