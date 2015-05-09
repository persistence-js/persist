import 'core-js/shim';
let IM = require('immutable');

export default class LinkedListBase {
  constructor(itemOrList = [], options = { circular: false }) {
    let items = Array.isArray(itemOrList) ? IM.Seq(itemOrList) :
      IM.Seq([].concat(itemOrList));
    this.head = LinkedListBase.makeHead(items);
    this.size = items.size;

    //take an input, point tail.next at the input before freezing
    if (options.prependTo){
      if (this.size === 0){
        this.head = options.prependTo;
      } else {
        this.tail.next = options.prependTo;
      }
      this.size = this.size + options.oldSize;
    }

    //Recursive freeze;
    this.forEach(Object.freeze);
    Object.freeze(this);
  }

  static makeMap(data, next) {
    let node = {
      data: data, 
      next: next,
    };
    node[LinkedListBase._LLNODE_SENTINEL_()] = true;
    return node;
  }

  static makeHead(seq) {
    let LLB = LinkedListBase;
    if (seq === null || seq.size === 0) { 
      return null; 
    } else {
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

  /**
   * Returns a new list, with the current list as the tail of the input.
   * @param  {Item, Array, List, Node, or LinkedList}  toPrepend []
   * @return {[type]}           [description]
   */
  prepend(toPrepend = []) {
    let options = { 
      circular  : false,
      prependTo : this.head, 
      oldSize   : this.size,
    };
    //check if Node: copy/attach
    //  toPrepend = toPrepend.data
    //check if LL: copy/attach
    //  toPrepend = toPrepend.map((LL.getData))
    //pass to item
    //
    if (LinkedListBase === undefined){debugger;}
    return (
      LinkedListBase.isNode(toPrepend) ? new LinkedListBase(LinkedListBase.getData(toPrepend), options) : 
      LinkedListBase.isLinkedList(toPrepend) ? new LinkedListBase(toPrepend.map(LinkedListBase.getData), options) : 
      new LinkedListBase(toPrepend, options)
    );
    
    //create a new list with these inputs,
    //  when the tail is created, point it at this...
    //
    //make Head
  }

  append() {

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

  forEach(cb) {
    let current = this.head;
    while (current !== null){
      cb(current);
      current = current.next;
    }
  }

  map(cb){
    let mapped = [];
    let current = this.head;
    while (current !== null){
      mapped.push(cb(current));
      current = current.next;
    }
    return mapped;
  }

  filter(predicate) {
    let filtered = [];
    let current = this.head;
    while (current !== null){
      if (predicate){
        filtered.push(current);
      }
      current = current.next;        
    }

    return filtered;
  }

  insertBefore() {

  }

  insertAfter() {

  }

  removeBefore(){

  }

  removeAfter(){

  }

  static getData(node) {
    return (
      (LinkedListBase.isNode(node)) ? node.data : 
      new Error('getData only accepts nodes.')
    );
  }

  static nodeConstructor() {
    return LLNode;
  }

  static isLinkedList(maybeLinkedList){
    return !!(maybeLinkedList && maybeLinkedList[LinkedListBase._LL_SENTINEL_()]);
  }

  static isNode(maybeNode){
    return !!(maybeNode && maybeNode[LinkedListBase._LLNODE_SENTINEL_()]);
  }

  static _LL_SENTINEL_(){
    return "@@__LINKED_LIST__@@"
  }

  static _LLNODE_SENTINEL_(){
    return "@@__LL_NODE__@@"
  }

}

LinkedListBase.prototype[LinkedListBase._LL_SENTINEL_()] = true;

