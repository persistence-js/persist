import 'core-js/shim';
const IM = require('immutable');
const AVLNode = require('./AVLNode');


export default class AVLTree {

  constructor(comparator, _root, _size = 0, _rebalanceCount = 0) {
    this._comparator = this.setComparator(comparator);
    this._size = _size;
    this._rebalanceCount = _rebalanceCount;
    if (Array.isArray(_root)) {
      this._root = this.constructRoot(_root);
    } else {
      if (AVLNode.isAVLNode(_root)) {
        this._root = AVLNode.cloneNode(_root);
        this._size = _size || 1;
        this._rebalanceCount = _rebalanceCount;
      } else {
        this._root = null;
      }
    }
    Object.freeze(this);
  }

  get comparator() {
    return this._comparator || AVLTree.defaultComp();
  }

  get root() {
    return this._root;
  }

  get size() {
    return this._size || 0;
  }

  get rebalanceCount() {
    return this._rebalanceCount || 0;
  }

  get height() {
    return this.root ? this.root.height : 0;
  }

  get min() {

  }

  get max() {

  }

  get keys() {

  }

  get values() {

  }

  find(key) {
    return AVLTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  get(key) {

  }

  contains(value) {

  }

  forEach() {

  }

  clone() {
    return new AVLTree(this.comparator, this.root, this.size, this.rebalanceCount);
  }

  setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : AVLTree.defaultComp;
  }

  // returns new root node after insertion of list items
  // rebalances and freezes after all mutations
  constructRoot(list) {

  }

  insert(key, value) {
    if (key === undefined) throw new Error('Cannot insert data into AVLTree without a key');
    if (!this.root) return new AVLTree(this.comparator, new AVLNode(key, value), 1);
    let [nodeMatch, ancestorStack] = AVLTree.recursiveSearch(this.comparator, this.root, key);
    return !nodeMatch ? this.addChild(this.root, key, value, ancestorStack) : this.clone();
  }

  addChild(parentNode, key, value, ancestorStack = []) {
    let newRoot,
        balanceData = {},
        comparisons = this.comparator(parentNode.key, key);

    switch (comparisons) {
      case 1:
        if (!parentNode.left) {
          [newRoot, balanceData] = AVLTree.constructFromLeaf(new AVLNode(key, value), ancestorStack);
          if (balanceData.heavyNode) {
            return AVLTree.rebalance(balanceData, this.comparator, this.size, this.rebalanceCount);
          } else {
            return new AVLTree(this.comparator, newRoot, this.size + 1);
          }
        } else {
          return this.addChild(parentNode.left, key, value, ancestorStack);
        }
        break;
      case -1:
        if (!parentNode.right) {
          [newRoot, balanceData] = AVLTree.constructFromLeaf(new AVLNode(key, value), ancestorStack);
          if (balanceData.heavyNode) {
            return AVLTree.rebalance(balanceData, this.comparator, this.size, this.rebalanceCount);
          } else {
            return new AVLTree(this.comparator, newRoot, this.size + 1);
          }
        } else {
          return this.addChild(parentNode.right, key, value, ancestorStack);
        }
        break;
    }
  }

  // inserts key-value pairs one-by-one, utilizes #withMutations
  // for efficiency and overhead reduction
  // returns new tree
  insertAll(tuples) {

  }

  remove(key) {

  }

  verify() {

  }

  resetHeights() {

  }

  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (!node) return [null, ancestorStack];
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
    let toRebalance = null,
        counter = 0,
        toBalanceStack;
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      parentNode.store.withMutations(pStore => {
        pStore.set(childSide, node).set('_height', node.height + 1);
        node = new AVLNode(pStore);
        if ((node.balance < -1 || node.balance > 1) && counter++ === 0) {
          toRebalance = node;
          toBalanceStack = ancestors.slice();
        }
      });
    }
    return [node, { heavyNode: toRebalance, unbalancedParents: toBalanceStack }];
  }

  static rebalance(balanceData, comparator, size, rebalanceCount) {
    let rbCount = rebalanceCount + 1,
        {heavyNode, unbalancedParents} = balanceData;

    if (heavyNode.balance > 1) {
      // right heavy node
      if (heavyNode.right.balance < -1) {
        // left heavy right child, perform double left rotation
      } else {
        // right heavy right child, perform single left rotation
        let newRoot = AVLTree.rotateLeft(heavyNode);
        let [side, parent] = unbalancedParents.pop();
        while (parent) {
          newRoot = new AVLNode(parent.store.set(side, newRoot));
          let tuple = unbalancedParents.pop();
          if (!tuple) break;
          [side, parent] = tuple;
        }
        return new AVLTree(comparator, newRoot, size + 1, rbCount);
      }
    } else if (heavyNode.balance < -1) {
      // left heavy node
      if (heavyNode.left.balance > 1) {
        // right heavy left child, perform double right rotation
      } else {
        // left heavy left child, perform single right rotation
        let newRoot = AVLTree.rotateRight(heavyNode);
        // let [side, parent] = unbalancedParents.pop();
        // while (parent) {
          // newRoot = new AVLNode(parent.store.set(side, newRoot));
          // let tuple = unbalancedParents.pop();
          // if (!tuple) break;
          // [side, parent] = tuple;
        // }
        // return new AVLTree(comparator, newRoot, size + 1, rbCount);
      }
    }
  }

  static rotateLeft(heavyNode) {
    let rightChild = heavyNode.right;
    let rightChildLeft = rightChild.left || null;
    let newLeftChild = new AVLNode(heavyNode.store.withMutations(store => {
      let temp = store.set('_right', rightChildLeft);
      let leftHeight = temp.get('_left') ? temp.get('_left').height : 0;
      let rightHeight = temp.get('_right') ? temp.get('_right').height : 0;
      let maxHeight = Math.max(leftHeight, rightHeight, 1);
      return temp.set('_height', maxHeight);
    }));
    return new AVLNode(rightChild.store.set('_left', newLeftChild));
  }

  static rotateRight(heavyNode) {
    let leftChild = heavyNode.left;
    let leftChildRight = leftChild.right || null;
    let newRightChild = new AVLNode(heavyNode.store.withMutations(store => {
      let temp = store.set('_left', leftChildRight);
      let leftHeight = temp.get('_left') ? temp.get('_left').height : 0;
      let rightHeight = temp.get('_right') ? temp.get('_right').height : 0;
      let maxHeight = Math.max(leftHeight, rightHeight, 1);
      return temp.set('_height', maxHeight);
    }));
    return new AVLNode(leftChild.store.set('_right', newRightChild));
  }

}
