import 'core-js/shim';
let IM = require('immutable');

class LLNode {
  //The alternative to this is using a record and storing pointers anyway...
  constructor(currentIndex = null, llStore = null){
    this._currentIndex = currentIndex;
    this._llStore = llStore;
    Object.freeze(this);
  }
  get data(){
    //memoize this function
    let has = this._llStore.has(this._currentIndex);
    return (has) ? this._llStore.get(this._currentIndex) : null;
  }
  get next(){
    //memoize
    let idx = this._currentIndex+1;
    let has = this._llStore.has(idx);
    return (has) ? new LLNode(idx, this._llStore) : null;
  }
}

export default class LinkedListBase {
  constructor(itemOrList = []) {
    this._lzStore = LinkedListBase.generateLzStore(itemOrList);
  }

  get store() {
    return this._lzStore.toJS();
  }

  get head() {
    return  this.size > 0 ? new LLNode(0, this._lzStore) : null;
  }

  get tail() {
    let size = this.size;
    return size > 0 ? new LLNode(size-1, this._lzStore) : null;
  }

  get size() {
    return this._lzStore.size;
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
    return Array.isArray(itemOrList) ? IM.Seq(itemOrList) : IM.Seq([].concat(itemOrList));
  }

}
