import 'core-js/shim';
var IM = require('immutable');

export default class LinkedListBase {

  constructor(itemOrList = []) {
    this._lzStore = LinkedListBase.generateLzStore(itemOrList);
  }

  get store() {
    return this._lzStore.toJS();
  }

  get head() {
    return this._lzStore.first() || null;
  }

  get tail() {
    return this._lzStore.last() || null;
  }

  get size() {
    return this._lzStore.size;
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

  removeHead() {
    return new LinkedListBase(this._lzStore.rest().toJS());
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
