jest.autoMockOff();
const IM = require('immutable');
const RBTree = require('../../../src/binary_trees/BSTree');
const RBNode = require('../../../src/binary_trees/BSTNode');

describe('Red-Black Tests', function() {
  
  describe('Node Tests', function() {
    let node1 = new RBNode(1, 'hi');
    it('has a color property', function() {
      expect(node1.color).toBeTruthy();
    });

    it('can be repainted R or B', function() {
      expect(node1.repaint(1)).toEqual('Black');
    });

    it('stores the correct value', function() {
      expect(node1.value).toEqual('hi');
    });

    //chain insert here

    it('has rotate left around', function() {
      expect(node1.rotateLeft).toHaveBeenCalled();
    });

    it('has rotate right around', function() {
      expect(node2.rotateRight).toHaveBeenCalled();
    });
  });

  describe('Tree Tests', function() {

    //insert a demo'd, pre-visualized  small tree
    describe('Basic Red-Black Tree instance methods', function() {
      let RB_Tree = new RBTree();
      it('utilizes repainting when required', function() {
        expect(RB_Tree.repaint).toHaveBeenCalled();
      });

      it('rotates left when required', function() {
        expect(RB_Tree.leftRotation).toHaveBeenCalled();
        expect(RB_Tree.retrieve(8).value).toEqual('8th one')
      });

      //reset, insert to force a right rotation
      it('rotates right when required', function() {
        expect(RB_Tree.rightRotation).toHaveBeenCalled();
        expect(RB_Tree.retrieve(8).value).toEqual('8th one')
      });

    });

  });
});
