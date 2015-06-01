const IM = require('immutable');
const RBNode = require('./RBNode');
// import {RBNode} from './RBNode';
const _NULL_SENTINEL = new RBNode(null, null, null, null, null, 1);
export default class RBTree {//RBTree

  constructor(comparator, _root) {
    this._comparator = BSTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (BSTree.isBSTNode(_root)) {
      this._root = BSTree.cloneNode(_root);
      this._count = BSTree.recount(_root);
    }
    Object.freeze(this);
  }

  /**
   * Accepts a root node and key.
   * Will return an object, containing either the found node,
   * or the ancestor stack for the node, were it to be inserted...
   * @return {[type]} [Node, or stack]
   */
  static stackSearch() {

  }

  static repaintNode(node) {

  }

  static rotateLeft() {

  }

  static rotateRight() {

  }

  /*
  Called by rotateLeft and rotateRight.
  Accepts a node, rotates it left or right.
   */
  static rotate() {

  }

  static get nullPointer() {
    return _NULL_SENTINEL;
  }
}