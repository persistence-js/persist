jest.autoMockOff();
const IM = require('immutable');
const AVLTree = require('../../../src/binary_trees/AVLTree');
const AVLNode = require('../../../src/binary_trees/AVLNode');


describe('AVLTree', () => {

  describe('Instantiation', () => {
    let avl = new AVLTree(),
        _node = new AVLNode(1, 'a'),
        avlWithNode = new AVLTree(null, _node, 1, 0);

    it('instantiates empty, checks size', () => {
      expect(avl.size).toBe(0);
    });

    it('instantiates with a root node, checks size', () => {
      expect(avlWithNode.size).toBe(1);
    });

    it('instantiates with a default comparator', () => {
      expect(avl.comparator).toBeDefined();
      expect(typeof avl.comparator).toBe('function');
    });

    it('instantiates with a custom comparator', () => {
      let comp = () => 0, compAVL = new AVLTree(comp);
      expect(compAVL.comparator).toBe(comp);
      expect(typeof compAVL.comparator).toBe('function');
    });

  });

  describe('Instance Methods', () => {

    describe('#insert', () => {

      describe('empty trees', () => {

      });

      describe('nonempty trees', () => {

      });

    });

    describe('#remove', () => {

    });

    describe('#find', () => {

    });

    describe('#get', () => {

    });

    describe('#contains', () => {

    });

    describe('#forEach', () => {

    });

  });

  describe('Built-in Getters', () => {

    describe('get size', () => {

      it('returns current number of nodes in tree', () => {
        let avl1 = new AVLTree(),
            avl2 = avl1.insert(5, 'first value'),
            avl3 = avl2.insert(0, 'second value'),
            avl4 = avl3.insert(10, 'third value');
        expect(avl1.size).toBe(0);
        expect(avl2.size).toBe(1);
        expect(avl3.size).toBe(2);
        expect(avl4.size).toBe(3);
      });

    });

    describe('get comparator', () => {

      it('returns default comparator, duck-check', () => {
        let avlDefault = (new AVLTree()).comparator;
        expect(avlDefault(2, 1)).toBe(1);
        expect(avlDefault(1, 2)).toBe(-1);
        expect(avlDefault(1, 1)).toBe(0);
      });

      it('returns custom comparator, duck-check', () => {
        let avlCustom = (new AVLTree(() => 0)).comparator;
        expect(avlCustom(2, 1)).toBe(0);
        expect(avlCustom(1, 2)).toBe(0);
        expect(avlCustom('a', 'hi')).toBe(0);
      });

    });

    describe('get height', () => {

      describe('empty trees', () => {

        it('returns 0 for empty tree', () => {
          expect((new AVLTree()).height).toBe(0);
        });

      });

      describe('nonempty trees', () => {

        it('returns height of balanced tree', () => {
          let avl = new AVLTree().insert(1, 'a').insert(2, 'b');
          expect(avl.height).toBe(2);
        });

        xit('returns height of temporarily unbalanced tree', () => {
          let avl = new AVLTree().insert(1, 'a').insert(2, 'b').insert(3, 'c');
          expect(avl.height).toBe(2);
        });

      });

    });

    describe('get root', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).root).toBeNull();
      });

      it('returns root node for nonempty tree', () => {
        let rootNode = new AVLNode(1, 'a');
        expect((new AVLTree(null, rootNode)).root).toEqual(rootNode);
      });

    });

    describe('get rebalanceCount', () => {

      it('returns 0 for an empty tree', () => {
        expect((new AVLTree).rebalanceCount).toBe(0);
      });

      xit('returns greater than 0 for a temporarily unbalanced tree', () => {
        expect((new AVLTree().insert(1, 'a').insert(2, 'b').insert(3, 'c')).rebalanceCount).toBe(1);
      });

    });

    describe('get min', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).min).toBeNull();
      });

      it('returns node with min key for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(0, 'min'),
            min = avl.min;
        expect(min.key).toBe(0);
        expect(min.value).toBe('min');
      });

    });

    describe('get max', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).max).toBeNull();
      });

      it('returns node with max key for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max'),
            max = avl.max;
        expect(max.key).toBe(100);
        expect(max.value).toBe('max');
      });

    });

    xdescribe('get keys', () => {

      it('returns empty array for empty tree', () => {
        expect((new AVLTree()).keys).toEqual([]);
      });

      it('returns in-order array of all node keys for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max');
        expect(avl.keys).toEqual([25, 50, 75, 100]);
      });

    });

    xdescribe('get values', () => {

      it('returns empty array for empty tree', () => {
        expect((new AVLTree()).values).toEqual([]);
      });

      it('returns in-order array of all node values for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max');
        expect(avl.values).toEqual(['c', 'a', 'b', 'max']);
      });

    });

  });

});
