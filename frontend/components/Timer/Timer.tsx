// import React from "react";
import {
  CircularProgress,
} from "@nextui-org/react";
import useTimerStore from "../../store/timerStore";
import { getModeColor } from "../../utils/utils";

const Timer = () => {
  const { mode, timeLeft, maxTime } = useTimerStore();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div>
      <CircularProgress
        aria-label="Timer Progress"
        color={getModeColor(mode)}
        classNames={{
          svg: "w-80 h-80 drop-shadow-md m-10",
          track: `stroke-white/10`,
          value: `text-3xl text-${getModeColor(mode)} font-semibold drop-shadow-md`,
        }}
        showValueLabel={true}
        strokeWidth={1}
        value={(timeLeft/maxTime)*100}
        valueLabel={formatTime(timeLeft)}
      />
    </div>
  );
};

export default Timer;