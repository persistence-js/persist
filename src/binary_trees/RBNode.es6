const IM = require('immutable');
let BSTNode = require('./BSTNode');

export class RBNode extends BSTNode {
  constructor(key, value, left, right, id, color = 0) {
    super(key, value, left, right, id, true);
    this.color = (!!color) ? RBNode.B : RBNode.R;

    //Freeze?
  }

  static get R() {
    return "__@@__BLACK__@@__";
  }

  static get B() {
    return "__@@__RED__@@__";
  }
}

