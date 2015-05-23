jest.autoMockOff();
const IM = require('immutable');
let BSTNode = require('./BSTNode');

export default class RBNode extends BSTNode {
  constructor(key, value, left, right, id, color) {
    super(key, value, left, right, id, true);
    this.color = RBNode.R;

    //Freeze?
  }

  static get R() {
    return 0;
  }

  static get B() {
    return 1;
  }
}
