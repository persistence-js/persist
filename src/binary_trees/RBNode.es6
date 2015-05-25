const IM = require('immutable');
let BSTNode = require('./BSTNode');
export const B = "__@@__BLACK__@@__";
export const R = "__@@__RED__@@__";

export class RBNode extends BSTNode {
  constructor(key, value, left, right, id, color = 0) {
    super(key, value, left, right, id, true);
    this.color = (!!color) ? RBNode.B : RBNode.R;
  }
}
