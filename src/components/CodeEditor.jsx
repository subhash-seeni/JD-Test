import React from 'react';
import { RotateCcw, Terminal, Lightbulb } from 'lucide-react';

export default function CodeEditor({ question, value, onChange, onReset }) {
  // Support tab key indentation in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const getLanguageLabel = (topic) => {
    switch (topic) {
      case 'JS': return 'JavaScript (ES6+)';
      case 'CSS': return 'CSS3';
      case 'PHP': return 'PHP 8+';
      default: return 'Code';
    }
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-wrap">
        <div className="code-editor-header">
          <div className="code-editor-title">
            <Terminal size={14} />
            <span>{getLanguageLabel(question.topic)} Editor</span>
          </div>
          <div className="code-editor-actions">
            <button
              type="button"
              className="btn-editor-action"
              onClick={onReset}
              title="Reset code to initial template"
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Reset Code
            </button>
          </div>
        </div>

        <textarea
          className="code-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={question.placeholder || '// Enter your solution here'}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          rows={10}
        />
      </div>

      {/* Helpful context & requirements for the candidate */}
      <div className="code-hints">
        <div className="code-hints-title">
          <Lightbulb size={15} />
          <span>Evaluation Criteria & Instructions</span>
        </div>
        {question.hints && Array.isArray(question.hints) ? (
          <ul>
            {question.hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        ) : question.topic === 'JS' && question.testCases ? (
          <ul>
            <li>Your function should handle all standard inputs and edge cases.</li>
            <li>Sample tests: {question.testCases.slice(0, 3).map(tc => tc.label).join(', ')}</li>
            <li>Code is executed in a sandboxed runtime against isolated test suites.</li>
          </ul>
        ) : question.topic === 'CSS' ? (
          <ul>
            <li>Target selector: <code>.container</code></li>
            <li>Use Flexbox properties to achieve equal item distribution along a row.</li>
            <li>Computed element layout is evaluated upon submission.</li>
          </ul>
        ) : question.topic === 'PHP' ? (
          <ul>
            <li>Define the function with proper arguments and return statement.</li>
            <li>Auto-graded via structural and pattern evaluation.</li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}
