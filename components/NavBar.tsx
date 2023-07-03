"use client";

import AlgorithmContext from "@/context/AlgorithmContext";
import { visualizations } from "@/data/visualizations";
import React, { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedAlgorithm, setSelectedAlgorithm } =
    useContext(AlgorithmContext)!;

  const handleTogleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedAlgorithm(option);
    setIsOpen(false);
  };

  return (
    <div
      className="w-full h-[100px] flex flex-row justify-evenly gap-[60%] items-center border-b-[3px] 
    border-green-700 bg-green-500 fixed top-0 z-50"
    >
      <div className="text-[30px] [text-shadow:_4px_4px_0_rgb(0_0_0_/_15%)] text-white">
        Path Algorithms Visualizer
      </div>
      <div className="relative inline-block w-[180px] text-[15px]">
        <button
          className="h-[100px] w-full rounded-[8px] text-white text-[17px] bg-green-700 text-left"
          onClick={handleTogleDropdown}
        >
          <div className="flex flex-row justify-between ">
            <span className="ml-[10px]">Algorithm</span>
            <FaChevronDown
              className={`mt-[5px] mr-[10px] dropdown-icon ${
                isOpen ? "rotated" : ""
              }`}
            />
          </div>
        </button>
        {isOpen && (
          <ul className="text-back rounded-[8px] absolute w-full bg-slate-600 text-white mt-[5px]">
            {visualizations.map((name: string, idx: number) => {
              return (
                <li key={idx} className="items-center">
                  <button
                    type="button"
                    className={`hover:bg-green-600 text-left h-[50px] w-full rounded-[8px] ${
                      selectedAlgorithm === visualizations[idx]
                        ? "bg-green-600"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(visualizations[idx])}
                  >
                    <span className="ml-[10px]">{name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavBar;
