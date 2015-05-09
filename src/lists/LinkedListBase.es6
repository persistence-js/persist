import 'core-js/shim';
let IM = require('immutable');

export default class LList {
  constructor(itemOrList = [], options = { circular: false }) {
    let items = LList.convertToSeq(itemOrList);
    this.head = LList.makeHead(items);
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
    node[LList._LLNODE_SENTINEL_()] = true;
    return node;
  }

  static makeHead(seq) {
    if (seq === null || seq.size === 0) { 
      return null; 
    } else {
      let rest = seq.rest();
      rest = (rest.size === 0) ? null : rest;
      return LList.makeMap(seq.first(), LList.makeHead(rest));
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
   * Utilizes tail-sharing.
   * @param  {Item, Array, List, Node, or LList}  toPrepend []
   * @return {[type]}           [description]
   */
  prepend(toPre = []) {
    let opts = { 
      circular  : false,
      prependTo : this.head, 
      oldSize   : this.size,
    };

    return (
      LList.isNode(toPre) ? new LList(LList.getData(toPre), opts) : 
      LList.isLList(toPre) ? new LList(toPre.map(LList.getData), opts) : 
      new LList(toPre, opts)
    );

  }

  /**
   * Returns a new list in O(n) by recollecting elements of both
   * into a Seq, and passing that Seq to the LList constructor.
   * @param  {[Item, Array, List, Node, or LList]} toAppend [description]
   * @return {[type]}       [description]
   */
  append(toApp) {
    return (
      new LList(
        this.map(LList.getData).concat(
          LList.isNode(toApp) ? LList.getData(toApp) : 
          LList.isLList(toApp) ? toApp.map(LList.getData) : 
          LList.convertToSeq(toApp).toArray()
        )
      )
    );
  }

  /**
   * Returns a new list, with copies of the old list's elements, pointed
   * in reverse order
   * @return {[type]} [description]
   */
  reverse(){
    let reversed = [];
    let unShiftToList = (element) => { reversed.unshift(element)}
    this.map(LList.getData).forEach(unShiftToList);
    return new LList(reversed);
  }

  /**
   * Returns a new list, sans the current list's head.
   * Uses tail-sharing.
   * @return {[type]} [description]
   */
  removeHead() {
    let notFirst = (node) => {
      return (node !==  this.head);
    }
    return new LList(this.filter(notFirst).map(LList.getData));
  }

  /**
   * Returns a new list in O(n), sans the current list's tail.
   * @return {[type]} [description]
   */
  removeTail() {
    let notLast = (node) => {
      return (node !== this.tail)
    }
    return new LList(this.filter(notLast).map(LList.getData));
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
    let pushResult = (node) => { mapped.push(cb(node));}
    this.forEach(pushResult);
    return mapped;
  }

  filter(predicate) {
    let filtered = [];
    this.forEach((node) => {
      if(!!predicate(node)){
        filtered.push(node);
      }
    });

    return filtered;
  }

  reduce(){
    //sig: prev, current, index, list
  }

  static getData(node) {
    return (
      (LList.isNode(node)) ? node.data : 
      new Error('getData only accepts nodes.')
    );
  }

  static nodeConstructor() {
    return LLNode;
  }

  static isLList(maybeLList){
    return !!(maybeLList && maybeLList[LList._LL_SENTINEL_()]);
  }

  static isNode(maybeNode){
    return !!(maybeNode && maybeNode[LList._LLNODE_SENTINEL_()]);
  }

  static convertToSeq(itemOrList){
    return Array.isArray(itemOrList) ? IM.Seq(itemOrList) :
      IM.Seq([].concat(itemOrList));
  }

  static _LL_SENTINEL_(){
    return "@@__LINKED_LIST__@@"
  }

  static _LLNODE_SENTINEL_(){
    return "@@__LL_NODE__@@"
  }

}

LList.prototype[LList._LL_SENTINEL_()] = true;

