import 'core-js/shim';
const IM = require('immutable');
const BSTNode = require('./BSTNode');


export default class BSTree {

  constructor(comparator, _root) {
    this._comparator = BSTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (BSTree.isBSTNode(_root)) {
      this._root = BSTree.cloneNode(_root);
      this._count = BSTree.recount(_root);
    }
    Object.freeze(this);
  }

  // returns the number of nodes in the tree
  get size() {
    return this._count;
  }

  // returns the key comparator for the tree
  get comparator() {
    return this._comparator;
  }

  // returns first node in sorted tree
  get root() {
    return this._root;
  }

  // returns node with smallest key in tree or null
  get min() {
    return BSTree.traverseSide('left', this);
  }

  // returns node with largest key in tree or null
  get max() {
    return BSTree.traverseSide('right', this);
  }

  // returns an array of all the keys in the tree
  get keys() {
    let keys = [];
    this.forEach(node => keys.push(node.key));
    return keys;
  }

  // returns an array of all the values in the tree
  get values() {
    let values = [];
    this.forEach(node => values.push(node.value));
    return values;
  }

  // returns a new BST with the key-value pair inserted
  insert(key, value, selfBalance = false) {
    if (!key) return this;

    if (!this.size) {
      return new BSTree(this.comparator, new BSTNode(key, value, null, null, 1), 1);
    }

    let finalTree,
        searchArgs = [],
        [node, ancestors] = BSTree.recursiveSearch(this.comparator, this.root, key);

    node = node ? new BSTNode(node._store.set('_value', value)) :
                  new BSTNode(key, value, null, null, this.size + 1);

    // reconstruct tree from leaf node
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new BSTNode(parentNode._store.set(childSide, node));
    }

    finalTree = new BSTree(this.comparator, node);
    return selfBalance ? this.balanceTree(finalTree) : finalTree;
  }

  // returns a new BST post removal of node with matching key
  remove(key) {

  }

  // returns BSTNode or null
  // O(log n)
  find(key) {
    return BSTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  // returns value or null
  get(key) {
    let [search,] = BSTree.recursiveSearch(this.comparator, this.root, key);
    return !search ? null : search.value;
  }

  // returns true or false
  // O(n)
  contains(value) {
    return this.values.indexOf(value) > -1;
  }

  // returns undefined, applies callback to nodes in-order
  forEach(callback) {
    BSTree.traverseInOrder(this.root, callback);
  }

  // returns a new BST with the list's key-value pairs inserted
  insertAll(listToInsert, selfBalance = false) {
    // iterate list and insert each item into BST (mutative)
      // if selfBalance, balance tree after each insertion
    // return the new BST
  }

  // returns a balanced BST
  balanceTree() {

  }

  // returns the given comparator or the default comparator function
  static setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : BSTree.defaultComp;
  }

  // based on default comparison criteria - returns -1, 1, or 0
  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  // returns true if maybe is a BSTNode
  static isBSTNode(maybe) {
    return !!maybe && maybe.constructor === BSTNode;
  }

  // returns new BSTNode clone of input node
  static cloneNode(node) {
    return new BSTNode(node.key, node.value, node.left, node.right, node.id);
  }

  static recount(_root) {
    let count = 0;
    BSTree.traverseInOrder(_root, () => count++);
    return count;
  }

  // returns node or null
  static findInOrderPredecessor() {

  }

  // returns node or null
  static findInOrderSuccessor() {

  }

  // recursively traverses tree nodes in-order and applies cb to each node
  static traverseInOrder(node, cb) {
    if (!node) return;
    let left = node.left, right = node.right;
    if (left) BSTree.traverseInOrder(left, cb);
    cb(node);
    if (right) BSTree.traverseInOrder(right, cb);
  }

  // returns the leaf BSTNode furthest down a given side, or null
  static traverseSide(side, tree) {
    let currentRoot = tree.root;
    if (!currentRoot) return null;
    let nextNode = currentRoot[side];
    while (nextNode) {
      currentRoot = nextNode;
      nextNode = nextNode[side];
    }
    return currentRoot;
  }

  // returns node with matching key or null
  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (!node) return [null, ancestorStack];
    let comparisons = comparator(node.key, key);
    if (comparisons === -1) {
      ancestorStack.push(['_right', node])
      return BSTree.recursiveSearch(comparator, node.right, key, ancestorStack);
    } else if (comparisons === 1) {
      ancestorStack.push(['_left', node])
      return BSTree.recursiveSearch(comparator, node.left, key, ancestorStack);
    } else {
      return [node, ancestorStack];
    }
  }

}
