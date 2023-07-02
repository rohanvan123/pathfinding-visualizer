export const tupleToString = (tuple: [number, number]) => {
  return JSON.stringify(tuple);
};

export const stringToTuple = (str: string) => {
  return JSON.parse(str);
};
