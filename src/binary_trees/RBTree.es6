const IM = require('immutable');
const RBNode = require('./RBNode');
const _NULL_SENTINEL = new RBNode(null, null, null, null, null, RBNode.__BLACK);
export default class RBTree {//RBTree

  constructor(comparator, _root) {
    this._comparator = RBTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (RBTree.isRBNode(_root)) {
      this._root = RBTree.cloneNode(_root);
      this._count = RBTree.recount(_root);
    }
    Object.freeze(this);
  }

  /**
   * Get the number of nodes in the tree
   * @return {[Number]} [count of all nodes]
   */
  get size() {
    return this._count;
  }

  /**
   * Get the key comparator function of the tree
   * @return {[Function]} [custom comparator, default if no custom comparator]
   */
  get comparator() {
    return this._comparator;
  }

  /**
   * Get the first node in tree
   * @return {[RBNode|null]} [root node, null if tree is empty]
   */
  get root() {
    return this._root;
  }

  /**
   * Get the node with the smallest key in tree in O(log n).
   * @return {[RBNode|null]} [min node, null if tree is empty]
   */
  get min() {
    return RBTree.traverseSide('left', this);
  }

  /**
   * Get the node with the largest key in tree in O(log n).
   * @return {[RBNode|null]} [max node, null if tree is empty]
   */
  get max() {
    return RBTree.traverseSide('right', this);
  }

  /**
   * Get all of the keys in tree in an ordered array in O(n).
   * @return {[Array]} [all the keys in the tree, ordered based on comparator]
   */
  get keys() {
    let keys = [];
    this.forEach(node => keys.push(node.key));
    return keys;
  }

  /**
   * Get all of the values in tree in a key-ordered array in O(n).
   * @return {[Array]} [all the values in the tree, ordered based on key comparison]
   */
  get values() {
    let values = [];
    this.forEach(node => values.push(node.value));
    return values;
  }

  /**
   * Returns a new tree with the key and value inserted.
   * @param {[*]} key [the key with which to store the value parameter]
   * @param {[*]} value [the value to store with key parameter]
   * @return {[RBTree]} [new BST with the key-value pair inserted]
   */
  insert(key, value) {
    if (key === undefined) {
      throw new Error ('Attempting to insert with undefined key.');
    } else if (!this.size) { //empty tree
      return new RBTree(this.comparator, new RBNode(key, value, RBTree.nullPointer, RBTree.nullPointer, 1, RBNode.__BLACK));
    } else {
      let [newNode, ancestors] = RBTree.recursiveSearch(this.comparator, this.root, key);
      let newStack;
      //save root node, and ancestors...
      //constructfromleaf...returns root node and ancestors..
      if (newNode) {//is a duplicate case
        newNode = new RBNode(newNode._store.set('_value', value));
        newStack = [newNode, ancestors]; 
        // RBTree.checkAndModifyStack(newNode, ancestors, ancestors.length);
      } else {
        //*** **** 
        //not duplicate...call checkInvariants, rotate, and repaint functions as needed...
        newNode = new RBNode(key, value, RBTree.nullPointer, RBTree.nullPointer, this.size + 1, RBNode.__RED);
        newStack = RBTree.checkAndModifyStack(newNode, ancestors, ancestors.length);
        //Modify stack here:
        //left and right rotations
        //repainting: 'pushing blackness down from a parent (newly rotated or not)'
        //high level invariant checking function needs to be recursive
      }
      return new RBTree(this.comparator, RBTree.constructFromLeaf(newStack[0], newStack[1]));
    }
  }

