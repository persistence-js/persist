jest.autoMockOff();
const IM = require('immutable');
const BinarySearchTree = require('../../../src/binary_trees/BinarySearchTree');
const BSTNode = require('../../../src/binary_trees/BSTNode');


describe('BinarySearchTree Operations', () => {

  describe('Instantiation', () => {
    let bst = new BinarySearchTree(),
        node = new BSTNode(0, "first node value", null, null, 1),
        bstWithNode = new BinarySearchTree(null, node);

    it('instantiates empty, checks size', () => {
      expect(bst.size).toBe(0);
    });

    it('instantiates with a root node, checks size', () => {
      expect(bstWithNode.size).toBe(1);
    });

    it('instantiates with a default comparator', () => {
      expect(bst.comparator).toBeDefined();
      expect(typeof bst.comparator).toBe('function');
    });

    it('instantiates with a custom comparator', () => {
      let comp = () => 0, compBST = new BinarySearchTree(comp);
      expect(compBST.comparator).toBe(comp);
      expect(typeof compBST.comparator).toBe('function');
    });

  });

  describe('Internal Methods', () => {

  });

  describe('Basic Instance Methods', () => {

  });

  describe('Basic Getters', () => {

    it('gets size', () => {

    });

    it('gets min', () => {

    });

    it('gets max', () => {

    });

    it('gets keys', () => {

    });

    it('gets values', () => {

    });

  });

  describe('Static Methods', () => {

  });

});
