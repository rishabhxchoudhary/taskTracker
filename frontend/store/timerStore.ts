// src/store/useTimerStore.ts

import { create } from 'zustand';

import TimerWorker from '../utils/timerWorker?worker';
import { TimerState } from '../types/types';

const useTimerStore = create<TimerState>((set, get) => {
      // Initialize the worker
      const worker = new TimerWorker();

      // Listen for messages from the worker
      worker.addEventListener('message', (e: MessageEvent) => {
        const { type, timeLeft } = e.data;

        if (type === 'tick') {
          set({ timeLeft });
        } else if (type === 'finished') {
          set({ isRunning: false, timeLeft: 0 });
          // Handle mode switching and cycle increment here or in React component
          // You might want to emit an event or call a callback
        } else if (type === 'reset') {
          set({ timeLeft });
        }
      });

      return {
        mode: 'work',
        timeLeft: 25 * 60,
        isRunning: false,
        maxTime: 25 * 60,
        cycle: 0,
        worker, // Expose the worker if needed
        setMode: (mode) => {
          const newTime =
            mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
          set({
            mode,
            timeLeft: newTime,
            maxTime: newTime,
          });
          // Reset the worker's timer
          get().worker.postMessage({ command: 'reset', payload: { timeLeft: newTime } });
        },
        startTimer: () => {
          set({ isRunning: true });
          get().worker.postMessage({ command: 'start' });
        },
        pauseTimer: () => {
          set({ isRunning: false });
          get().worker.postMessage({ command: 'stop' });
        },
        setCycle: (cycle: number) => set({ cycle }),
        incrementCycle: () => set((state) => ({ cycle: state.cycle + 1 })),
        resetTimer: () => {
          const { maxTime } = get();
          set({
            timeLeft: maxTime,
            isRunning: false,
          });
          get().worker.postMessage({ command: 'reset', payload: { timeLeft: maxTime } });
        },
        setTimeLeft: (time: number) => set({ timeLeft: time }),
        decrementTime: () => {
          // Not needed anymore as the worker handles time decrement
        },
      };
    }
);

export default useTimerStore;
