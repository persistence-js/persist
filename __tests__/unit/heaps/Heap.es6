jest.autoMockOff();
let IM = require('immutable');
let Heap = require('../../../src/heaps/Heap');

describe("Heap Operations", ()=>{
  describe("Basic Instantiation: ", ()=>{
    let newHeap;
    newHeap = new Heap();
    it("instantiates a min-heap", ()=>{
      expect(newHeap.isMaxHeap).toBe(false);
    })
    it("instantiates empty", ()=>{
      expect(newHeap.size).toBe(0);
    })
  })

  describe("Basic: ", ()=>{
    let newHeap = new Heap();
    newHeap = newHeap.push(1).push(0).push(3);
    let newHeap2 = new Heap();
    newHeap2 = newHeap2.push(1).push(2).push(3).push(4).push(5).push(0);
    it("Pushes/Inserts", ()=>{
      expect(newHeap.size).toBe(3);
    })
    it("Peeks", ()=>{
      expect(newHeap.peek()).toBe(0);
      expect(newHeap2.peek()).toBe(0);
    })
    it("Pops/Extracts", ()=>{
      expect(newHeap.pop().size).toBe(2);
      expect(newHeap.pop().peek()).toBe(1);
      expect(newHeap.size).toBe(3);
    })
    it("Replaces", ()=>{
      expect(newHeap.replace(0).size).toBe(3);
      expect(newHeap.replace(0).peek()).toBe(0);

    })
  })

  xdescribe("Creation: ", ()=>{
    describe("Constructor", ()=>{
      it("can create a max-heap", ()=>{})
      it("accepts an array", ()=>{})
      it("accepts a heap", ()=>{})
      it("", ()=>{})
    })
    describe("heapifies", ()=>{})
    describe("Merges", ()=>{})
    describe("Melds", ()=>{})

  })

  xdescribe("Inspection: ", ()=>{
    it("Checks Size", ()=>{})
    it("Checks isEmpty", ()=>{})
    
  })
  
  xdescribe("Internal: ", ()=>{
    it("Deletes Node", ()=>{})
    it("inc/dec key", ()=>{})
    it("performs an integrity check", ()=>{})
    it("can push into a large 1000+ heap without errors", ()=>{})
    it("sift up", ()=>{})
    it("sift down", ()=>{})
  })

})