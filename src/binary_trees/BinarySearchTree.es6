import 'core-js/shim';
const IM = require('immutable');
const BSTNode = require('./BSTNode');


export default class BinarySearchTree {

  constructor(comparator, _root, _count) {
    let isComparator = !!comparator && typeof comparator === 'function';
    this._comparator = isComparator ? comparator : BinarySearchTree.defaultComp;
    if (BinarySearchTree.isBSTNode(_root)) {
      this._root = BinarySearchTree.cloneNode(_root);
      this._count = this._root.id;
    } else {
      this._root = null;
      this._count = 0;
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

  // returns first node in sorted tree
  get root() {
    return this._root;
  }

  // returns node with smallest key in tree or null
  get min() {
    return BinarySearchTree.traverseSide('left', this.root);
  }

  // returns node with largest key in tree or null
  get max() {
    return BinarySearchTree.traverseSide('right', this.root);
  }

  // returns a new BST with the key-value pair inserted
  insert(key, value) {

  }

  // returns a new BST with the list's key-value pairs inserted
  insertAll(listToInsert, selfBalance = false) {
    // iterate list and insert each item into BST (mutative)
      // if selfBalance, balance tree after each insertion
    // return the new BST
  }

  // returns a new BST post removal of node with matching key
  remove(key) {

  }

  // returns BSTNode or null
  // O(log n)
  find(key) {
    return BinarySearchTree.recursiveSearch(this.comparator, this.root, key);
  }

  // returns value or null
  get(key) {
    let search = BinarySearchTree.recursiveSearch(this.comparator, this.root, key);
    return !search ? null : search.value;
  }

  // returns true or false
  // O(n)
  contains(value) {
    return this.values.indexOf(value) > -1;
  }

  // returns undefined, applies callback to nodes in-order
  forEach(callback) {
    BinarySearchTree.traverseInOrder(this.root, callback);
  }

  // based on default comparison criteria - returns -1, 1, or 0
  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  // returns new BSTNode clone of input node
  static cloneNode(node) {
    return new BSTNode(node.key, node.value, node.left, node.right, node.id);
  }

  // returns node or null
  static findInOrderPredecessor() {

  }

  // returns node or null
  static findInOrderSuccessor() {

  }

  // returns true if maybe is a BSTNode
  static isBSTNode(maybe) {
    return !!maybe && maybe.constructor === BSTNode;
  }

  static traverseInOrder(node, cb) {
    if (!node) return;
    let left = node.left, right = node.right;
    if (left) BinarySearchTree.traverseInOrder(left, cb);
    cb(node);
    if (right) BinarySearchTree.traverseInOrder(right, cb);
  }

  // returns the leaf BSTNode furthest down a given side, or null
  static traverseSide(side, currentRoot) {
    if (!currentRoot) return null;
    let nextNode = currentRoot.store.get('_' + side);
    while (nextNode) currentRoot = nextNode.store;
    return currentRoot;
  }

  // returns node with matching key or null
  static recursiveSearch(comparator, node, key) {
    if (!node) return null;
    let comparisons = comparator(node.key, key);
    if (comparisons === -1) return BinarySearchTree.recursiveSearch(comparator, node.right, key);
    else if (comparisons === 1) return BinarySearchTree.recursiveSearch(comparator, node.left, key);
    else return node;
  }

}
