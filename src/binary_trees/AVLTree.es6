import 'core-js/shim';
const IM = require('immutable');
const AVLNode = require('./AVLNode');
const _NULL_SENTINEL = new AVLNode(null, null, null, null, 0);

export default class AVLTree {

  constructor(comparator, _root, _size = 0, _rebalanceCount = 0) {
    this._comparator = AVLTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    this._rebalanceCount = _rebalanceCount;
    if (AVLTree.isAVLNode(_root)) {
      this._root = AVLNode.cloneNode(_root);
      this._count = (_size > 0) ? _size : AVLTree.recount(_root);
      this._rebalanceCount = _rebalanceCount;
    }
    Object.freeze(this);
  }

  get comparator() {
    return this._comparator;
  }

  get root() {
    return this._root;
  }

  get size() {
    return this._count;
  }

  get rebalanceCount() {
    return this._rebalanceCount;
  }

  get height() {
    return this.root ? this.root.height : 0;
  }

  get min() {
    return AVLTree.traverseSide('left', this);
  }

  get max() {
    return AVLTree.traverseSide('right', this);
  }

  get keys() {
    let keys = [];
    this.forEach(node => keys.push(node.key));
    return keys;
  }

  get values() {
    let values = [];
    this.forEach(node => values.push(node.value));
    return values;
  }

