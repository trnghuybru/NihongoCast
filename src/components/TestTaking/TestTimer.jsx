"use client";

import { useState, useEffect } from "react";

const TestTimer = ({ initialTime, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining < 60) {
      // Less than 1 minute
      return "text-red-600";
    } else if (timeRemaining < 300) {
      // Less than 5 minutes
      return "text-orange-500";
    } else {
      return "text-green-600";
    }
  };

  return <div className={`font-mono text-xl font-bold ${getTimerColor()}`}>{formatTime(timeRemaining)}</div>;
};

export default TestTimer;
