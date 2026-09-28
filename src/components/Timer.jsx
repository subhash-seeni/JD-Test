import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ durationSeconds, onTimeUp, isActive = true }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const hasTriggeredRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep latest onTimeUp callback in ref without restarting the timer
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset when durationSeconds changes
  useEffect(() => {
    setTimeLeft(durationSeconds);
    hasTriggeredRef.current = false;
  }, [durationSeconds]);

  useEffect(() => {
    if (!isActive) return;

    // Guard if already expired at start
    if (timeLeft <= 0) {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onTimeUpRef.current?.();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            // Defer invocation out of the render loop
            setTimeout(() => {
              onTimeUpRef.current?.();
            }, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive]); // Only react to active state changes, not timeLeft or onTimeUp

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isDanger = timeLeft <= 60;
  const isWarning = timeLeft <= 300 && !isDanger;

  return (
    <div
      className={`timer-pill ${isDanger ? 'danger' : isWarning ? 'warning' : ''}`}
      title="Remaining Test Time"
    >
      <Clock size={15} />
      <span>{formattedTime}</span>
    </div>
  );
}
