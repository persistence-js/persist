import 'core-js/shim';
var IM = require('immutable'),
    LinkedListBase = require('./LinkedListBase');

export default class DLinkedList extends LinkedListBase {

  constructor(itemOrList = []) {
    super(itemOrList);
  }

  insertBefore(baseNode, newNode) {
    let baseNodeIdx = this._findNodeIdx(baseNode);
    return this._insert(baseNodeIdx, newNode, (v, k) => k === baseNodeIdx);
  }

  insertAfter(baseNode, newNode) {
    let baseNodeIdx = this._findNodeIdx(baseNode);
    return this._insert(baseNodeIdx, newNode, (v, k) => k > baseNodeIdx);
  }

  traverseBackwards(cb) {
    this._lzStore.toArray().reverse().forEach(cb);
  }

  _findNodeIdx(targetNode) {
    return this._lzStore.findEntry((v, k) => IM.is(v, targetNode))[0];
  }

  _insert(baseNodeIdx, newNode, cb) {
    let lists = this._createLists(baseNodeIdx, newNode, cb);
    return new DLinkedList(this._combineLists(lists.leftList, lists.rightList));
  }

  _createLists(baseNodeIdx, newNode, cb) {
    return {
      leftList: this._sliceLeft(cb).concat(newNode),
      rightList: this._lzStore.skipUntil(cb),
    };
  }

  _combineLists(leftList, rightList) {
    return leftList.concat(rightList).toArray();
  }

  _sliceLeft(cb) {
    return this._lzStore.takeUntil(cb);
  }

}
