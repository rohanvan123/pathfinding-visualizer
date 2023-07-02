import React from "react";
import Node from "./Node";

interface Node {
  row: number;
  col: number;
  color: string;
}

let grid: Node[][] = [];

for (let r = 0; r < 10; r++) {
  let row: Node[] = [];
  for (let c = 0; c < 10; c++) {
    const n: Node = {
      row: r,
      col: c,
      color: "white",
    };
    row.push(n);
  }
  grid.push(row);
}

const PathfindingVisualizer = () => {
  grid[5][5].color = "green-300";
  return (
    <div className="m-auto mt-[50px] w-[400px] h-[400px] border-green-300 border-[1px] grid grid-cols-10">
      {grid.map((row, rowIdx) => {
        return row.map((node, colIdx) => (
          <button
            key={`${rowIdx}-${colIdx}`}
            className={`h-[40px] w-[40px] border-black border-[1px] border-solid p-[0px] bg-${node.color}`}
          ></button>
        ));
      })}
    </div>
  );
};

export default PathfindingVisualizer;
