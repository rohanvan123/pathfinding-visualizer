"use client";

import React, { useContext, useEffect, useState } from "react";
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
import {
  defaultColor,
  fillColor,
  pathColor,
  targetColor,
  startColor,
  wallColor,
} from "@/styles/colors";
import AlgorithmContext from "@/context/AlgorithmContext";
import { visualizations } from "@/data/visualizations";
import Stack from "@/types/Stack";
import Queue from "../types/Queue";
import Heap from "@/types/Heap";
import Legend from "./Legend";

/* GRID SETTINGS */
const MAX_TARGET_NODES = 1;
const BOX_WIDTH = 32;
const ROWS = 15;
const COLS = 40;

/* ANIMATION SETTINGS */
const fillTimeDelay = 4;
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
  const [isPlacingWalls, setIsPlacingWalls] = useState(false);
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
    updateNodeColor(row, col, startColor);

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
        tracePath(r, c, parent);
        return;
      }
      visited.add(nodeKey);

      if (r !== row || c !== col) {
        updateNodeColor(r, c, fillColor);
      }

      const processNeighbor = (newRow: number, newCol: number) => {
        if (
          !visited.has(tupleToString([newRow, newCol])) &&
          grid[newRow][newCol].color != wallColor
        ) {
          parent.set(tupleToString([newRow, newCol]), tupleToString([r, c]));
          queue.enqueue([newRow, newCol]);
        }
      };

      if (r + 1 < ROWS) {
        processNeighbor(r + 1, c);
      }
      if (r - 1 >= 0) {
        processNeighbor(r - 1, c);
      }
      if (c + 1 < COLS) {
        processNeighbor(r, c + 1);
      }
      if (c - 1 >= 0) {
        processNeighbor(r, c - 1);
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
    updateNodeColor(row, col, startColor);

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

      if (r !== row || c !== col) {
        updateNodeColor(r, c, fillColor);
      }

      const processNeighbor = (newRow: number, newCol: number) => {
        if (
          !visited.has(tupleToString([newRow, newCol])) &&
          grid[newRow][newCol].color != wallColor
        ) {
          parent.set(tupleToString([newRow, newCol]), tupleToString([r, c]));
          stack.push([newRow, newCol]);
        }
      };

      if (c - 1 >= 0) {
        processNeighbor(r, c - 1);
      }
      if (r + 1 < ROWS) {
        processNeighbor(r + 1, c);
      }
      if (c + 1 < COLS) {
        processNeighbor(r, c + 1);
      }
      if (r - 1 >= 0) {
        processNeighbor(r - 1, c);
      }

      setTimeout(processNextNode, fillTimeDelay);
    };

    processNextNode();
  };

  const dijkstras = (row: number, col: number) => {
    if (!showWeights) return bfs(row, col);

    const dist: number[][] = initalizeSSSP(ROWS, COLS);
    const parent = new Map<string, string>();
    const heap = new Heap();
    const visited = new Set();
    updateNodeColor(row, col, startColor);

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
      if (r !== row || c !== col) {
        updateNodeColor(r, c, fillColor);
      }

      const processNeighbor = (newRow: number, newCol: number) => {
        if (
          !visited.has(tupleToString([newRow, newCol])) &&
          grid[newRow][newCol].color != wallColor
        ) {
          if (
            calcWeight(grid[r][c], grid[newRow][newCol]) + dist[r][c] <
            dist[newRow][newCol]
          ) {
            dist[newRow][newCol] =
              dist[r][c] + calcWeight(grid[r][c], grid[newRow][newCol]);
            parent.set(tupleToString([newRow, newCol]), tupleToString([r, c]));
          }
          if (heap.contains([newRow, newCol])) {
            heap.decreaseKey([newRow, newCol], dist[newRow][newCol]);
          } else {
            heap.insert([[newRow, newCol], dist[newRow][newCol]]);
          }
        }
      };

      if (r + 1 < ROWS) {
        processNeighbor(r + 1, c);
      }
      if (r - 1 >= 0) {
        processNeighbor(r - 1, c);
      }
      if (c + 1 < COLS) {
        processNeighbor(r, c + 1);
      }
      if (c - 1 >= 0) {
        processNeighbor(r, c - 1);
      }

      setTimeout(processNextNode, fillTimeDelay);
    };

    processNextNode();
  };

  const Astar = (row: number, col: number) => {
    const cost_so_far = initalizeSSSP(ROWS, COLS);
    const parent = new Map<string, string>();
    const heap = new Heap();
    const visited = new Set();

    updateNodeColor(targetNode[0], targetNode[1], targetColor);
    updateNodeColor(row, col, startColor);

    parent.set(tupleToString([row, col]), tupleToString([-1, -1]));
    heap.insert([[row, col], 0]);
    cost_so_far[row][col] = 0;

    const processNextNode = () => {
      if (heap.isEmpty()) return;

      const [r, c] = heap.deleteMin()!;
      if (tupleToString([r, c]) === tupleToString(targetNode)) {
        tracePath(r, c, parent);
        return;
      }

      const nodeKey = tupleToString([r, c]);
      visited.add(nodeKey);
      if (r !== row || c !== col) {
        updateNodeColor(r, c, fillColor);
      }

      const processNeighbor = (nextRow: number, nextCol: number) => {
        const edgeWeight = showWeights
          ? calcWeight(grid[r][c], grid[nextRow][nextCol])
          : 1;
        const new_cost = cost_so_far[r][c] + edgeWeight;
        if (
          (!visited.has(tupleToString([nextRow, nextCol])) ||
            new_cost < cost_so_far[nextRow][nextCol]) &&
          grid[nextRow][nextCol].color != wallColor
        ) {
          cost_so_far[nextRow][nextCol] = new_cost;
          const priority =
            new_cost +
            hueristicEstimate(
              grid[nextRow][nextCol],
              grid[targetNode[0]][targetNode[1]]
            );
          if (heap.contains([nextRow, nextCol])) {
            heap.decreaseKey([nextRow, nextCol], priority);
          } else {
            heap.insert([[nextRow, nextCol], priority]);
          }
          parent.set(tupleToString([nextRow, nextCol]), tupleToString([r, c]));
        }
      };

      if (r + 1 < ROWS) {
        processNeighbor(r + 1, c);
      }
      if (r - 1 >= 0) {
        processNeighbor(r - 1, c);
      }
      if (c + 1 < COLS) {
        processNeighbor(r, c + 1);
      }
      if (c - 1 >= 0) {
        processNeighbor(r, c - 1);
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
    processNextPathNode(1);
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
    } else if (isPlacingWalls) {
      updateNodeColor(
        rowIdx,
        colIdx,
        grid[rowIdx][colIdx].color == defaultColor ? wallColor : defaultColor
      );
    } else {
      functionMap[selectedAlgorithm](rowIdx, colIdx);
    }
  };

  const handleTargetButtonClick = () => {
    if (isPlacingWalls) {
      setIsPlacingWalls(false);
    }
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

  const handlePlaceWallClick = () => {
    setIsSettingTarget(false);
    setIsPlacingWalls(!isPlacingWalls);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full  mt-[120px]">
      <Legend />
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
              className={`h-[32px] w-[${BOX_WIDTH}px] border-blue-100 border-[.5px] border-solid p-[0px]`}
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
      <div className="flex flex-row gap-[20px] pb-[50px]">
        <button
          className={`${defaultButtonStyle} ${
            isSettingTarget ? "bg-[#50C878]" : ""
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
            showWeights ? "bg-[#50C878]" : ""
          }`}
          onClick={generateWeights}
        >
          Show Weights
        </button>
        <button
          className={`${defaultButtonStyle} ${
            isPlacingWalls ? "bg-[#50C878]" : ""
          }`}
          onClick={handlePlaceWallClick}
        >
          Place Walls
        </button>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
