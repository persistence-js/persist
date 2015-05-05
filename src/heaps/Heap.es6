import 'core-js/shim';
var IM = require('immutable');

export default class Heap {
  /**
   * Heap constructor
   * @param  {[type]}  value      [IM.List, Array, Heap, or Primitive]
   * @param  {Boolean} isMax      [Defaults to a min heap]
   * @param  {[function]}  comparator [Must return {0, 1, -1} to sort nodes]
   * @return {[type]}             [Heap]
   */
  constructor(value, isMax, comparator) {
    if (!!value && this.isHeap(value)){
      this._heapStorage = value._heapStorage;
      this.maxHeap = (isMax === undefined) ? value.isMaxHeap : isMax;
      this.comparatorFunction = (comparator === undefined) ? value.comparator : comparator;
      return this;
    } 
    this._heapStorage = IM.List.isList(value) ? value : new IM.List(value);
    this.maxHeap = (isMax && typeof isMax === 'boolean') ? true : false;
    if (!!comparator && typeof comparator === 'function'){
      this.comparatorFunction = comparator;
    } else {
      this.comparatorFunction = Heap.defaultComparator();
    }
    //**Optimization issue: need to only build heap when instantiating new, not internal.
    this._heapStorage = this.buildHeap(this._heapStorage);
    Object.freeze(this);
  }
  //Returns a new Heap, with the new value inserted.
  push(value){
    let childIndex = this.storage.size; //index of the new value, before the new value is added
    let parentIndex = childIndex === 0 ? null : (childIndex % 2 === 0 ? childIndex / 2 - 1 : Math.floor(childIndex / 2));
    let newStorageList = this.storage.push(value);
    let finalStorageList = this.siftUp(parentIndex, childIndex, newStorageList);
    return new Heap(finalStorageList, this.isMaxHeap, this.comparator);    
  }
  /**
   * Returns a new Heap with the extracted value (max or min)
   * Use Peek() for the top of the Heap.
   * Pass a value into '.pop' and it will behave as if replace() was called on a regular Heap.
   * @param  {[type]} value [Repesents a new node]
   * @return {[type]}       [A new Heap]
   */
  pop(value){
    if (this.storage.size <= 0){ return this; }
    let siftingList;
    if (value === undefined){
      siftingList = this.storage.withMutations(list => {
        return list.set(0, this.storage.last()).pop();
      })
    } else {
      siftingList = this.storage.set(0, value);
    }
    let finalStorageList = this.siftDown(siftingList, 0);
    return new Heap(finalStorageList, this.isMaxHeap, this.comparator);
  }
  replace(value){
    return this.pop(value);
  }
  /**
   * Builds the array repesenting Heap Storage, from array sent to constructor.
   * Does so by calling siftDown on all non-leaf nodes.
   * @param  {[type]} array [Heap Storage, must be an Immutable List]
   * @return {[type]}       [New Heap Storage]
   */
  buildHeap(list){
    if (!IM.List.isList(list)){
      return new Error("buildHeap input is not an Immutable List!");
    } else{
      //Using size of Heap, find the number of .siftDown calls...
      let roundedPowerOfTwo = Math.floor(Math.log(list.size)/Math.log(2));
      let numberOfSifts = Math.pow(2,roundedPowerOfTwo)-1;
      let heapifiedList = list.withMutations((list)=>{
        let siftedList = list.reduceRight((previous, current, index, array)=>{
          return (index+1 <=numberOfSifts) ? this.siftDown(previous, index) : previous;
        }.bind(this), list);
        return siftedList;
      });
      return heapifiedList;
    }
  }
  //Accepts a Heap, merges current heap with the input heap, returning a new Heap.
  merge(heap){
    let newStorage = this.buildHeap(heap._heapStorage.concat(this._heapStorage));
    return new Heap(newStorage, heap.isMaxHeap, heap.comparator);
  }
  //Returns a sorted Immuatble List of the Heap's elements.
  heapSort(){
    let sortedList = new IM.List([]);
    sortedList = sortedList.withMutations((list)=>{
      let heap = this;
      for (var i = 0; i < heap.size; i++){
        list.push(heap.peek());
        heap = heap.pop();
      }
      return list;
    }.bind(this));
    return sortedList;
  }
  //Takes a list, and sifts down depending on the index, accounting for heap type.
  //Note: Could chained use of list.withMutations be optimised?
  siftDown(list, indexToSift){
    return list.withMutations(list => {
      let finalList = list;
      let switchDown = (p, c, list) => {
        finalList = this.switchNodes(p, c, list);
        parentIndex = c;
        children = Heap.findChildrenWithParent(parentIndex, list);
      }.bind(this);
      let parentIndex = indexToSift;
      let children = Heap.findChildrenWithParent(parentIndex, list);
      while (!this.integrityCheck(parentIndex,children.left,finalList) || !this.integrityCheck(parentIndex,children.right,finalList)){
        if        (children.left && children.right){
          //must select correct child to switch:
          if(this.integrityCheck(children.left, children.right ,finalList)){
            switchDown(parentIndex, children.left, finalList);
          } else {
            switchDown(parentIndex, children.right, finalList);
          }
        } else if (children.left && !children.right){
          //one Child broke integrity check:
          switchDown(parentIndex, children.left, finalList);
        } else if (!children.left && children.right){
          //other Child broke integrity check:
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
  isHeap(object){
    return (this.__proto__ === object.__proto__) ? true : false;
  }
  static defaultComparator() {
    return function(a, b){
      if (a > b){
        return 1;
      }
      if (a < b){
        return -1;
      } 
      return 0;
    }
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
  //assigns child indexes for a given parent index
  static findChildrenWithParent(parentIndex, list){
    let leftIdx = (parentIndex * 2) + 1;
    let rightIdx = (parentIndex + 1) * 2;
    return {
      left: (leftIdx >= list.size) ? null : leftIdx,
      right: (rightIdx >= list.size) ? null : rightIdx
    }
  }
}
