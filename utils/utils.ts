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
