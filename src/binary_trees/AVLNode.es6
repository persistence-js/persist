import 'core-js/shim';
const IM = require('immutable');


export default class AVLNode {

  constructor(key, value, left = null, right = null, height = 1) {
    if (IM.Map.isMap(key)) {
      this._store = key;
    } else {
      this._store = IM.Map({
        '_key': key,
        '_value': value,
        '_left': left,
        '_right': right,
        '_height': height
      });
    }
  }

  get store() {
    return this._store;
  }

  get key() {
    return this.store.get('_key');
  }

  get value() {
    return this.store.get('_value');
  }

  get left() {
    return this.store.get('_left', null);
  }

  get right() {
    return this.store.get('_right', null);
  }

  get id() {
    return this.store.get('_id');
  }

  get height() {
    return this.store.get('_height');
  }

  get balance() {
    let leftHeight = this.left ? this.left.height : 0;
    let rightHeight = this.right ? this.right.height : 0;
    return rightHeight - leftHeight;
  }

  get children() {
    let children = [];
    if (this.left) children.push(['_left', this.left]);
    if (this.right) children.push(['_right', this.right]);
    return children;
  }

  get isLeaf() {
    return this.height === 1;
  }

  static cloneNode(node) {
    return new AVLNode(node.key, node.value, node.left, node.right, node.height);
  }

}
