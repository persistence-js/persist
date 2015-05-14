import 'core-js/shim';
const IM = require('immutable');


export default class LList {
  /**
   * Accepts items and list-like objects.
   * Converts them into Immutable Seq's of length >1 before
   * creating nodes.
   * @param  {Array}  itemOrList [description]
   * @param  {Object} options [circular (bool), prependTo(node), oldSize(num)]
   * @return {[type]}            [description]
   */
  constructor(itemOrList = [], options = { circular: false }) {
    let items = LList.convertToSeq(itemOrList);
    this.head = LList.makeHead(items);
    this.size = items.size;
    let prepend = options.prependTo && LList.isNode(options.prependTo);
    if (prepend){
      if (this.size === 0){
        this.head = options.prependTo;
      } else {
        this.tail.next = options.prependTo;
      }
      this.size = this.size + options.oldSize;
    }

    if (options.circular){
      this.tail.next = this.head;
      this.circular = options.circular;
    }

    this.forEach(Object.freeze);
    Object.freeze(this);
  }

  /**
   * Find the final node in the Linked List in O(n).
   * @return {[Node]} [last node in the linked list, null if list is empty]
   */
  get tail() {
    let pointsAt = (point) => {
      return (element) => {
        return element.next === point;
      }
    }
    let sentinel = (this.circular) ? this.head : null;
    return (this.size < 1) ? null : this.filter(pointsAt(sentinel))[0];
  }

  /**
   * Returns a new list, with the current list as the tail of the input.
   * Utilizes tail-sharing.
   * @param  {Item, Array, List, Node, or LList}  toPrepend []
   * @return {[type]}           [description]
   */
  prepend(toPre = []) {
    let opts = {
      circular  : this.circular,
      prependTo : this.head,
      oldSize   : this.size,
    };

    //If circular, can't use tail-sharing.
    if (this.circular){
      toPre = LList.convertToSeq(toPre);
      return new LList(toPre.concat(this.map(LList.getData)).toArray(),
        { circular: this.circular });
    }

    //Else, prepend in O(1);
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
    let opts = { circular : this.circular,}
    return (
      new LList(
        this.map(LList.getData).concat(
          LList.isNode(toApp) ? LList.getData(toApp) :
          LList.isLList(toApp) ? toApp.map(LList.getData) :
          LList.convertToSeq(toApp).toArray()
        ), opts
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
    return new LList(reversed, { circular: this.circular });
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
    return new LList(this.filter(notFirst).map(LList.getData),
     { circular: this.circular });
  }

  /**
   * Returns a new list in O(n), sans the current list's tail.
   * @return {[type]} [description]
   */
  removeTail() {
    let notLast = (node) => {
      return (node !== this.tail)
    }
    return new LList(this.filter(notLast).map(LList.getData),
     { circular: this.circular });
  }

  //Functional helper methods
  forEach(cb) {
    let current = this.head;
    while (current !== null){
      cb(current);
      current = current.next;
      //for circular lists:
      if (current === this.head){ break;}
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

  isEmpty() {
    return (this.size <= 0);
  }

  /**
   * Creates individual nodes, from anything that can be stored
   * in an immutable Seq.
   * Can be passed null to create tails.
   * @param  {[Primitive, Object]}   data []
   * @param  {[New Node, null]} next []
   * @return {[object]}        []
   */
  static makeNode(data, next) {
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
      return LList.makeNode(seq.first(), LList.makeHead(rest));
    }
  }

  //Extracts data from Nodes
  static getData(node) {
    return (
      (LList.isNode(node)) ? node.data :
      new Error('getData only accepts nodes.')
    );
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
