import 'core-js/shim';
const IM = require('immutable');
const BSTNode = require('./BSTNode');

export default class BinarySearchTree {

  constructor(comparator, rootStore = null) {
    let isComparator = (!!comparator && typeof comparator === 'function');
    this._comparator = isComparator ? comparator : BinarySearchTree.defaultComp;
    this._rootStore = (!!rootStore && IM.Seq.isSeq(rootStore)) ? new IM.Seq(rootStore) : new IM.Seq();
    this._rootStore = BinarySearchTree.sortStorage(this._comparator, this._rootStore);
    Object.freeze(this);
  }

  /////////////////////////////
  /* Public Instance Methods */
  /////////////////////////////

  // returns a new BST with the key-value pair inserted
  insert(key, value) {

  }

  // returns a new BST with the list's key-value pairs inserted
  insertAll(listToInsert, preSort, postSort) {
    // if presort, sort the keys then insert in sorted-key order
    // iterate list and insert each item into BST (mutative)
    // if postsort, sortStorage
      // return new BST out of sorted storage
    // else just return the new BST
  }

  // returns a new BST post removal of node with matching key
  remove(key) {

  }

  // returns value or null
  get(key) {

  }

  // returns BSTNode or null
  find(key) {

  }

  // returns true or false
  contains(value) {

  }

  // returns undefined, applies callback to nodes in-order
  forEach(callback) {

  }

  // returns undefined, applies callback to nodes in depth-first order
  traverseDF(callback) {

  }

  // returns undefined, applies callback to nodes in breadth-first order
  traverseBF(callback) {

  }

  //////////////////////
  /* Built-in Getters */
  //////////////////////

  // returns the number of nodes in the tree
  get size() {
    return this._rootStore.size;
  }

  // returns an array of all the keys in the tree
  get keys() {
    return this._rootStore.map(node => node.key).toArray();
  }

  // returns an array of all the values in the tree
  get values() {
    return this._rootStore.map(node => node.value).toArray();
  }

  // returns first node in sorted tree
  get root() {
    return this._rootStore.first() || null;
  }

  // returns node with smallest key in tree or null
  get min() {

  }

  // returns node with largest key in tree or null
  get max() {

  }

  ////////////////////
  /* Static Methods */
  ////////////////////

  static defaultComp(keyA, keyB) {
    if (keyA > keyB) return 1;
    else if (keyA < keyB) return -1;
    else return 0;
  }

  // returns a sorted rootStore seq based on comparator
  static sortStorage(comparator = BinarySearchTree.defaultComp, rootStore) {
    if (!IM.Seq.isSeq(rootStore)) throw new Error('root store must be an immutable sequence in order to sort');
    return rootStore.sortBy(bstNode => bstNode.key, comparator);
  }

  // returns node or null
  static findInOrderPredecessor() {

  }

  // returns node or null
  static findInOrderSuccessor() {

  }

  /////////////////////
  /* Private Methods */
  /////////////////////

}
