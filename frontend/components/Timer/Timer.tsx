import React from 'react';
import useTimerStore from '../../store/timerStore';




const Timer: React.FC = () => {
  const { timeLeft, mode } = useTimerStore();
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold capitalize">{mode.replace(/([A-Z])/g, ' $1')}</h2>
      <p className="text-6xl font-mono">{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;