  find(key) {
    return AVLTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  get(key) {
    let [searchResult,] = AVLTree.recursiveSearch(this.comparator, this.root, key);
    return !search ? null : search.value;
  }

  contains(value) {
    return this.values.indexOf(value) > -1;
  }

  forEach(callback) {
    AVLTree.traverseInOrder(this.root, callback);
  }

  clone() {
    return new AVLTree(this.comparator, this.root, this.size, this.rebalanceCount);
  }

  insert(key, value) {
    if (key === undefined) {
      throw new Error('Cannot insert data into AVLTree without a key');
    } else if (!this.size) {
      return new AVLTree(this.comparator, new AVLNode(key, value, AVLTree.nullPointer, AVLTree.nullPointer, 1));
    } else {
      let newStack;
      let [newNode, ancestorStack] = AVLTree.recursiveSearch(this.comparator, this.root, key);
      if (newNode) {
        newNode = new AVLNode(newNode._store.set('_value', value));
        newStack = [newNode, ancestorStack];
      } else {
        newNode = new AVLNode(key, value, AVLTree.nullPointer, AVLTree.nullPointer);
        newStack = AVLTree.updateAndBalance(newNode, ancestorStack, this.rebalanceCount);
      }
      return new AVLTree(this.comparator, AVLTree.constructFromLeaf(newStack[0], newStack[1]), this.size + 1, newStack[2]);
    }
  }

  static updateAndBalance(newNode, ancestors, rebalanceCount) {
    // base-case: at root and all balanced
    if (!ancestors.length) return [newNode, [], rebalanceCount];
    // get last ancestor as parent and side of child
    let [childSide, parent] = ancestors.pop();
    // set side of parent to the new node and increment height
    let updatedParentStore = parent._store.withMutations(map => {
      let childDir;
      if (childSide === '_left') {
        childDir = '_right';
      } else if (childSide === '_right') {
        childDir = '_left';
      }
      let newHeight = Math.max(newNode._store.get('_height') + 1, map.get(childDir)._store.get('_height') + 1, 1);
      map.set(childSide, newNode).set('_height', newHeight);
      return map;
    });
    let updatedParentToCheck = new AVLNode(updatedParentStore);
    newNode = updatedParentToCheck;
    // check balance of updated parent
    if (updatedParentToCheck.balance > 1) {
      // addition of child node made parent too fat, R heavy
      if (updatedParentToCheck.right.balance < 0) {
        // LR Case //
        // perform right rotation on right, then left rotation on parent
        let newRightNode = AVLTree.rotateRight(updatedParentToCheck.right);
        let newParent = new AVLNode(updatedParentToCheck._store.set('_right', newRightNode));
        newNode = AVLTree.rotateLeft(newParent);
      } else {
        // LL Case //
        // perform single left rotation
        newNode = AVLTree.rotateLeft(updatedParentToCheck);
      }
      rebalanceCount++;
    } else if (updatedParentToCheck.balance < -1) {
      // addition of child node made parent too fat, L heavy
      if (updatedParentToCheck.left.balance > 0) {
        // RL Case //
        // perform left rotation on left, then right rotation on parent
        let newLeftNode = AVLTree.rotateLeft(updatedParentToCheck.left);
        let newParent = new AVLNode(updatedParentToCheck._store.set('_left', newLeftNode));
        newNode = AVLTree.rotateRight(newParent);
      } else {
        // RR Case //
        // perform single right rotation
        newNode = AVLTree.rotateRight(updatedParentToCheck);
      }
      rebalanceCount++;
    }
    // return recursive call with parent as newNode, updated ancestors, and rebalanceCount
    return AVLTree.updateAndBalance(newNode, ancestors, rebalanceCount);
  }

  static rotateRight(node) {
    let newLeft = node.left.right._store ? new AVLNode(node.left.right._store) : AVLTree.nullPointer;
    let oldRoot = new AVLNode(node._store.withMutations(map => {
      map.set('_left', newLeft)
         .set('_height', Math.max(node.left.right.height + 1, node.right.height + 1, 1));
      return map;
    }));
    return new AVLNode(node.left._store.withMutations(map => {
      map.set('_right', new AVLNode(oldRoot._store))
         .set('_height', Math.max(map.get('_left').height + 1, map.get('_right').height + 1, 1));
      return map;
    }));
  }

  static rotateLeft(node) {
    let newRight = node.right.left._store ? new AVLNode(node.right.left._store) : AVLTree.nullPointer;
    let oldRoot = new AVLNode(node._store.withMutations(map => {
      map.set('_right', newRight)
         .set('_height', Math.max(node.right.left.height + 1, node.left.height + 1, 1));
      return map;
    }));
    return new AVLNode(node.right._store.withMutations(map => {
      map.set('_left', new AVLNode(oldRoot._store))
         .set('_height', Math.max(map.get('_right').height + 1, map.get('_left').height + 1, 1));
      return map;
    }));
  }

  insertAll(tuples = []) {
    let resultTree = this;
    tuples.forEach(tuple => {
      resultTree = resultTree.insert(tuple[0], tuple[1]);
    });
    return resultTree;
  }

  remove(key) {

  }

  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  static setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : AVLTree.defaultComp;
  }

  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (node === AVLTree.nullPointer || node === null) return [null, ancestorStack];
    switch (comparator(node.key, key)) {
      case -1:
        return AVLTree.recursiveSearch(comparator, node.right, key, ancestorStack.concat([['_right', node]]));
        break;
      case 1:
        return AVLTree.recursiveSearch(comparator, node.left, key, ancestorStack.concat([['_left', node]]));
        break;
      default:
        return [node, ancestorStack];
        break;
    }
  }

  static constructFromLeaf(node, ancestors) {
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new AVLNode(parentNode._store.set(childSide, node));
    }
    return node;
  }

  static traverseSide(side, tree) {
    let currentRoot = tree.root;
    if (!currentRoot) return null;
    let nextNode = currentRoot[side];
    while (nextNode && nextNode !== AVLTree.nullPointer) {
      currentRoot = nextNode;
      nextNode = nextNode[side];
    }
    return currentRoot;
  }

  static recount(_root) {
    let count = 0;
    AVLTree.traverseInOrder(_root, () => count++);
    return count;
  }

  static traverseInOrder(node, cb) {
    if (node === AVLTree.nullPointer || node === null) return;
    let left = node.left, right = node.right;
    if (left !== AVLTree.nullPointer) AVLTree.traverseInOrder(left, cb);
    cb(node);
    if (right !== AVLTree.nullPointer) AVLTree.traverseInOrder(right, cb);
  }

  static get nullPointer() {
    return _NULL_SENTINEL;
  }

  static isAVLNode(maybe) {
    return !!maybe && maybe.constructor === AVLNode;
  }

}
