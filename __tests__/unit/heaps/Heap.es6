jest.autoMockOff();
const IM = require('immutable');
const Heap = require('../../../src/heaps/Heap');

describe("Heap Operations", () => {
  describe("Instantiation", () => {
    let newHeap = new Heap();
    it("instantiates a min-heap", () => {
      expect(newHeap.isMaxHeap).toBe(false);
    });
    it("can create a max-heap", () => {
      let maxHeap = new Heap(undefined,true);
      expect(maxHeap.isMaxHeap).toBe(true);
    });
    it("instantiates empty, checks size", () => {
      expect(newHeap.size).toBe(0);
    });
    it("instantiates with a comparator", () => {
      let compare = () => 0;
      let compareHeap = new Heap(undefined, undefined, compare);
      expect(compareHeap.comparator).toEqual(compare);
    });
  });
  describe("Internal Methods", () => {
    describe("Directional Sifting", () => {
      let newMinHeap = new Heap();
      newMinHeap = newMinHeap.push(99).push(8).push(9).push(4).push(5);
      let newMaxHeap = new Heap(undefined,true);
      newMaxHeap = newMaxHeap.push(99).push(8).push(9).push(4).push(5);
      it("sifts down I", () => {
        let siftedList = newMaxHeap.siftDown(newMaxHeap._heapStorage,0);
        expect(siftedList.first()).toBe(99);
        expect(siftedList.last()).toBe(5);
        expect(siftedList.get(2)).toBe(9);
      });
      it("sifts down II", () => {
        let siftedList = newMinHeap.siftDown(newMinHeap._heapStorage,0);
        expect(siftedList.first()).toBe(4);
        expect(siftedList.last()).toBe(8);
        expect(siftedList.get(2)).toBe(9);
      });
    });
  });
  describe("Basic Instance Methods", () => {
    let newHeap = new Heap();
    newHeap = newHeap.push(1).push(0).push(3);
    let newHeap2 = new Heap();
    newHeap2 = newHeap2.push(1).push(2).push(3).push(4).push(5).push(0);
    it("Pushes/Inserts", () => {
      expect(newHeap.size).toBe(3);
    });
    it("Peeks", () => {
      expect(newHeap.peek()).toBe(0);
      expect(newHeap2.peek()).toBe(0);
    });
    it("Pops/Extracts", () => {
      expect(newHeap.pop().size).toBe(2);
      expect(newHeap.pop().peek()).toBe(1);
      expect(newHeap.size).toBe(3);
    });
    it("Replaces", () => {
      expect(newHeap.replace(0).size).toBe(3);
      expect(newHeap.replace(0).peek()).toBe(0);
    });
  });
  describe("Creation & Operations", () => {
    let numbers25 = [];
    let numbers50 = [];
    for (let i = 25; i >0; i--){
      numbers25.push(i);
    }
    for (let i = 50; i >25; i--){
      numbers50.push(i);
    }
    describe("BuildHeap", () => {
      it("builds max heaps from an array", () => {
        let heap = new Heap(numbers25, true);
        expect(heap.size).toBe(25);
        expect(heap.peek()).toBe(25);
        expect(heap.pop().pop().peek()).toBe(23);
      });
      it("builds min heaps from an array", () => {
        let heap = new Heap(numbers25);
        expect(heap.size).toBe(25);
        expect(heap.peek()).toBe(1);
        expect(heap.pop().pop().peek()).toBe(3);
      });
      it("accepts heaps", () => {
        let heap1 = new Heap(numbers25);
        let heap2 = new Heap(heap1);
        expect(heap2.size).toBe(25);
        expect(heap2.peek()).toBe(1);
        expect(heap2.pop().pop().peek()).toBe(3);
      });
    });
    describe("Merge", () => {
      it("merges with other heaps", () => {
        let heap1 = new Heap(numbers25);
        let heap2 = new Heap(numbers50);
        let heap3 = heap2.merge(heap1);
        expect(heap3.peek()).toBe(1);
        expect(heap3.size).toBe(50);
      });
    });
    describe("HeapSort", () => {
      it('sorts an array of numbers', () => {
        let tenNumbers = [1,2,3,4,5,6,7,8,9,10].sort(() => {
          return .5 - Math.random();
        });
        let newHeap = new Heap(tenNumbers);
        let sortedArray = newHeap.heapSort();
        for (let i = 0; i < sortedArray.size; i++){
          expect(sortedArray.get(i)).toEqual(i+1);
        }
      });
    });
  });
});
