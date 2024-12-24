// src/App.tsx
import React, { useEffect } from 'react';
import Timer from './Timer/Timer';
import Controls from './Timer/Controls';
import Tabs from './Timer/Tabs';

const App: React.FC = () => {
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className=" p-8 rounded shadow-md w-full max-w-md">
        <Tabs />
        <Timer />
        <Controls />
      </div>
    </div>
  );
};

export default App;
