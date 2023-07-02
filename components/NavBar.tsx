import React from "react";

const visualizations = [
  "Algorithms",
  "Breadth First Search",
  "Depth First Search",
  "Dijkstra's",
];

const NavBar = () => {
  return (
    <div
      className="w-full h-[100px] flex flex-row justify-evenly gap-[60%] items-center border-b-[3px] 
    border-purple-700 bg-purple-300 fixed top-0 z-50"
    >
      <div className="text-[30px] [text-shadow:_4px_4px_0_rgb(0_0_0_/_15%)] text-white">
        Path Algorithms Visualizer
      </div>
      <select className="h-[40px] rounded-[15px] bg-purple-700 text-white text-[20px]">
        {visualizations.map((name: string, idx: number) => {
          return (
            <option key={idx} value={name} className="">
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default NavBar;
