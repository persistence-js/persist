import 'core-js/shim';
var IM = require('immutable');

export default class Heap {
  constructor(value, isMax, comparator) {
    //Heap will be represented an immutable IM.List.
    this._heapStorage = IM.List.isList(value) ? value : new IM.List(value);
    //Heap defaults to a min-heap.
    this.maxHeap = (isMax && typeof isMax === 'boolean') ? true : false;

    if (!!comparator && typeof comparator === 'function'){
      this.comparatorFunction = comparator;
    } else {
      this.comparatorFunction = Heap.assignDefaultComparator();
    }
    Object.freeze(this);
  }
  //Returns a new Heap, with the new value inserted.
  push(value){
    let childIndex = this.storage.size; //index of the new value, before the new value is added
    let parentIndex = childIndex === 0 ? null : (childIndex % 2 === 0 ? childIndex / 2 - 1 : Math.floor(childIndex / 2));

    let newStorageList = this.storage.push(value);
    let finalStorageList = this.siftUp(parentIndex, childIndex, newStorageList);
    return new Heap(finalStorageList);    
  }
  //Returns a new Heap, with the max/min value extracted (rather than the extracted value)
  //Use peek() for the top of the Heap.
  pop(){
    if (this.storage.size <= 0){ return undefined }
    let heapTop = this.storage.first();
    let siftingList = this.storage.withMutations(list => {
      return list.set(0, this.storage.last()).pop();
    })
    let finalStorageList = this.siftDown(siftingList, 0);
    return new Heap(finalStorageList);
  }
  //Takes a list, and sifts down depending on the index, accounting for heap type.
  //Note: Could chained use of list.withMutations be optimised?
  siftDown(list, indexToSift){
    return list.withMutations(list => {
      let finalList = list;
      let findChildren = (parentIndex) =>{
        let leftIdx = (parentIndex * 2) + 1;
        let rightIdx = (parentIndex + 1) * 2;
        return {
          left: (leftIdx >= list.size) ? null : leftIdx,
          right: (rightIdx >= list.size) ? null : rightIdx
        }
      };
      let switchDown = (p, c, list) => {
        finalList = this.switchNodes(p, c, list);
        parentIndex = c;
        children = findChildren(parentIndex);
      }.bind(this);
      let parentIndex = indexToSift;
      let children = findChildren(parentIndex);

      while (!this.integrityCheck(parentIndex,children.left,finalList) || !this.integrityCheck(parentIndex,children.right,finalList)){
        if        (children.left && children.right){
          if(this.integrityCheck(children.left, children.right ,finalList)){
            switchDown(parentIndex, children.left, finalList);
          } else {
            switchDown(parentIndex, children.right, finalList);
          }
        } else if (children.left && !children.right){
          switchDown(parentIndex, children.left, finalList);
        } else if (!children.left && children.right){
          switchDown(parentIndex, children.right, finalList);
        }
      }
      return finalList;

    }.bind(this));
  }
  //Child checks parent, switches if they violate the Heap property.
  siftUp(parentIndex, childIndex, list){
    return list.withMutations(siftingList => {
      while (!this.integrityCheck(parentIndex, childIndex, siftingList)){
        siftingList = this.switchNodes(parentIndex, childIndex, siftingList);
        //Update child and parent to continue checking:
        childIndex = parentIndex;
        parentIndex = parentIndex === 0 ? null : (parentIndex % 2 === 0 ? parentIndex / 2 - 1 : Math.floor(parentIndex / 2));
      }
      return siftingList;
    }.bind(this))
  }
  switchNodes(parentIndex, childIndex, list){
    return list.withMutations(list => {
      let temp = list.get(parentIndex);
      return list.set(parentIndex, list.get(childIndex)).set(childIndex, temp)});
  }
  integrityCheck(parentIndex, childIndex, list){
    if (parentIndex === null || childIndex === null){return true;}
    let comparison = this.comparatorFunction(list.get(parentIndex), list.get(childIndex));
    // 1 = greater than, -1 = less than, 0 = equal;
    if (this.isMaxHeap){
      //maxheap, parent should be larger
      if (comparison === 1 || comparison === 0) {return true;} else {return false;}
    } else if (!this.isMaxHeap){
      if (comparison === -1 || comparison === 0){return true;} else {
        return false;}
    }
  }
  peek(){
    return this.storage.first();
  }
  get comparator(){
    return this.comparatorFunction;
  }
  get isMaxHeap(){
    return this.maxHeap;
  }
  get storage(){
    return this._heapStorage;
  }
  get size() {
    return this._heapStorage.size;
  }
  static assignDefaultComparator() {
    return function(a, b){
      if (a>b){
        return 1;
      }
      if (a < b){
        return -1;
      } 
      return 0;
    }
  }
}
