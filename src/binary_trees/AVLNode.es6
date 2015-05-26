import 'core-js/shim';
const IM = require('immutable');


export default class AVLNode {

  constructor(key, value, left = null, right = null, height = 1) {
    if (key === undefined) throw new Error('AVLNode must have defined key');
    else if (AVLNode.isAVLNode(key)) return key;
    else if (IM.Map.isMap(key)) this._store = key;
    else {
      this._store = IM.Map({
        '_key': key,
        '_value': value,
        '_left': left,
        '_right': right,
        '_height': height
      });
    }
    Object.freeze(this);
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
    return this.store.get('_left');
  }

  get right() {
    return this.store.get('_right');
  }

  get height() {
    return this.store.get('_height');
  }

  get balance() {
    let leftHeight = this.left ? this.left.height : 0;
    let rightHeight = this.right ? this.right.height : 0;
    return rightHeight - leftHeight;
  }

  isLeaf() {
    return this.height === 1;
  }

  static isAVLNode(maybe) {
    return !!maybe && maybe.constructor === AVLNode;
  }

  static cloneNode(_node) {
    return new AVLNode(_node);
  }

}
