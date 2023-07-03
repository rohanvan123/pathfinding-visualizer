"use client";

import PathfindingVisualizer from "@/components/PathfindingVisualizer";
import Heap from "@/types/Heap";
import { Tuple } from "@/types/types";
import React from "react";

type HeapItem = [Tuple, number];

export default function Home() {
  const randomNumbersList: HeapItem[] = [
    [[1, 1], 10],
    [[2, 2], 8],
    [[3, 3], 8],
    [[4, 4], 6],
    [[5, 5], 5],
    [[6, 6], 7],
    [[7, 7], 4],
    [[8, 8], 3],
    [[9, 9], 1],
    [[10, 10], 2],
  ];

  const heap = new Heap();
  heap.buildHeap(randomNumbersList);

  return <PathfindingVisualizer />;
}
