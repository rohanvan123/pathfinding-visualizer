"use client";

import React, { useEffect, useState } from "react";
import Node from "./Node";
import Queue from "./Queue";
import { resolveTypeReferenceDirective } from "typescript";

interface Node {
  row: number;
  col: number;
  color: string;
}

type Tuple = [number, number];

const targetNodesMax = 1;

let initialGrid: Node[][] = [];

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
  initialGrid.push(row);
}

const tupleToString = (tuple: [number, number]) => {
  return JSON.stringify(tuple);
};

const stringToTuple = (str: string) => {
  return JSON.parse(str);
};

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState(initialGrid);
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
      if (r + 1 < 10) {
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
      if (c + 1 < 10) {
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
      setTimeout(processNextNode, 10);
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

  const resetGrid = () => {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        updateNodeColor(r, c, "white");
      }
    }
    setCurrentTargetNodes(0);
  };

  const handleNodeClick = (rowIdx: number, colIdx: number) => {
    if (isSettingTarget) {
      if (currentTargetNodes < targetNodesMax) {
        updateNodeColor(rowIdx, colIdx, "yellow");
        setCurrentTargetNodes(currentTargetNodes + 1);
      }
    } else {
      bfs(rowIdx, colIdx);
    }
  };

  const handleTargetButtonClick = () => {
    if (currentTargetNodes === targetNodesMax) {
      setIsSettingTarget(false);
      return;
    }
    setIsSettingTarget(true);
  };

  useEffect(() => {
    if (currentTargetNodes === targetNodesMax) {
      setIsSettingTarget(false);
    }
  }, [currentTargetNodes]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="m-auto mt-[50px] w-[400px] h-[400px] grid grid-cols-10">
        {grid.map((row, rowIdx) => {
          return row.map((node, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              className={`h-[40px] w-[40px] border-black border-[1px] border-solid p-[0px]`}
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
          className="mt-[50px] h-[40px] w-[100px] text-center border-black border-[1px] rounded-[8px] hover:bg-slate-300"
          onClick={resetGrid}
        >
          Reset
        </button>
        <button
          className={`mt-[50px] h-[40px] w-[100px] text-center border-black border-[1px] rounded-[8px] hover:bg-slate-300 ${
            isSettingTarget ? "bg-slate-300" : ""
          }`}
          onClick={handleTargetButtonClick}
          disabled={currentTargetNodes === targetNodesMax}
        >
          Set Target
        </button>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;

// Shortest Path
// Have a map from the row, col to its parent
// When we dequeue a node, we check if it is the target node
// If it is, we backtrack from the target node to the start node

// the indication will be a targetColor
// we will limit the number of targetNodes to 1
// but this should be modifiable in the future
