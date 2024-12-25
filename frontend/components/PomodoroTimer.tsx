// src/App.tsx
import React, { useEffect } from "react";
import Timer from "./Timer/Timer";
import Controls from "./Timer/Controls";
import { Tabs, Tab } from "@nextui-org/react";
import useTimerStore from "../store/timerStore";
import { getModeColor } from "../utils/utils";

const App: React.FC = () => {
  const { mode, setMode, pauseTimer } = useTimerStore();
  useEffect(() => {
    if ("Notification" in window) {
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission();
      }
    }
  }, []);

  const tabs = [
    {
      id: "work",
      label: "Pomodoro",
    },
    {
      id: "shortBreak",
      label: "Short Break",
    },
    {
      id: "longBreak",
      label: "Long Break",
    },
  ];

  return (
    <div id="timer" className="min-h-[70vh] flex flex-col items-center justify-center">
      <Tabs color={getModeColor(mode)} selectedKey={mode} 
      // @ts-expect-error " "
      onSelectionChange={(e)=>{setMode(e); pauseTimer()}} size="lg" aria-label="Dynamic tabs" variant="underlined" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Timer />
          </Tab>
        )}
      </Tabs>
      <Controls />
    </div>
  );
};

export default App;
