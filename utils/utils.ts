import { Node } from "@/types/types";

export const tupleToString = (tuple: [number, number]) => {
  return JSON.stringify(tuple);
};

export const stringToTuple = (str: string) => {
  return JSON.parse(str);
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const swap = (array: any[], index1: number, index2: number) => {
  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};

export const calcWeight = (source: Node, dest: Node) => {
  return Math.abs(source.weight - dest.weight);
};

export const intializeGrid = (
  maxRows: number,
  maxCols: number,
  defaultColor: string
) => {
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