  static checkAndModifyStack(newNode, ancestors, indexOfNodeToCheck) {
    //expect indexOfNodeToCheck to exceed current ancestor stack, unless in a recursive call
    //
    if (ancestors[0][1].color !== RBNode.__BLACK){
      ancestors[0][1] = new RBNode(ancestors[0][1]._store.set('_color', RBNode.__BLACK));
      return [newNode, ancestors];
    }
    if (indexOfNodeToCheck <= 1){
      return [newNode, ancestors];
    }
    //each tuple in stack contains: [childSide, newNode]
    let nodeToCheck = (!ancestors[indexOfNodeToCheck]) ? newNode : ancestors[indexOfNodeToCheck][1]; 
    let parentIdx = (!ancestors[indexOfNodeToCheck]) ? ancestors.length-1 : indexOfNodeToCheck-1;
    let parent = ancestors[parentIdx][1];
    if (nodeToCheck.color === RBNode.__BLACK || parent.color === RBNode.__BLACK) {
      return [newNode, ancestors];
    }

    let grandparentIdx = (!ancestors[indexOfNodeToCheck]) ? ancestors.length-2 : indexOfNodeToCheck-2;
    let grandparent = ancestors[grandparentIdx][1];

    if (grandparent.color !== RBNode.__BLACK) {
      debugger;
      throw new Error("Grandparent should be black, tree invariant broken in earlier step!")
    }
    let uncle = (ancestors[grandparentIdx][0] === '_left') ? grandparent.right : grandparent.left;

    if (uncle.color === RBNode.__RED) {
      [newNode, ancestors] = RBTree.pushBlackness(newNode, ancestors, grandparentIdx);
      return RBTree.checkAndModifyStack(newNode, ancestors, grandparentIdx); 
      //after pushing blackness, GP is now red. must perform a final check, if grand-grand parent is red.
    } else {
      childSide = ancestors[parentIdx][0];
      parentSide = ancestors[grandparentIdx][0];

      if (childSide === '_right' && parentSide === '_left') {
        //Rotate Left, nodeToCheck:
        let tempChild = nodeToCheck;
        nodeToCheck = ancestors[parentIdx][1];
        //adjust nodeToCheck with WithMutations
        nodeToCheck = new RBNode(nodeToCheck._store.withMutations( (map) => {
          return map.set('_right',tempChild._store.get('_left'));
        }));
        //adjust tempChild with WithMutations, to point at completed nodeToCheck
        ancestors[parentIdx][1] = new RBNode(tempChild._store.withMutations( (map) => {
          return map.set('_left', nodeToCheck);
        }));
        ancestors[parentIdx][0] = parentSide;

        let newChildIdx = parentIdx+1;
        return RBTree.checkAndModifyStack(nodeToCheck, ancestors, newChildIdx);
      } else if (childSide === '_left' && parentSide === '_left') {
        //RotateRight, Parent:
        ancestors[parentIdx][1] = new RBNode(parent._store.withMutations( (map) => {
          map.set(
            '_right', 
            new RBNode(
              grandparent._store.withMutations( (newRight) => {
                return newRight.set('_left', map.get('_right')).set('_color', RBNode.__RED);
              })
            )
          );
          map.set('_color', RBNode.__BLACK);
          return map; 
        }));

        ancestors[parentIdx][0] = parentSide;
        ancestors.splice(grandparentIdx,1);
        let oldParentIdx = grandparentIdx; 
        //stack should now be 1 shorter, update indexOfNodeToCheck
        return RBTree.checkAndModifyStack(newNode, ancestors, oldParentIdx);
      } else if (childSide === '_right' && parentSide === '_right') {
        //rotate left, parent
        ancestors[parentIdx][1] = new RBNode(parent._store.withMutations( (map) => {
          map.set(
            '_left', 
            new RBNode(
              grandparent._store.withMutations( (newLeft) => {
                return newLeft.set('_right', map.get('_left')).set('_color', RBNode.__RED);
              })
            )
          );
          map.set('_color', RBNode.__BLACK);
          return map; 
        }));
        ancestors[parentIdx][0] = parentSide;
        ancestors.splice(grandparentIdx,1);
        //used to point at 2. now 2 points too far ahead, decrement 2 by 1. needs to point at 1
        let oldParentIdx = grandparentIdx; 
        return RBTree.checkAndModifyStack(newNode, ancestors, oldParentIdx);
      } else if (childSide === '_left' && parentSide === '_right') {
        //Rotate Right, nodeToCheck:
        let tempChild = nodeToCheck;
        //nodeToCheck takes parent's place in the stack
        nodeToCheck = ancestors[parentIdx][1];
        nodeToCheck = new RBNode(nodeToCheck._store.withMutations( (map) => {
          return map.set('_left',tempChild._store.get('_right'));
        }));
        ancestors[parentIdx][1] = new RBNode(tempChild._store.withMutations( (map) => {
          return map.set('_right', nodeToCheck);
        }));
        ancestors[parentIdx][0] = parentSide;

        let newChildIdx = parentIdx+1;
        return RBTree.checkAndModifyStack(nodeToCheck, ancestors, newChildIdx);
      } else {
        debugger;
        throw new Error('Invalid case, indexOfNodeToCheck: ${indexOfNodeToCheck.toString()}, '+
          'ancestors: ${ancestors.toString()}');
      }
    }
    throw new Error('Invalid case, end of check function: indexOfNodeToCheck: ${indexOfNodeToCheck.toString()}, '+
      'ancestors: ${ancestors.toString()}');
  }

