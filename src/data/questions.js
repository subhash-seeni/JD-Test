/**
 * Question Bank – Set 2 (30 questions – replacement for retake)
 * Same structure, topics, and difficulty distribution as Set 1.
 * Topics: HTML, CSS, JavaScript, PHP.
 * 21 MCQs + 9 Code questions.
 */

export const QUESTIONS = [
  // Q1 – HTML (Easy MCQ)
  {
    id: 1,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which HTML element is used to display text as a heading of the highest importance (largest by default)?',
    options: ['<h1>', '<h6>', '<header>', '<heading>'],
    correctAnswer: '<h1>'
  },

  // Q2 – CSS (Easy MCQ)
  {
    id: 2,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property is used to make text appear in italic style?',
    options: ['font-style', 'font-weight', 'text-decoration', 'text-style'],
    correctAnswer: 'font-style'
  },

  // Q3 – JS (Easy MCQ)
  {
    id: 3,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which built-in JavaScript function displays an alert dialog box with a message?',
    options: ['alert()', 'prompt()', 'confirm()', 'console.log()'],
    correctAnswer: 'alert()'
  },

  // Q4 – PHP (Easy MCQ)
  {
    id: 4,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In PHP, which symbol must prefix every variable name?',
    options: ['$', '@', '#', '%'],
    correctAnswer: '$'
  },

  // Q5 – HTML (Easy MCQ)
  {
    id: 5,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which HTML element is used to define an unordered (bulleted) list?',
    options: ['<ul>', '<ol>', '<li>', '<list>'],
    correctAnswer: '<ul>'
  },

  // Q6 – CSS (Easy MCQ)
  {
    id: 6,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which CSS property controls the size of text on a webpage?',
    options: ['font-size', 'text-size', 'font-height', 'letter-size'],
    correctAnswer: 'font-size'
  },

  // Q7 – JS (Medium Code)
  {
    id: 7,
    topic: 'JS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a JavaScript function reverseString(str) that takes a string and returns it reversed. For example, reverseString("hello") should return "olleh".',
    placeholder: `function reverseString(str) {\n  // your code here\n}`,
    functionName: 'reverseString',
    hints: [
      'Accept a string as an argument',
      'Split the string into characters, reverse the array, and join back',
      'Or use a loop to build the reversed string',
      'Return the reversed string'
    ],
    testCases: [
      { input: ['hello'], expected: 'olleh', label: 'reverseString("hello")' },
      { input: ['JavaScript'], expected: 'tpircSavaJ', label: 'reverseString("JavaScript")' },
      { input: [''], expected: '', label: 'reverseString("")' },
      { input: ['a'], expected: 'a', label: 'reverseString("a")' },
      { input: ['abcde'], expected: 'edcba', label: 'reverseString("abcde")' },
      { input: ['12345'], expected: '54321', label: 'reverseString("12345")' }
    ]
  },

  // Q8 – PHP (Medium MCQ)
  {
    id: 8,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, which built-in function returns the number of elements in an array?',
    options: ['count()', 'array_length()', 'strlen()', 'array_size()'],
    correctAnswer: 'count()'
  },

  // Q9 – JS (Hard MCQ)
  {
    id: 9,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What does console.log(0.1 + 0.2 === 0.3) output in JavaScript?',
    options: ['false', 'true', 'NaN', 'undefined'],
    correctAnswer: 'false'
  },

  // Q10 – PHP (Medium Code – array_reverse)
  {
    id: 10,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function reverseArray($arr) that accepts an array and returns it in reversed order using PHP's built-in array_reverse() function.",
    placeholder: `function reverseArray($arr) {\n  // your code here\n}`,
    hints: [
      'Declare function reverseArray($arr)',
      'Call array_reverse($arr) on the input',
      'Return the reversed array'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function reverseArray($arr)',
        regex: /function\s+reverseArray\s*\(/i,
        weight: 0.25
      },
      {
        id: 'uses_array_reverse',
        label: 'Calls built-in array_reverse()',
        regex: /\barray_reverse\s*\(/i,
        weight: 0.40
      },
      {
        id: 'return_statement',
        label: 'Returns the reversed array',
        regex: /\breturn\b/i,
        weight: 0.20
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

  // Q11 – PHP (Easy MCQ)
  {
    id: 11,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In PHP, which function returns the number of characters in a string?',
    options: ['strlen()', 'length()', 'str_length()', 'count()'],
    correctAnswer: 'strlen()'
  },

  // Q12 – JS (Hard Code – isPalindrome)
  {
    id: 12,
    topic: 'JS',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a JavaScript function isPalindrome(str) that returns true if the given string reads the same forwards and backwards (case-insensitive), and false otherwise. For example, isPalindrome("Madam") should return true.',
    placeholder: `function isPalindrome(str) {\n  // your code here\n}`,
    functionName: 'isPalindrome',
    hints: [
      'Convert the string to lowercase for case-insensitive comparison',
      'Reverse the string and compare it to the original lowercased string',
      'Return true if they match, false otherwise',
      'Empty string is considered a palindrome'
    ],
    testCases: [
      { input: ['racecar'], expected: true, label: 'isPalindrome("racecar")' },
      { input: ['hello'], expected: false, label: 'isPalindrome("hello")' },
      { input: ['A'], expected: true, label: 'isPalindrome("A")' },
      { input: ['Madam'], expected: true, label: 'isPalindrome("Madam")' },
      { input: [''], expected: true, label: 'isPalindrome("")' },
      { input: ['JavaScript'], expected: false, label: 'isPalindrome("JavaScript")' }
    ]
  },

  // Q13 – JS (Hard MCQ)
  {
    id: 13,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What is the key difference between == and === in JavaScript?',
    options: [
      '=== checks both value and type (strict); == checks value only after type coercion',
      '== checks both value and type; === only checks the value',
      'They are completely identical in all cases',
      '=== is used for objects only; == is used for primitives'
    ],
    correctAnswer: '=== checks both value and type (strict); == checks value only after type coercion'
  },

  // Q14 – CSS (Hard MCQ)
  {
    id: 14,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'hard',
    question: 'Which CSS property controls the stacking order of overlapping positioned elements on a webpage?',
    options: ['z-index', 'stack-order', 'layer-order', 'depth'],
    correctAnswer: 'z-index'
  },

  // Q15 – PHP (Medium Code – string concat / interpolation)
  {
    id: 15,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function generateGreeting($name, $timeOfDay) that accepts a person's name and a time-of-day string, and returns a greeting such as \"Good morning, Alice!\". Use PHP string concatenation (.) or string interpolation to build the output.",
    placeholder: `function generateGreeting($name, $timeOfDay) {\n  // your code here\n}`,
    hints: [
      'Declare function generateGreeting($name, $timeOfDay)',
      'Build the greeting string using . concatenation or double-quoted interpolation',
      'Return the final greeting string'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function generateGreeting with two parameters',
        regex: /function\s+generateGreeting\s*\(\s*\$[a-zA-Z0-9_]+\s*,\s*\$[a-zA-Z0-9_]+\s*\)/i,
        weight: 0.25
      },
      {
        id: 'string_building',
        label: 'Builds greeting string using concatenation or interpolation',
        check: (code) => {
          return /\.\s*\$[a-zA-Z0-9_]+/.test(code) || /"\$[a-zA-Z0-9_]+/.test(code) || /'[^']*'\s*\.\s*/.test(code);
        },
        weight: 0.35
      },
      {
        id: 'return_statement',
        label: 'Returns the greeting string',
        regex: /\breturn\b/i,
        weight: 0.25
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

  // Q16 – PHP (Easy MCQ)
  {
    id: 16,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In PHP, which operator is used to concatenate (join) two strings together?',
    options: ['.', '+', '&', '||'],
    correctAnswer: '.'
  },

  // Q17 – CSS (Medium Code – centering with Flexbox)
  {
    id: 17,
    topic: 'CSS',
    type: 'code',
    difficulty: 'medium',
    question: 'Write a CSS rule for a .wrapper element that uses Flexbox to center its child content both horizontally and vertically.',
    placeholder: `.wrapper {\n  /* your code here */\n}`,
    hints: [
      'Target selector: .wrapper',
      'Set display to flex',
      'Set justify-content to center (horizontal)',
      'Set align-items to center (vertical)'
    ],
    expectedStyles: {
      targetSelector: '.wrapper',
      htmlSnippet: '<div class="wrapper" style="width:200px;height:200px;"><div class="child">Center me</div></div>',
      properties: [
        {
          name: 'display',
          expected: ['flex', 'inline-flex'],
          weight: 0.4,
          label: 'display: flex'
        },
        {
          name: 'justify-content',
          expected: ['center'],
          partialMatches: ['space-around', 'space-evenly'],
          partialWeightRatio: 0.5,
          weight: 0.3,
          label: 'justify-content: center'
        },
        {
          name: 'align-items',
          expected: ['center'],
          partialMatches: ['stretch'],
          partialWeightRatio: 0.3,
          weight: 0.3,
          label: 'align-items: center'
        }
      ]
    }
  },

  // Q18 – PHP (Medium Code – str_word_count + function call)
  {
    id: 18,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write PHP code that:\n1. Declares a function countWords($sentence) that uses PHP's str_word_count() to count and return the number of words in the given string.\n2. Calls the function with the string \"Hello World from PHP\" and stores the result in a variable named $wordCount.",
    placeholder: `// 1. Declare the countWords function\nfunction countWords($sentence) {\n  // your code here\n}\n\n// 2. Call the function and assign to $wordCount\n$wordCount = countWords("Hello World from PHP");`,
    hints: [
      'Declare function countWords($sentence)',
      'Use str_word_count($sentence) inside the function',
      'Return the count',
      'Call countWords("Hello World from PHP") and assign to $wordCount'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function countWords($sentence)',
        regex: /function\s+countWords\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_str_word_count',
        label: 'Uses built-in str_word_count() function',
        regex: /\bstr_word_count\s*\(/i,
        weight: 0.30
      },
      {
        id: 'return_statement',
        label: 'Returns the word count',
        regex: /\breturn\b/i,
        weight: 0.15
      },
      {
        id: 'function_invocation',
        label: 'Calls countWords with a string argument',
        regex: /\bcountWords\s*\([^)]+\)/i,
        weight: 0.20
      },
      {
        id: 'variable_assignment',
        label: 'Assigns result to $wordCount',
        regex: /\$wordCount\s*=\s*countWords/i,
        weight: 0.15
      }
    ]
  },

  // Q19 – PHP (Medium MCQ)
  {
    id: 19,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, which superglobal array is used to collect form data submitted via the HTTP POST method?',
    options: ['$_POST', '$_GET', '$_REQUEST', '$_FORM'],
    correctAnswer: '$_POST'
  },

  // Q20 – PHP (Medium Code – ucwords)
  {
    id: 20,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function capitalizeWords($str) that takes a string and returns it with the first letter of every word capitalized, using PHP's built-in ucwords() function.",
    placeholder: `function capitalizeWords($str) {\n  // your code here\n}`,
    hints: [
      'Declare function capitalizeWords($str)',
      'Call ucwords($str) on the input',
      'Return the result'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function capitalizeWords($str)',
        regex: /function\s+capitalizeWords\s*\(/i,
        weight: 0.25
      },
      {
        id: 'uses_ucwords',
        label: 'Uses built-in ucwords() function',
        regex: /\bucwords\s*\(/i,
        weight: 0.45
      },
      {
        id: 'return_statement',
        label: 'Returns the capitalized string',
        regex: /\breturn\b/i,
        weight: 0.20
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

  // Q21 – PHP (Medium Code – in_array + conditional)
  {
    id: 21,
    topic: 'PHP',
    type: 'code',
    difficulty: 'medium',
    question: "Write a PHP function checkIfExists($haystack, $needle) that takes an array ($haystack) and a value ($needle), and returns true if the value is found in the array using PHP's in_array() function, or false otherwise.",
    placeholder: `function checkIfExists($haystack, $needle) {\n  // your code here\n}`,
    hints: [
      'Declare function checkIfExists($haystack, $needle)',
      'Use in_array($needle, $haystack) to check for the value',
      'Return the boolean result (true or false)'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function checkIfExists($haystack, $needle)',
        regex: /function\s+checkIfExists\s*\(\s*\$[a-zA-Z0-9_]+\s*,\s*\$[a-zA-Z0-9_]+\s*\)/i,
        weight: 0.25
      },
      {
        id: 'uses_in_array',
        label: 'Uses in_array() to search the array',
        regex: /\bin_array\s*\(/i,
        weight: 0.45
      },
      {
        id: 'return_statement',
        label: 'Returns a boolean result',
        regex: /\breturn\b/i,
        weight: 0.20
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

  // Q22 – PHP (Medium MCQ)
  {
    id: 22,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which PHP function removes duplicate values from an array and returns the result?',
    options: ['array_unique()', 'array_distinct()', 'array_filter()', 'array_diff()'],
    correctAnswer: 'array_unique()'
  },

  // Q23 – PHP (Easy MCQ)
  {
    id: 23,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In PHP, which function converts a string to all uppercase letters?',
    options: ['strtoupper()', 'uppercase()', 'str_upper()', 'toUpperCase()'],
    correctAnswer: 'strtoupper()'
  },

  // Q24 – PHP (Medium MCQ)
  {
    id: 24,
    topic: 'PHP',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In PHP, what is the correct way to check if a specific key exists in an associative array?',
    options: [
      'array_key_exists($key, $array)',
      'in_array($key, $array)',
      'isset($array->$key)',
      'key_exists($key, $array)'
    ],
    correctAnswer: 'array_key_exists($key, $array)'
  },

  // Q25 – PHP (Hard Code – array_unique + re-index)
  {
    id: 25,
    topic: 'PHP',
    type: 'code',
    difficulty: 'hard',
    question: 'Write a PHP function removeDuplicates($arr) that takes an array of values, removes duplicate entries using array_unique(), re-indexes the result using array_values(), and returns the cleaned array.',
    placeholder: `function removeDuplicates($arr) {\n  // your code here\n}`,
    hints: [
      'Declare function removeDuplicates($arr)',
      'Use array_unique($arr) to eliminate duplicates',
      'Use array_values() to re-index the resulting array',
      'Return the final array'
    ],
    gradingPatterns: [
      {
        id: 'function_declaration',
        label: 'Declares function removeDuplicates($arr)',
        regex: /function\s+removeDuplicates\s*\(/i,
        weight: 0.20
      },
      {
        id: 'uses_array_unique',
        label: 'Uses array_unique() to remove duplicates',
        regex: /\barray_unique\s*\(/i,
        weight: 0.35
      },
      {
        id: 'uses_array_values',
        label: 'Uses array_values() to re-index the array',
        regex: /\barray_values\s*\(/i,
        weight: 0.25
      },
      {
        id: 'return_statement',
        label: 'Returns the cleaned array',
        regex: /\breturn\b/i,
        weight: 0.20
      }
    ]
  },

  // Q26 – HTML (Medium MCQ)
  {
    id: 26,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML element defines a single row inside a table?',
    options: ['<tr>', '<td>', '<th>', '<row>'],
    correctAnswer: '<tr>'
  },

  // Q27 – HTML (Medium MCQ)
  {
    id: 27,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML attribute specifies the destination URL for an anchor (<a>) element?',
    options: ['href', 'src', 'url', 'link'],
    correctAnswer: 'href'
  },

  // Q28 – JS (Medium MCQ)
  {
    id: 28,
    topic: 'JS',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which JavaScript array method removes and returns the last element of an array?',
    options: ['array.pop()', 'array.push()', 'array.shift()', 'array.splice()'],
    correctAnswer: 'array.pop()'
  },

  // Q29 – CSS (Medium MCQ)
  {
    id: 29,
    topic: 'CSS',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which CSS property adds space outside the border of an element, separating it from neighbouring elements?',
    options: ['margin', 'padding', 'border-spacing', 'outline-offset'],
    correctAnswer: 'margin'
  },

  // Q30 – HTML (Medium MCQ)
  {
    id: 30,
    topic: 'HTML',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which HTML element is used to embed an image into a webpage?',
    options: ['<img>', '<image>', '<picture>', '<embed>'],
    correctAnswer: '<img>'
  }
];
