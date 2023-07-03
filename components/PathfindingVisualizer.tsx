"use client";

import React, { useContext, useEffect, useState } from "react";
import Queue from "../types/Queue";
import { Tuple, Node, FunctionMap } from "@/types/types";
import { getRandomInt, stringToTuple, tupleToString } from "@/utils/utils";
import Stack from "@/types/Stack";
import AlgorithmContext from "@/context/AlgorithmContext";
import { visualizations } from "@/data/visualizations";

/* GRID SETTINGS */
const MAX_TARGET_NODES = 1;
const BOX_WIDTH = 40;
const ROWS = 15;
const COLS = 30;

/* COLOR SETTINGS */
const defaultColor = "white";
const fillColor = "#50C878";
const pathColor = "red";
const targetColor = "yellow";
const wallColor = "black";

/* ANIMATION SETTINGS */
const fillTimeDelay = 5;
const pathTimeDelay = 30;
const minWeight = 0;
const maxWeight = 10;

const intializeGrid = (maxRows: number, maxCols: number) => {
  let initialGrid: Node[][] = [];

  for (let r = 0; r < maxRows; r++) {
    let row: Node[] = [];
    for (let c = 0; c < maxCols; c++) {
      const n: Node = {
        row: r,
        col: c,
        color: defaultColor,
        weight: 0,
      };
      row.push(n);
    }
    initialGrid.push(row);
  }

  return initialGrid;
};

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState(intializeGrid(ROWS, COLS));
  const [currentTargetNodes, setCurrentTargetNodes] = useState(0);
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [showWeights, setShowWeights] = useState(false);
  const { selectedAlgorithm, setSelectedAlgorithm } =
    useContext(AlgorithmContext)!;

  const resetGrid = () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        updateNodeColor(r, c, defaultColor);
        grid[r][c].weight = getRandomInt(minWeight, maxWeight);
      }
    }
    setCurrentTargetNodes(0);
  };

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

      const nodeKey = JSON.stringify([r, c]);
      if (visited.has(nodeKey)) {
        processNextNode();
        return;
      } else if (grid[r][c].color === targetColor) {
        // Target node found
        tracePath(r, c, parent);
        return;
      }
      visited.add(nodeKey);

      updateNodeColor(r, c, fillColor);
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
      setTimeout(processNextNode, fillTimeDelay);
    };

    processNextNode();
  };

  const dfs = (row: number, col: number) => {
    const parent = new Map<string, string>();
    const stack = new Stack();
    stack.push([row, col]);
    const visited = new Set();
    parent.set(tupleToString([row, col]), tupleToString([-1, -1]));

    const processNextNode = () => {
      if (stack.isEmpty()) {
        return;
      }

      const [r, c] = stack.pop()!;

      const nodeKey = JSON.stringify([r, c]);
      if (visited.has(nodeKey)) {
        processNextNode();
        return;
      } else if (grid[r][c].color === targetColor) {
        // Target node found
        tracePath(r, c, parent);
        return;
      }
      visited.add(nodeKey);

      updateNodeColor(r, c, fillColor);
      if (c - 1 >= 0) {
        if (!visited.has(tupleToString([r, c - 1]))) {
          parent.set(tupleToString([r, c - 1]), tupleToString([r, c]));
        }
        stack.push([r, c - 1]);
      }
      if (r + 1 < ROWS) {
        if (!visited.has(tupleToString([r + 1, c]))) {
          parent.set(tupleToString([r + 1, c]), tupleToString([r, c]));
        }
        stack.push([r + 1, c]);
      }
      if (c + 1 < COLS) {
        if (!visited.has(tupleToString([r, c + 1]))) {
          parent.set(tupleToString([r, c + 1]), tupleToString([r, c]));
        }
        stack.push([r, c + 1]);
      }
      if (r - 1 >= 0) {
        if (!visited.has(tupleToString([r - 1, c]))) {
          parent.set(tupleToString([r - 1, c]), tupleToString([r, c]));
        }
        stack.push([r - 1, c]);
      }

      setTimeout(processNextNode, fillTimeDelay);
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
        updateNodeColor(r, c, pathColor);
        setTimeout(() => processNextPathNode(idx + 1), pathTimeDelay);
      } else {
        return;
      }
    };
    processNextPathNode(0);
  };

  /* FunctionMap for names to functions */
  const functionMap: FunctionMap = {};
  functionMap[visualizations[0]] = bfs;
  functionMap[visualizations[1]] = dfs;
  functionMap[visualizations[2]] = bfs;

  const handleNodeClick = (rowIdx: number, colIdx: number) => {
    if (isSettingTarget) {
      if (currentTargetNodes < MAX_TARGET_NODES) {
        updateNodeColor(rowIdx, colIdx, targetColor);
        setCurrentTargetNodes(currentTargetNodes + 1);
      }
    } else {
      functionMap[selectedAlgorithm](rowIdx, colIdx);
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

  /* Needed for server side rendering */
  useEffect(() => {
    const randomizeWeights = () => {
      const updatedGrid = grid.map((row) =>
        row.map((node) => ({
          ...node,
          weight: getRandomInt(minWeight, maxWeight),
        }))
      );
      setGrid(updatedGrid);
    };

    randomizeWeights();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full pt-[200px] pb-[100px] bg-gradient-to-b from-green-200 to-blue-300">
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
            >
              {showWeights ? node.weight : ""}
            </button>
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
