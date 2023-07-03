import { swap, tupleToString } from "@/utils/utils";
import { Tuple } from "./types";

type HeapItem = [Tuple, number];

class Heap {
  private heap: HeapItem[];

  constructor() {
    this.heap = [];
  }

  insert(item: HeapItem) {
    this.heap.push(item);
    let currentIndex = this.heap.length - 1;
    this.heapifyUp(currentIndex);
  }

  deleteMin() {
    if (this.heap.length === 0) {
      return;
    }

    const minItem: HeapItem = this.heap[0];
    swap(this.heap, 0, this.heap.length - 1);
    this.heap.pop();
    this.heapifyDown(0);

    return minItem[0];
  }

  getMin() {
    if (this.heap.length === 0) {
      return undefined;
    } else {
      return this.heap[0][0];
    }
  }

  decreaseKey(node: Tuple, newKey: number) {
    const nodeKey = tupleToString(node);
    for (let i = 0; i < this.heap.length; i++) {
      if (tupleToString(this.heap[i][0]) === nodeKey) {
        this.heap[i][1] = newKey;
        this.heapifyUp(i);
        break;
      }
    }
  }

  contains(node: Tuple) {
    const nodeKey = tupleToString(node);
    for (let i = 0; i < this.heap.length; i++) {
      if (tupleToString(this.heap[i][0]) === nodeKey) {
        return true;
      }
    }
    return false;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  buildHeap(arr: HeapItem[]) {
    for (let i = 0; i < arr.length; i++) {
      this.insert(arr[i]);
    }
  }

  heapifyUp(currentIndex: number) {
    while (currentIndex > 0) {
      let parentIndex = currentIndex - 1; // 2;

      if (this.heap[parentIndex][1] > this.heap[currentIndex][1]) {
        // Swap the parent and the child
        swap(this.heap, currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  heapifyDown(currentIndex: number) {
    const leftChildIndex = 2 * currentIndex + 1;
    const rightChildIndex = 2 * currentIndex + 2;
    let smallestIndex = currentIndex;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex][1] < this.heap[smallestIndex][1]
    ) {
      smallestIndex = leftChildIndex;
    }
    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex][1] < this.heap[smallestIndex][1]
    ) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex != currentIndex) {
      swap(this.heap, smallestIndex, currentIndex);
      this.heapifyDown(smallestIndex);
    }
  }
}

export default Heap;
