import { create } from 'zustand';
import { TimerState } from '../types/types';
import { persist } from 'zustand/middleware';

const useTimerStore = create(persist<TimerState>(
    (set) => ({
  mode: 'work',
  timeLeft: 25 * 60,
  isRunning: false,
  cycle: 0,
  setMode: (mode) => set(() => ({
    mode,
    timeLeft: mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60,
  })),
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set((state) => ({
    timeLeft: state.mode === 'work' ? 25 * 60 : state.mode === 'shortBreak' ? 5 * 60 : 15 * 60,
    isRunning: false,
  })),
  decrementTime: () => set((state) => ({ timeLeft: state.timeLeft - 1 })),
  incrementCycle: () => set((state) => ({ cycle: state.cycle + 1 })),
  setTimeLeft: (time) => set({ timeLeft: time }),
}),{
    name: 'timer-storage',
}))

export default useTimerStore;

