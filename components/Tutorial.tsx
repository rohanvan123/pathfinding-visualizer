import { TutorialSlide } from "@/types/types";
import React, { FC, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { PiDotOutlineLight, PiDotOutlineFill } from "react-icons/pi";
import BoldText from "./BoldText";

interface TutorialProps {
  handleClick: () => void;
  slides: TutorialSlide[];
}

const Tutorial: FC<TutorialProps> = ({ handleClick, slides }) => {
  const [slideIdx, setSlideIdx] = useState(0);

  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] flex justify-center items-center z-[10] text-black text-center ">
      <div className="bg-white rounded-[10px] p-[20px] w-[800px] h-[500px] flex flex-col border-black border-[3px] items-center">
        <span className="text-[30px] font-bold">{slides[slideIdx].title}</span>
        <span className="text-[18px] w-[80%] mt-[20px]">
          {slides[slideIdx].subheading}
        </span>
        {slides[slideIdx].img !== "" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={slides[slideIdx].imgStyling}
            src={slides[slideIdx].img}
            alt=""
          />
        ) : (
          <div className={slides[slideIdx].contentStyling}>
            <BoldText text={slides[slideIdx].content} />
          </div>
        )}
        <div className="tutorial-buttons">
          <button
            onClick={() => setSlideIdx(slideIdx - 1)}
            disabled={slideIdx === 0}
          >
            <GrPrevious size={50} />
          </button>
          <button
            onClick={() => setSlideIdx(slideIdx + 1)}
            disabled={slideIdx === slides.length - 1}
          >
            <GrNext size={50} />
          </button>
        </div>

        <div className="flex-grow"></div>

        <div>
          <div className="flex flex-row justify-center mb-[10px]">
            {Array(slides.length)
              .fill(null)
              .map((_, idx: number) =>
                idx === slideIdx ? (
                  <PiDotOutlineFill key={idx} size={40} />
                ) : (
                  <PiDotOutlineLight key={idx} size={40} />
                )
              )}
          </div>
          <button
            onClick={handleClick}
            className="h-[40px] w-[120px] rounded-[8px] bg-green-500 text-white border-[1px] border-green-700"
          >
            {slideIdx === slides.length - 1 ? "Close" : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
