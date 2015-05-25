const IM = require('immutable');
let BSTree = require('./BSTree');
let RBNode = require('./RBNode').RBNode;
debugger;
// import { RBNode } from './RBNode';
export const _NULL_SENTINEL = new RBNode(null, null, null, null, null, 1);
export class RBTree extends BSTree {

  constructor() {
    super();
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

  static getNull() {
    debugger;
    return _NULL_SENTINEL;
  }
}
