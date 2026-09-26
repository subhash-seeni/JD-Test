import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';

export default function SkipConfirmModal({ isOpen, onCancel, onConfirm, questionNumber }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon-wrap">
            <AlertTriangle size={20} />
          </div>
          <h2 className="modal-title">Skip Question {questionNumber}?</h2>
        </div>
        <div className="modal-body">
          You haven't entered an answer for this question yet. If you skip, this question will receive zero points.
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Continue Answering
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Skip Question
          </button>
        </div>
      </div>
    </div>
  );
}
