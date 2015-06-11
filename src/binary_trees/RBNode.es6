const IM = require('immutable');

export default class RBNode { //RBNode
  constructor(key, value, left, right, id, color = RBNode.__RED) {
    if (IM.Map.isMap(key)) {
      this._store = key;
    } else {
      this._store = IM.Map({ 
        '_key': key,
        '_value': value,
        '_left': left, 
        '_right': right, 
        '_id': id, 
        '_color': color
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

  get isLeaf() {
    return !!(this.children.length === 0);
  }

  get children() {
    let children = [];
    if (this.left) children.push(['_left', this.left]);
    if (this.right) children.push(['_right', this.right]);
    return children;
  }

  get color() {
    return this.store.get('_color');
  }

  static get __RED() {
    return "__@@__RED__@@__";
  }

  static get __BLACK() {
    return "__@@__BLACK__@@__";
  }

  static get __DBLACK() {
    return "__@@__DOBULE_BLACK__@@__";
  }

  static switchColor(color) {
    return (color === RBNode.__Red) ? RBNode.__Red : RBNode.__Black;
  }
}
