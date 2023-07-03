"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Queue from "../types/Queue";
import { Tuple, FunctionMap } from "@/types/types";
import {
  calcWeight,
  getRandomInt,
  hueristicEstimate,
  initalizeSSSP,
  intializeGrid,
  stringToTuple,
  tupleToString,
} from "@/utils/utils";
import Stack from "@/types/Stack";
import AlgorithmContext from "@/context/AlgorithmContext";
import { visualizations } from "@/data/visualizations";
import Heap from "@/types/Heap";

/* GRID SETTINGS */
const MAX_TARGET_NODES = 1;
const BOX_WIDTH = 40;
const ROWS = 15;
const COLS = 30;

/* COLOR SETTINGS */
const defaultColor = "white";
const fillColor = "#50C878";
const pathColor = "red";
const startColor = "red";
const targetColor = "yellow";
const wallColor = "black";

/* ANIMATION SETTINGS */
const fillTimeDelay = 5;
const pathTimeDelay = 30;
const minWeight = 0;
const maxWeight = 10;

const defaultButtonStyle =
  "mt-[50px] h-[50px] w-[150px] text-center border-[#50C878] border-[5px] rounded-[8px] hover:bg-[#50C878] text-white setting-button";

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState(intializeGrid(ROWS, COLS, defaultColor));
  const [currentTargetNodes, setCurrentTargetNodes] = useState(0);
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [targetNode, setTargetNode] = useState<Tuple>([0, 0]);
  const [showWeights, setShowWeights] = useState(false);
  const { selectedAlgorithm, setSelectedAlgorithm } =
    useContext(AlgorithmContext)!;

  const resetGrid = () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        updateNodeColor(r, c, defaultColor);
        grid[r][c].weight = showWeights
          ? getRandomInt(minWeight, maxWeight)
          : 0;
      }
    }
    setCurrentTargetNodes(0);
    setTargetNode([0, 0]);
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

      if (r === row && c === col) {
        updateNodeColor(r, c, startColor);
      } else {
        updateNodeColor(r, c, fillColor);
      }

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

  const dijkstras = (row: number, col: number) => {
    if (!showWeights) {
      return bfs(row, col);
    }

    const dist: number[][] = initalizeSSSP(ROWS, COLS);
    const parent = new Map<string, string>();
    const heap = new Heap();
    const visited = new Set();

    parent.set(tupleToString([row, col]), tupleToString([-1, -1]));
    heap.insert([[row, col], 0]);
    dist[row][col] = 0;

    const processNextNode = () => {
      if (heap.isEmpty()) {
        return;
      }

      const [r, c] = heap.deleteMin()!;

      if (grid[r][c].color === targetColor) {
        // Target node found
        tracePath(r, c, parent);
        return;
      }

      const nodeKey = tupleToString([r, c]);
      visited.add(nodeKey);

      updateNodeColor(r, c, fillColor);
      if (r + 1 < ROWS && !visited.has(tupleToString([r + 1, c]))) {
        if (
          calcWeight(grid[r][c], grid[r + 1][c]) + dist[r][c] <
          dist[r + 1][c]
        ) {
          dist[r + 1][c] = dist[r][c] + calcWeight(grid[r][c], grid[r + 1][c]);
          parent.set(tupleToString([r + 1, c]), tupleToString([r, c]));
        }
        if (heap.contains([r + 1, c])) {
          heap.decreaseKey([r + 1, c], dist[r + 1][c]);
        } else {
          heap.insert([[r + 1, c], dist[r + 1][c]]);
        }
      }
      if (r - 1 >= 0 && !visited.has(tupleToString([r - 1, c]))) {
        if (
          calcWeight(grid[r][c], grid[r - 1][c]) + dist[r][c] <
          dist[r - 1][c]
        ) {
          dist[r - 1][c] = dist[r][c] + calcWeight(grid[r][c], grid[r - 1][c]);
          parent.set(tupleToString([r - 1, c]), tupleToString([r, c]));
        }
        if (heap.contains([r - 1, c])) {
          heap.decreaseKey([r - 1, c], dist[r - 1][c]);
        } else {
          heap.insert([[r - 1, c], dist[r - 1][c]]);
        }
      }
      if (c + 1 < COLS && !visited.has(tupleToString([r, c + 1]))) {
        if (
          calcWeight(grid[r][c], grid[r][c + 1]) + dist[r][c] <
          dist[r][c + 1]
        ) {
          dist[r][c + 1] = dist[r][c] + calcWeight(grid[r][c], grid[r][c + 1]);
          parent.set(tupleToString([r, c + 1]), tupleToString([r, c]));
        }
        if (heap.contains([r, c + 1])) {
          heap.decreaseKey([r, c + 1], dist[r][c + 1]);
        } else {
          heap.insert([[r, c + 1], dist[r][c + 1]]);
        }
      }
      if (c - 1 >= 0 && !visited.has(tupleToString([r, c - 1]))) {
        if (
          calcWeight(grid[r][c], grid[r][c - 1]) + dist[r][c] <
          dist[r][c - 1]
        ) {
          dist[r][c - 1] = dist[r][c] + calcWeight(grid[r][c], grid[r][c - 1]);
          parent.set(tupleToString([r, c - 1]), tupleToString([r, c]));
        }
        if (heap.contains([r, c - 1])) {
          heap.decreaseKey([r, c - 1], dist[r][c - 1]);
        } else {
          heap.insert([[r, c - 1], dist[r][c - 1]]);
        }
      }
      setTimeout(processNextNode, fillTimeDelay);
    };

    processNextNode();
  };

  /* hueristic is defied by the manhattan distance */

  const Astar = (row: number, col: number) => {
    const g_score = initalizeSSSP(ROWS, COLS);
    const f_score = initalizeSSSP(ROWS, COLS);
    const parent = new Map<string, string>();
    const heap = new Heap();
    const visited = new Set();

    parent.set(tupleToString([row, col]), tupleToString([-1, -1]));
    heap.insert([[row, col], 0]);
    f_score[row][col] = 0;
    g_score[row][col] = hueristicEstimate(
      grid[row][col],
      grid[targetNode[0]][targetNode[1]]
    );

    const processNextNode = () => {
      if (heap.isEmpty()) {
        return;
      }

      const [r, c] = heap.deleteMin()!;

      if (tupleToString([r, c]) === tupleToString(targetNode)) {
        // Target node found
        tracePath(r, c, parent);
        return;
      }

      const nodeKey = tupleToString([r, c]);
      visited.add(nodeKey);

      updateNodeColor(r, c, fillColor);
      if (r + 1 < ROWS && !visited.has(tupleToString([r + 1, c]))) {
        const tentative_g_score =
          g_score[r][c] + calcWeight(grid[r][c], grid[r + 1][c]);
        if (tentative_g_score < g_score[r + 1][c]) {
          parent.set(tupleToString([r + 1, c]), tupleToString([r, c]));
          g_score[r + 1][c] = tentative_g_score;
          f_score[r + 1][c] =
            g_score[r + 1][c] + hueristicEstimate(grid[r + 1][c], grid[0][0]);
          if (heap.contains([r + 1, c])) {
            heap.decreaseKey([r + 1, c], f_score[r + 1][c]);
          } else {
            heap.insert([[r + 1, c], f_score[r + 1][c]]);
          }
        }
      }
      if (r - 1 >= 0 && !visited.has(tupleToString([r - 1, c]))) {
        const tentative_g_score =
          g_score[r][c] + calcWeight(grid[r][c], grid[r - 1][c]);
        if (tentative_g_score < g_score[r - 1][c]) {
          parent.set(tupleToString([r - 1, c]), tupleToString([r, c]));
          g_score[r - 1][c] = tentative_g_score;
          f_score[r - 1][c] =
            g_score[r - 1][c] + hueristicEstimate(grid[r - 1][c], grid[0][0]);
          if (heap.contains([r - 1, c])) {
            heap.decreaseKey([r - 1, c], f_score[r - 1][c]);
          } else {
            heap.insert([[r - 1, c], f_score[r - 1][c]]);
          }
        }
      }
      if (c + 1 < COLS && !visited.has(tupleToString([r, c + 1]))) {
        const tentative_g_score =
          g_score[r][c] + calcWeight(grid[r][c], grid[r][c + 1]);
        if (tentative_g_score < g_score[r][c + 1]) {
          parent.set(tupleToString([r, c + 1]), tupleToString([r, c]));
          g_score[r][c + 1] = tentative_g_score;
          f_score[r][c + 1] =
            g_score[r][c + 1] + hueristicEstimate(grid[r][c + 1], grid[0][0]);
          if (heap.contains([r, c + 1])) {
            heap.decreaseKey([r, c + 1], f_score[r][c + 1]);
          } else {
            heap.insert([[r, c + 1], f_score[r][c + 1]]);
          }
        }
      }
      if (c - 1 >= 0 && !visited.has(tupleToString([r, c - 1]))) {
        const tentative_g_score =
          g_score[r][c] + calcWeight(grid[r][c], grid[r][c - 1]);
        if (tentative_g_score < g_score[r][c - 1]) {
          parent.set(tupleToString([r, c - 1]), tupleToString([r, c]));
          g_score[r][c - 1] = tentative_g_score;
          f_score[r][c - 1] =
            g_score[r][c - 1] + hueristicEstimate(grid[r][c - 1], grid[0][0]);
          if (heap.contains([r, c - 1])) {
            heap.decreaseKey([r, c - 1], f_score[r][c - 1]);
          } else {
            heap.insert([[r, c - 1], f_score[r][c - 1]]);
          }
        }
      }
      setTimeout(processNextNode, fillTimeDelay);
    };

    processNextNode();
  };

  /* FunctionMap for names to functions */
  const functionMap: FunctionMap = {};
  functionMap[visualizations[0]] = bfs;
  functionMap[visualizations[1]] = dfs;
  functionMap[visualizations[2]] = dijkstras;
  functionMap[visualizations[3]] = Astar;

  const handleNodeClick = (rowIdx: number, colIdx: number) => {
    if (isSettingTarget) {
      if (currentTargetNodes < MAX_TARGET_NODES) {
        updateNodeColor(rowIdx, colIdx, targetColor);
        setCurrentTargetNodes(currentTargetNodes + 1);
        setTargetNode([rowIdx, colIdx]);
      }
    } else {
      functionMap[selectedAlgorithm](rowIdx, colIdx);
    }
  };

  const handleTargetButtonClick = () => {
    if (currentTargetNodes === MAX_TARGET_NODES) {
      setIsSettingTarget(false);
      return;
    } else {
      setIsSettingTarget(true);
    }
  };

  useEffect(() => {
    if (currentTargetNodes === MAX_TARGET_NODES) {
      setIsSettingTarget(false);
    }
  }, [currentTargetNodes]);

  const randomizeWeights = () => {
    const updatedGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        weight: getRandomInt(minWeight, maxWeight),
      }))
    );
    setGrid(updatedGrid);
  };

  const generateWeights = () => {
    if (showWeights) {
      setShowWeights(false);
      resetGrid();
    } else {
      setShowWeights(true);
      randomizeWeights();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full  mt-[150px]">
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
              className={`h-[40px] w-[${BOX_WIDTH}px] border-blue-100 border-[.5px] border-solid p-[0px]`}
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
          className={`${defaultButtonStyle} ${
            isSettingTarget ? "bg-green-[#50C878]" : ""
          }`}
          onClick={handleTargetButtonClick}
          disabled={currentTargetNodes === MAX_TARGET_NODES}
        >
          Set Target
        </button>
        <button className={defaultButtonStyle} onClick={resetGrid}>
          Reset
        </button>
        <button
          className={`${defaultButtonStyle} ${
            showWeights ? "bg-green-[#50C878]" : ""
          }`}
          onClick={generateWeights}
        >
          Show Weights
        </button>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
