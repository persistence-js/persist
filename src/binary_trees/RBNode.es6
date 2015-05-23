jest.autoMockOff();
const IM = require('immutable');
let BSTNode = require('./BSTNode');

export default class RBNode extends BSTNode {
  constructor(key, value, left, right, id) {
    super(key, value, left, right, id);
    this.color = RBNode.R;
  }

  static get R() {
    return 0;
  }

  static get B() {
    return 1;
  }
}
