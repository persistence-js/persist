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
    if (key === undefined) {
      return this.clone();
    } else if (!this.size) {
      return new BSTree(this.comparator, new BSTNode(key, value, null, null, 1), 1);
    } else {
      let finalTree, node, ancestors;
      [node, ancestors] = BSTree.recursiveSearch(this.comparator, this.root, key);
      node = node ? new BSTNode(node._store.set('_value', value)) :
                    new BSTNode(key, value, null, null, this.size + 1);
      finalTree = new BSTree(this.comparator, BSTree.constructFromLeaf(node, ancestors));
      return selfBalance ? BSTree.balanceTree(finalTree) : finalTree;
    }
  }

  // returns a new BST post removal of node with matching key
  remove(key, selfBalance = false) {
    let [node, ancestors] = BSTree.recursiveSearch(this.comparator, this.root, key);
    if (!this.size || key === undefined || !node) {
      return this.clone();
    } else if (node) {
      return BSTree.removeFound(this.comparator, node, ancestors, selfBalance);
    }
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
  insertAll(listToInsert = [], selfBalance = false) {
    let resultTree = this;
    listToInsert.forEach(pair => {
      resultTree = resultTree.insert(pair[0], pair[1], selfBalance);
    });
    return resultTree;
  }

  clone() {
    return new BSTree(this.comparator, this.root);
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

  static findInOrderPredecessor(leftChild) {
    let currentIop = leftChild,
        ancestors = [];
    while (currentIop.right) {
      ancestors.push(['_right', currentIop]);
      currentIop = currentIop.right;
    }
    return [ancestors, currentIop];
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

  static removeNoChildren(node, ancestors) {
    if (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new BSTNode(parentNode._store.set(childSide, null));
    }
    return BSTree.constructFromLeaf(node, ancestors)
  }

  static removeOneChild(node, ancestors) {
    let childNode = node.children[0][1];
    if (!ancestors.length) {
      return childNode;
    } else {
      let [childSide, parentNode] = ancestors.pop(),
          leaf = new BSTNode(parentNode._store.set(childSide, childNode));
      return BSTree.constructFromLeaf(leaf, ancestors);
    }
  }

  static removeTwoChildren(comparator, node, ancestors, selfBalance = false) {
    let [rightAncestors, iop] = BSTree.findInOrderPredecessor(node.left);
    let iopReplacementStore = iop.store.withMutations(_store => {
      _store.set('_key', node.key).set('_value', node.value).set('_id', node.id);
    });
    let targetReplacementStore = node.store.withMutations(_store => {
      _store.set('_key', iop.key)
            .set('_value', iop.value)
            .set('_id', iop.id)
            .set('_left', new BSTNode(iopReplacementStore));
    });
    let newIopNode = new BSTNode(targetReplacementStore);
    ancestors = ancestors.concat([['_left', newIopNode]], rightAncestors);
    return BSTree.removeFound(comparator, newIopNode.left, ancestors, selfBalance);
  }

  static removeFound(comparator, node, ancestors, selfBalance = false) {
    let finalTree;
    switch (node.children.length) {
      case 1:
        finalTree = new BSTree(comparator, BSTree.removeOneChild(node, ancestors));
        break;
      case 2:
        finalTree = BSTree.removeTwoChildren(comparator, node, ancestors, selfBalance);
        break;
      default:
        finalTree = new BSTree(comparator, BSTree.removeNoChildren(node, ancestors));
        break;
    }
    return selfBalance ? BSTree.balanceTree(finalTree) : finalTree;
  }

  static constructFromLeaf(node, ancestors) {
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new BSTNode(parentNode._store.set(childSide, node));
    }
    return node;
  }

  // returns a balanced BST
  static balanceTree(tree) {
    let mid = Math.floor(tree.size / 2),
        keys = tree.keys,
        values = tree.values,
        midKey = keys[mid],
        midValue = values[mid],
        balanced = new BSTree(tree.comparator, new BSTNode(midKey, midValue, null, null, 1)),
        left  = mid - 1,
        right = mid + 1;
    while (left >= 0 || right < tree.size) {
      let leftKey = keys[left],
          leftValue = values[left],
          rightKey = keys[right],
          rightValue = values[right];
      if (leftKey !== undefined) {
        balanced = balanced.insert(leftKey, leftValue);
        left -= 1;
      }
      if (rightKey !== undefined) {
        balanced = balanced.insert(rightKey, rightValue);
        right += 1;
      }
    }
    return balanced;
  }

}
