type QueueItem = [number, number];

class Queue {
  private queue: QueueItem[];

  constructor() {
    this.queue = [];
  }

  enqueue(item: QueueItem) {
    this.queue.push(item);
  }

  dequeue(): QueueItem | undefined {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

export default Queue;
