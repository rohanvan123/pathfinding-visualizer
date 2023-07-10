import React, { FC } from "react";

interface BoldTextProps {
  text: string;
}
const BoldText: FC<BoldTextProps> = ({ text }) => {
  const parts = text.split("**");

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        } else {
          return <strong key={index}>{part}</strong>;
        }
      })}
    </>
  );
};

export default BoldText;
