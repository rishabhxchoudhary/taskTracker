// src/workers/timerWorker.ts

// Listen for messages from the main thread
self.addEventListener('message', (e) => {
    const { command, payload } = e.data;
  
    switch (command) {
      case 'start':
        startTimer();
        break;
      case 'stop':
        stopTimer();
        break;
      case 'reset':
        resetTimer(payload);
        break;
      default:
        break;
    }
  });
  
  let interval: number | null = null;
  let currentTime: number = 0;
  
  // Function to start the timer
  function startTimer() {
    if (interval === null) {
      interval = setInterval(() => {
        currentTime -= 1;
        self.postMessage({ type: 'tick', timeLeft: currentTime });
  
        if (currentTime <= 0) {
          stopTimer();
          self.postMessage({ type: 'finished' });
        }
      }, 1000);
    }
  }
  
  // Function to stop the timer
  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }
  
  // Function to reset the timer
  function resetTimer(payload: { timeLeft: number }) {
    currentTime = payload.timeLeft;
    self.postMessage({ type: 'reset', timeLeft: currentTime });
  }
  