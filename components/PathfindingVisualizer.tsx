"use client";

import React, { useEffect, useState } from "react";
import Queue from "../types/Queue";
import { Tuple, Node } from "@/types/types";
import { stringToTuple, tupleToString } from "@/utils/utils";

const MAX_TARGET_NODES = 1;
const BOX_WIDTH = 40;
const ROWS = 15;
const COLS = 40;

const intializeGrid = (maxRows: number, maxCols: number) => {
  let initialGrid: Node[][] = [];

  for (let r = 0; r < maxRows; r++) {
    let row: Node[] = [];
    for (let c = 0; c < maxCols; c++) {
      const n: Node = {
        row: r,
        col: c,
        color: "white",
      };
      row.push(n);
    }
    initialGrid.push(row);
  }

  return initialGrid;
};

const PathfindingVisualizer = () => {
  const resetGrid = () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        updateNodeColor(r, c, "white");
      }
    }
    setCurrentTargetNodes(0);
  };

  const [grid, setGrid] = useState(intializeGrid(ROWS, COLS));
  const [currentTargetNodes, setCurrentTargetNodes] = useState(0);
  const [isSettingTarget, setIsSettingTarget] = useState(false);

  const updateNodeColor = (row: number, col: number, color: string) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col].color = color;
      return newGrid;
    });
  };

  const bfs = (row: number, col: number) => {
    const parent = new Map<string, string>();
    const queue = new Queue();
    queue.enqueue([row, col]);
    const visited = new Set();
    parent.set(tupleToString([row, col]), tupleToString([-1, -1]));

    const processNextNode = () => {
      if (queue.isEmpty()) {
        return;
      }

      const [r, c] = queue.dequeue()!;
      console.log([r, c]);

      const nodeKey = JSON.stringify([r, c]);
      if (visited.has(nodeKey)) {
        processNextNode();
        return;
      } else if (grid[r][c].color === "yellow") {
        // Target node found
        tracePath(r, c, parent);
        return;
      }
      visited.add(nodeKey);

      updateNodeColor(r, c, "#50C878");
      if (r + 1 < ROWS) {
        if (!visited.has(tupleToString([r + 1, c]))) {
          parent.set(tupleToString([r + 1, c]), tupleToString([r, c]));
        }
        queue.enqueue([r + 1, c]);
      }
      if (r - 1 >= 0) {
        if (!visited.has(tupleToString([r - 1, c]))) {
          parent.set(tupleToString([r - 1, c]), tupleToString([r, c]));
        }
        queue.enqueue([r - 1, c]);
      }
      if (c + 1 < COLS) {
        if (!visited.has(tupleToString([r, c + 1]))) {
          parent.set(tupleToString([r, c + 1]), tupleToString([r, c]));
        }
        queue.enqueue([r, c + 1]);
      }
      if (c - 1 >= 0) {
        if (!visited.has(tupleToString([r, c - 1]))) {
          parent.set(tupleToString([r, c - 1]), tupleToString([r, c]));
        }
        queue.enqueue([r, c - 1]);
      }
      setTimeout(processNextNode, 5);
    };

    processNextNode();
  };

  const tracePath = (row: number, col: number, parent: Map<string, string>) => {
    const path: Tuple[] = [];
    while (parent.get(tupleToString([row, col])) !== tupleToString([-1, -1])) {
      [row, col] = stringToTuple(parent.get(tupleToString([row, col]))!);
      path.push([row, col]);
    }
    path.reverse();

    const processNextPathNode = (idx: number) => {
      if (idx < path.length) {
        const [r, c]: Tuple = path[idx];
        updateNodeColor(r, c, "red");
        setTimeout(() => processNextPathNode(idx + 1), 30);
      } else {
        return;
      }
    };
    processNextPathNode(0);
  };

  const handleNodeClick = (rowIdx: number, colIdx: number) => {
    if (isSettingTarget) {
      if (currentTargetNodes < MAX_TARGET_NODES) {
        updateNodeColor(rowIdx, colIdx, "yellow");
        setCurrentTargetNodes(currentTargetNodes + 1);
      }
    } else {
      bfs(rowIdx, colIdx);
    }
  };

  const handleTargetButtonClick = () => {
    if (currentTargetNodes === MAX_TARGET_NODES) {
      setIsSettingTarget(false);
      return;
    }
    setIsSettingTarget(true);
  };

  useEffect(() => {
    if (currentTargetNodes === MAX_TARGET_NODES) {
      setIsSettingTarget(false);
    }
  }, [currentTargetNodes]);

  return (
    <div className="flex flex-col justify-center items-center w-full pt-[200px] pb-[100px] bg-blue-300">
      <div
        className={`m-auto w-[${BOX_WIDTH * COLS}px] h-[${
          BOX_WIDTH * ROWS
        }px] grid grid-cols-${COLS}`}
        style={{ gridTemplateColumns: `repeat(${COLS}, ${BOX_WIDTH}px)` }}
      >
        {grid.map((row, rowIdx) => {
          return row.map((node, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              className={`h-[${BOX_WIDTH}px] w-[${BOX_WIDTH}px] border-black border-[1px] border-solid p-[0px]`}
              style={{ backgroundColor: node.color }}
              onClick={() => {
                handleNodeClick(rowIdx, colIdx);
              }}
            ></button>
          ));
        })}
      </div>
      <div className="flex flex-row gap-[20px]">
        <button
          className="mt-[50px] h-[40px] w-[100px] text-center border-black border-[1px] rounded-[8px] hover:bg-slate-300 bg-white"
          onClick={resetGrid}
        >
          Reset
        </button>
        <button
          className={`bg-white mt-[50px] h-[40px] w-[100px] text-center border-black border-[1px] rounded-[8px] hover:bg-slate-300 ${
            isSettingTarget ? "bg-slate-300" : ""
          }`}
          onClick={handleTargetButtonClick}
          disabled={currentTargetNodes === MAX_TARGET_NODES}
        >
          Set Target
        </button>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
