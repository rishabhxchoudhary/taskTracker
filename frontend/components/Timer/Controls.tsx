import React from 'react';
import { Howl } from 'howler';
import useTimerStore from '../../store/timerStore';
import { Button } from '@nextui-org/react';

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
        <Button
          color="success"
          size='lg'
          onPress={handleStart}
        >
          Start
        </Button>
      ) : (
        <Button
          size='lg'
          color='warning'
          onPress={handlePause}
        >
          Pause
        </Button>
      )}
      <Button
        size='lg'
        color='danger'
        onPress={handleReset}
      >
        Reset
      </Button>
    </div>
  );
};

export default Controls;
