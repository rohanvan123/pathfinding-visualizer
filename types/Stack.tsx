type StackItem = [number, number];

class Stack {
  private stack: StackItem[];

  constructor() {
    this.stack = [];
  }

  push(item: StackItem) {
    this.stack.push(item);
  }

  pop(): StackItem | undefined {
    return this.stack.pop();
  }

  peek(): StackItem | undefined {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}

export default Stack;
