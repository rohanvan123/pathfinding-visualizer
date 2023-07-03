import React from "react";
import LegendKey from "./LegendKey";
import {
  defaultColor,
  fillColor,
  pathColor,
  startColor,
  targetColor,
} from "@/styles/colors";

const Legend = () => {
  return (
    <div className="w-[800px] h-[80px] flex flex-row justify-evenly">
      <LegendKey color={defaultColor} label="Unvisited" />
      <LegendKey color={fillColor} label="Visited" />
      <LegendKey color={startColor} label="Start" />
      <LegendKey color={targetColor} label="Target" />
      <LegendKey color={pathColor} label="Path" />
    </div>
  );
};

export default Legend;
