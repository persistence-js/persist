import 'core-js/shim';
let IM = require('immutable');

export default class LinkedListBase {
  constructor(itemOrList = []) {
    let items = Array.isArray(itemOrList) ? IM.Seq(itemOrList) :
      IM.Seq([].concat(itemOrList));
    this.head = LinkedListBase.makeHead(items);
    this.size = items.size;
  }

  static makeMap(data, next) {
    let node = {
      data: data, 
      next: next,
    };
    return Object.freeze(node);
  }
  
  static makeHead(seq) {
    let LLB = LinkedListBase;
    if (seq === null || seq.size === 0) { 
      return null; 
    } else {
      console.log(seq.size);
      let rest = seq.rest();
      rest = (rest.size === 0) ? null : rest;
      return LLB.makeMap(seq.first(), LLB.makeHead(rest));
    } 
  }

  get tail() {
    if (this.head === null) {
      return this.head;
    }else{
      let current = this.head;
      let tailNode;
      while (current !== null){
        if (current.next === null) { tailNode = current;}
        current = current.next; 
      }
      return tailNode;
    }
  }

  prepend() {
    //RETURNS A LIST, new LZ Store

    //make new list:
    //head: data, next is this.head()
    //tail: this.tail()
    //lzStore: Use Cached result from previous call, and shift...
  }
  reverse(){
    //returns a list
    // head -> Tail
    // Tail -> Head, but modified to point to null
    // save Lz_store as reversed
  }

  addToTail(valueOrNode) {
    //refactor out into:
    //  isNode
    //  getNodeData
    let tailP = valueOrNode.__proto__;
    let maybeNode = (tailP && tailP === LinkedListBase.nodeConstructor);
    valueOrNode = (maybeNode) ? valueOrNode.data : valueOrNode; 
    let newList;
    if (this.tail) {
      newList = new LinkedListBase(this._lzStore.concat(valueOrNode).toJS());
    } else {
      newList = new LinkedListBase(valueOrNode);
    }

    return newList;
  }

  removeHead() {
    return new LinkedListBase(this._lzStore.rest().toJS());
  }

  contains(target) {
    return this._lzStore.contains(target);
  }

  traverse(cb) {
    this._lzStore.toArray().forEach(cb);
  }

  filter() {

  }

  insertBefore() {

  }

  insertAfter() {

  }

  removeBefore(){

  }

  removeAfter(){

  }

  static nodeConstructor() {
    return LLNode;
  }

  static generateLzStore(itemOrList) {
    return 
  }

}
