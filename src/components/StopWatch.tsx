import React, { useState, useEffect } from 'react';

interface StopwatchProps {
  start: boolean;
  stop: boolean;
  stopLimit: number;
  stopFunc(): void;
}

const Stopwatch: React.FC<StopwatchProps> = ({
  start,
  stop,
  stopLimit,
  stopFunc,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number = 0;
    if (seconds >= 60) {
      setMinutes(minutes + 1);
      setSeconds(0);
    }
    if (minutes >= stopLimit) {
      clearInterval(interval);
      setIsRunning(false);
      stopFunc();
    } else {
      if (isRunning) {
        interval = window.setInterval(() => {
          setSeconds((seconds) => seconds + 1);
        }, 1000);
      }
    }
    return () => window.clearInterval(interval);
  }, [minutes, seconds, isRunning]);

  useEffect(() => {
    if (start) {
      setIsRunning(true);
    }
  }, [start]);

  useEffect(() => {
    if (stop) {
      setIsRunning(false);
      setMinutes(0);
      setSeconds(0);
    }
  }, [stop]);

  return (
    <div className='stopwatch-container'>
      <span className='time'>
        {minutes}:{seconds}
      </span>
      <span className='text'>Time</span>
    </div>
  );
};

export default Stopwatch;
