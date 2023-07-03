import React, { FC } from "react";

interface LegendKeyProps {
  color: string;
  label: string;
}

const LegendKey: FC<LegendKeyProps> = ({ color, label }) => {
  return (
    <div className="flex flex-row">
      <div className={`w-[30px] h-[30px]`} style={{ backgroundColor: color }} />
      <span className="text-white text-[20px] ml-[12px]">{label}</span>
    </div>
  );
};

export default LegendKey;
