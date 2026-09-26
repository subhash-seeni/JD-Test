import React from 'react';
import { ShieldAlert, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || ''}`}>
          {toast.type === 'warning' ? (
            <ShieldAlert size={16} />
          ) : toast.type === 'error' ? (
            <AlertCircle size={16} />
          ) : (
            <Info size={16} />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
