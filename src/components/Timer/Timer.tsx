import React from 'react';

interface ITimerOverlayProps {
  timerDuration: number;
}

function TimerOverlay(props: ITimerOverlayProps) {
  const { timerDuration } = props;
  const seconds = timerDuration;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

  return <div className="camera__timer">{formattedTime}</div>;
}

export default TimerOverlay;