  static pushBlackness(newNode, ancestors, blackNode) {
    // push blackness
    ancestors[blackNode+1][1] = new RBNode(ancestors[blackNode+1][1]._store.set('_color', RBNode.__BLACK));
    ancestors[blackNode][1] = new RBNode(ancestors[blackNode][1]._store.withMutations( (map) => {
      map.set('_color', RBNode.__RED);
      let leftChild = map.get('_left'), rightChild = map.get('_right');
      if (leftChild !== RBTree.nullPointer) {
        map.set('_left', new RBNode(leftChild._store.set('_color', RBNode.__BLACK)));
      }
      if (rightChild !== RBTree.nullPointer) {
        map.set('_right', new RBNode(rightChild._store.set('_color', RBNode.__BLACK)));
      }
      return map;
    }));
    return [newNode, ancestors, blackNode];
  }

  // static rotate(node, ancestors, pivotIdx, direction) {

  // }

  /**
   * Returns tuple of the found node and a stack of ancestor nodes.
   * Generic O(log n) recursive search of RBTree.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the search]
   * @param {[*]} key [the key used for search]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[Array]} [tuple containing null or the found node, and a stack of ancestors]
   */
  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (node === RBTree.nullPointer) return [null, ancestorStack];
    let comparisons = comparator(node.key, key);
    if (comparisons === -1) {
      ancestorStack.push(['_right', node])
      return RBTree.recursiveSearch(comparator, node.right, key, ancestorStack);
    } else if (comparisons === 1) {
      ancestorStack.push(['_left', node])
      return RBTree.recursiveSearch(comparator, node.left, key, ancestorStack);
    } else {
      //should only be inside here in a find operation: upon a successful find
      return [node, ancestorStack];
    }
  }

  static rotate(nodeStackAndIndex, direction) {
    //rotates left or right depending on direction
    let [node, ancestors, pivot] = nodeStackAndIndex;

    return [node, ancestors, nextChildToCheck];
  }
  /**
   * Returns new root node reconstructed from a leaf node and ancestors.
   * @param {[RBNode]} node [leaf node from which to start the construction]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node reconstructed from leaf and ancestors stack]
   */
  static constructFromLeaf(node, ancestors) {
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new RBNode(parentNode._store.set(childSide, node));
    }
    return node;      
  }

  /**
   * Returns a new tree with the given node removed. If the key is not found,
   * returns a clone of current tree.
   * @param {[*]} key [the key of the node to remove]
   * @return {[RBTree]} [new BST with the given node removed]
   */
  remove(key) {
    let [node, ancestors] = RBTree.recursiveSearch(this.comparator, this.root, key);
    if (!this.size || key === undefined || !node) {
      return this.clone();
    } else if (node) {
      return RBTree.removeFound(this.comparator, node, ancestors);
    }
  }

  /**
   * Get the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the node to find]
   * @return {[RBNode|null]} [found node, null if key not found]
   */
  find(key) {
    return RBTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  /**
   * Get the value of the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the value to get]
   * @return {[*]} [value of found node, null if key not found]
   */
  get(key) {
    let [search,] = RBTree.recursiveSearch(this.comparator, this.root, key);
    return !search ? null : search.value;
  }

  /**
   * Check if there is a node with the matching value in tree in O(n).
   * @param {[*]} value [the value of the node for which to search]
   * @return {[Boolean]} [true if found, false if not found]
   */
  contains(value) {
    return this.values.indexOf(value) > -1;
  }

  /**
   * Apply the callback to each node in the tree, in-order.
   * @param {[Function]} callback [recieves a RBNode as input]
   * @return {[undefined]} [side-effect function]
   */
  forEach(callback) {
    RBTree.traverseInOrder(this.root, callback);
  }

  /**
   * Returns a new tree with the list's key-value pairs inserted.
   * @param {[Array]} listToInsert [an array of key-value tuples to insert]
   * @return {[RBTree]} [new BST with the all the key-value pairs inserted]
   */
  insertAll(listToInsert = []) {
    let resultTree = this;
    listToInsert.forEach(pair => {
      // if (pair[0] >= 6){
      // }
      resultTree = resultTree.insert(pair[0], pair[1]);
    });
    return resultTree;
  }

  /**
   * Clone the current tree.
   * @return {[RBTree]} [new BST clone of current tree]
   */
  clone() {
    return new RBTree(this.comparator, this.root);
  }

  /**
   * Returns the given comparator if acceptable, or the default comparator function.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @return {[Function]} [custom comparator if given, default comparator otherwise]
   */
  static setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : RBTree.defaultComp;
  }

  /**
   * Returns 1, 0, or -1 based on default comparison criteria.
   * @param {[*]} keyA [the first key for comparison]
   * @param {[*]} keyB [the second key for comparison]
   * @return {[Number]} [-1 if keyA is smaller, 1 if keyA is bigger, 0 if the same]
   */
  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  /**
   * Checks if a given input is a RBNode.
   * @param {[*]} maybe [entity to check for RBNode-ness]
   * @return {[Boolean]} [true if maybe is a RBNode, false otherwise]
   */
  static isRBNode(maybe) {
    return !!maybe && maybe.constructor === RBNode;
  }

  /**
   * Clone the input RBNode.
   * @param {[RBNode]} node [node to clone]
   * @return {[RBNode]} [new RBNode clone of input node]
   */
  static cloneNode(node) {
    return new RBNode(node.key, node.value, node.left, node.right, node.id, node.color);
  }

  /**
   * Returns the count of nodes present in _root input.
   * @param {[RBNode]} _root [the root to recount]
   * @return {[Number]} [count of nodes in _root]
   */
  static recount(_root) {
    let count = 0;
    RBTree.traverseInOrder(_root, () => count++);
    return count;
  }

  /**
   * Returns the ancestor nodes and in-order predecessor of the input node.
   * @param {[RBNode]} leftChild [node from which to start the search for IOP]
   * @return {[Array]} [tuple containing a stack of ancestors and the IOP]
   */
  static findInOrderPredecessor(leftChild) {
    let currentIop = leftChild,
        ancestors = [];
    while (currentIop.right) {
      ancestors.push(['_right', currentIop]);
      currentIop = currentIop.right;
    }
    return [ancestors, currentIop];
  }

  /**
   * Apply the callback to each node, in-order.
   * Recursive traversal, static version of #forEach
   * @param {[RBNode]} node [the root node from which to start traversal]
   * @param {[Function]} callback [recieves a RBNode as input]
   * @return {[undefined]} [side-effect function]
   */
  static traverseInOrder(node, cb) {
    if (node === RBTree.nullPointer) return;
    let left = node.left, right = node.right;
    if (left !== RBTree.nullPointer) RBTree.traverseInOrder(left, cb);
    cb(node);
    if (right !== RBTree.nullPointer) RBTree.traverseInOrder(right, cb);
  }

  /**
   * Returns the leaf RBNode furthest down a given side of tree in O(log n).
   * @return {[RBNode|null]} [max or min node, null if tree is empty]
   */
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

  /**
   * Returns new root node with input node removed.
   * Input node must have no children.
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node constructed from tree with input node removed]
   */
  static removeNoChildren(node, ancestors) {
    if (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new RBNode(parentNode._store.set(childSide, null));
    }
    return RBTree.constructFromLeaf(node, ancestors)
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly one child.
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeOneChild(node, ancestors) {
    let childNode = node.children[0][1];
    if (!ancestors.length) {
      return childNode;
    } else {
      let [childSide, parentNode] = ancestors.pop(),
          leaf = new RBNode(parentNode._store.set(childSide, childNode));
      return RBTree.constructFromLeaf(leaf, ancestors);
    }
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly two children.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeTwoChildren(comparator, node, ancestors) {
    let [rightAncestors, iop] = RBTree.findInOrderPredecessor(node.left);
    //u is the IOP
    //v is the node itself
    let iopReplacementStore = iop.store.withMutations(_store => {
      _store.set('_key', node.key).set('_value', node.value).set('_id', node.id);
    });
    let targetReplacementStore = node.store.withMutations(_store => {
      _store.set('_key', iop.key)
            .set('_value', iop.value)
            .set('_id', iop.id)
            .set('_left', new RBNode(iopReplacementStore));
    });
    let newIopNode = new RBNode(targetReplacementStore);
    ancestors = ancestors.concat([['_left', newIopNode]], rightAncestors);
    return RBTree.removeFound(comparator, newIopNode.left, ancestors);
  }

  /**
   * Returns new root node with input node removed.
   * Input node can have any number of children. Dispatches to correct removal method.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeFound(comparator, node, ancestors) {
    switch (node.children.length) {
      case 1:
        return new RBTree(comparator, RBTree.removeOneChild(node, ancestors));
        break;
      case 2:
        return RBTree.removeTwoChildren(comparator, node, ancestors);
        break;
      default:
        return new RBTree(comparator, RBTree.removeNoChildren(node, ancestors));
        break;
    }
  }


  /**
   *
   *
   *
   * New Functionality
   *
   * 
   */
  


  static get nullPointer() {
    return _NULL_SENTINEL;
  }
}