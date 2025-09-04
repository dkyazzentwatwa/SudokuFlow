import '@testing-library/jest-dom';

// Mock Worker for tests
class WorkerMock {
  onmessage: ((e: MessageEvent) => void) | null = null;
  
  postMessage(data: any) {
    // Mock implementation
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data: { type: data.type, result: {} } }));
      }
    }, 0);
  }
  
  terminate() {}
}

(globalThis as any).Worker = WorkerMock;