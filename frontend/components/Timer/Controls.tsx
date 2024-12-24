import React from 'react';
import { Howl } from 'howler';
import useTimerStore from '../../store/timerStore';

const buttonSound = new Howl({
  src: ['/sounds/button.wav'],
  volume: 0.5, 
});

const Controls: React.FC = () => {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimerStore();

  const handleStart = () => {
    startTimer();
    stopAllSounds();
    buttonSound.play();
  };

  const handlePause = () => {
    pauseTimer();
    stopAllSounds();
    buttonSound.play();
  };

  const handleReset = () => {
    resetTimer();
    stopAllSounds();
    buttonSound.play();
  };

  const stopAllSounds = () => {
    Howler.stop();
  };

  return (
    <div className="flex justify-center mt-4 space-x-4">
      {!isRunning ? (
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleStart}
        >
          Start
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={handlePause}
        >
          Pause
        </button>
      )}
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
