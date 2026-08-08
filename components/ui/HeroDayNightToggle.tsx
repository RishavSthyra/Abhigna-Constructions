"use client";

import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";


type Time = 'Day' | 'Night'

interface Proptypes {
  position: "top" | "bottom" | "left" | "right";
  time: Time;
setTime: React.Dispatch<React.SetStateAction<Time>>;
}

export default function DayNightToggle({ position, time, setTime }: Proptypes) {

  const isVertical = position === "left" || position === "right";

  const positionClasses = {
    top: "absolute top-6 left-1/2 -translate-x-1/2",
    bottom: "absolute bottom-6 left-1/2 -translate-x-1/2",
    left: "absolute left-6 top-1/2 -translate-y-1/2",
    right: "absolute right-6 top-1/2 -translate-y-1/2",
  };


  const HandleToggle = () => { 
        setTime((previousTime)=> previousTime === 'Night' ? 'Day' : 'Night')
  }

  return (
    <button type="button" onClick={HandleToggle} aria-label={time === 'Night' ? "Switch to day mode" : "Switch to night mode"} className={`${positionClasses[position]} z-50 flex items-center rounded-full border border-white/30 bg-white/15 p-1 backdrop-blur-xl transition-all duration-500 hover:border-white/50 hover:bg-white/20 focus:outline-none ${isVertical ? "h-[104px] w-12 flex-col" : "h-12 w-[104px] flex-row"}`}>
      <span className={`absolute left-1 top-1 h-10 w-10 rounded-full border border-white/40 bg-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${time === 'Night' ? isVertical ? "translate-y-[54px]" : "translate-x-[54px]" : "translate-x-0 translate-y-0"}`} />

      <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center transition-all duration-500 ${time === 'Night' ? "scale-90 text-white/40" : "scale-100 text-amber-200"}`}>
        <FiSun size={19} strokeWidth={1.7} />
      </span>

      <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center transition-all duration-500 ${isVertical ? "mt-auto" : "ml-auto"} ${time === 'Night' ? "scale-100 text-blue-100" : "scale-90 text-white/40"}`}>
        <FiMoon size={18} strokeWidth={1.7} />
      </span>
    </button>
  );
}