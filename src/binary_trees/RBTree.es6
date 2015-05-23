jest.autoMockOff();
const IM = require('immutable');
let BSTree = require('./BSTree');
let RBNode = require('./RBNode');
let __BLACK = "__@@__BLACK__@@__";
let __RED = "__@@__RED__@@__";
debugger;
let __NULL_REFERENCE = new RBNode(null, null, null, null, null, __BLACK);

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

  static get _nil() {
    debugger;
    return __NULL_REFERENCE;
  }

  static get B() {
    return __BLACK;
  }

  static get R() {
    return __RED;
  }
}
