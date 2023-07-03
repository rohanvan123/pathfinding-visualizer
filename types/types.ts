export interface Node {
  row: number;
  col: number;
  color: string;
  weight: number;
}

export type Tuple = [number, number];
export interface FunctionMap {
  [key: string]: (...args: any[]) => any;
}
