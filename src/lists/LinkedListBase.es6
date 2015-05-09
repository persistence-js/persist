import 'core-js/shim';
let IM = require('immutable');

export default class LinkedListBase {
  constructor(itemOrList = []) {
    let items = Array.isArray(itemOrList) ? IM.Seq(itemOrList) :
      IM.Seq([].concat(itemOrList));
    this.head = LinkedListBase.makeHead(items);
    this.size = items.size;

    //Recursive freeze;
    this.forEach(Object.freeze);
    Object.freeze(this);
  }

  static makeMap(data, next) {
    let node = {
      data: data, 
      next: next,
    };
    return (node);
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

  prepend(itemOrList = []) {
    //create a new list with these inputs,
    //  when the tail is created, point it at this...
    //
    //make Head
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

  forEach(cb) {
    let current = this.head;
    while (current !== null){
      cb(current);
      current = current.next;
    }
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
