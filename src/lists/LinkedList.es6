import 'core-js/shim';
var IM = require('immutable');

export default class LinkedList {
  // static makeNode(value = null, next = null) {
  //   //returns a map with :
  //   //value
  //   //next: which points to a new node

  // }

  constructor(itemOrList = [], options = {circular: false}) {
  }

  get head() {
    return this;
  }

  get tail() {
    return this._lzStore.last() || null;
  }

  get size() {
    return this._lzStore.size;
  }

  removeHead() {
    //return next
    return new LinkedListBase(this._lzStore.rest().toJS());
  }

  prepend() {
    //construct a new node, make next this. return that list...
  }

  addToTail(valueOrNode) {
    let newList;
    if (this.tail) {
      newList = new LinkedListBase(this._lzStore.concat(valueOrNode).toJS());
    } else {
      newList = new LinkedListBase(valueOrNode);
    }
    return newList;
  }


  contains(target) {
    return this._lzStore.contains(target);
  }

  traverse(cb) {
    this._lzStore.toArray().forEach(cb);
  }

  static generateLzStore(itemOrList) {
    return Array.isArray(itemOrList) ? IM.Seq(itemOrList) : IM.Seq([].concat(itemOrList));
  }

}
