const IM = require('immutable');
let BSTree = require('./BSTree');
// let RBNode = require('./RBNode');
import { RBNode } from './RBNode';
export const _NULL_SENTINEL = new RBNode(null, null, null, null, null, 1);
export class RBTree extends BSTree {

  constructor() {
    super();
    // this._nil = __NULL_REF;
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

}
