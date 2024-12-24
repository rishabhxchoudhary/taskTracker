// src/components/Tabs.tsx
import React from 'react';
import useTimerStore from '../../store/timerStore';


const Tabs: React.FC = () => {
  const { mode, setMode } = useTimerStore();

  const tabs = [
    { label: 'Work Time', value: 'work' },
    { label: 'Short Break', value: 'shortBreak' },
    { label: 'Long Break', value: 'longBreak' },
  ];

  return (
    <div className="flex justify-around mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 rounded ${
            mode === tab.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setMode(tab.value as 'work' | 'shortBreak' | 'longBreak')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
