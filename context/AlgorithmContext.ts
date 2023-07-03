import { visualizations } from "@/data/visualizations";
import React, { createContext } from "react";

interface AlgorithmContextValue {
  selectedAlgorithm: string;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<string>>;
}

const AlgorithmContext = createContext<AlgorithmContextValue | undefined>(
  undefined
);

export default AlgorithmContext;
