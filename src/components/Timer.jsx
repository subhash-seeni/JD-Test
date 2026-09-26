import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ durationSeconds, onTimeUp, isActive = true }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft, onTimeUp]);

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
