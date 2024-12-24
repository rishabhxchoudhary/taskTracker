import React, { useEffect, useRef } from 'react';
import useTimerStore from '../../store/timerStore';
import { Howl } from 'howler';

const alertSound = new Howl({
  src: ['/sounds/alert.mp3'],
  volume: 0.5, // Adjust volume as needed
});


const Timer: React.FC = () => {
  const { timeLeft, isRunning, decrementTime, mode, setMode, incrementCycle, cycle } = useTimerStore();
    //   @ts-expect-error "nodejs not found."
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    } else if (timeLeft === 0) {
      alertSound.play();
      if (Notification.permission === 'granted') {
        new Notification(`Time for ${mode === 'work' ? 'a break!' : 'work!'}`);
      }
      if (mode === 'work') {
        if ((cycle + 1) % 2 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        setMode('work');
        if (mode === 'shortBreak') {
          incrementCycle();
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, mode, decrementTime, setMode, incrementCycle, cycle]);

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