export const tupleToString = (tuple: [number, number]) => {
  return JSON.stringify(tuple);
};

export const stringToTuple = (str: string) => {
  return JSON.parse(str);
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
