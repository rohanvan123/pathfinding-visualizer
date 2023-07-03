"use client";

import PathfindingVisualizer from "@/components/PathfindingVisualizer";
import Heap from "@/types/Heap";
import { Tuple } from "@/types/types";
import React from "react";

type HeapItem = [Tuple, number];

export default function Home() {
  return <PathfindingVisualizer />;
}
