// jest.dontMock('../../../src/binary_trees/RBTree');
// jest.dontMock('../../../src/binary_trees/RBNode');
jest.autoMockOff();
const IM = require('immutable');
// ES6 Syntax works, but get automatically mocked due to 
// import {RBTree} from '../../../src/binary_trees/RBTree';
// import {RBNode} from '../../../src/binary_trees/RBNode';
const RBNode = require('../../../src/binary_trees/RBNode');
const RBTree = require('../../../src/binary_trees/RBTree');

describe('Red-Black Tests', function() {

  describe('Node Tests', function() {
    let node1 = new RBNode(1, 'hi', null, null, 0);
    it('has a color property, default red', function() {
      expect(node1.color).toEqual(RBNode.__RED);
    });

    it('stores the correct value', function() {
      expect(node1.value).toEqual('hi');
    });

  });
    //2nd Pass Node Test Ideas: 
    //-Passed off-type values to constructor.

  describe('Class Properties and methods', function() {
    describe('_nil', function() {

       it('is a static property', function() {
         expect(RBTree.nullPointer).toBeTruthy;
         expect(RBTree.nullPointer).toEqual(RBTree.nullPointer);
       });

       it('is an RBNode', function() {
         expect(RBTree.isRBNode(RBTree.nullPointer)).toBeTruthy();
       });

       it('is a black Node', function() {
         expect(RBTree.nullPointer.color).toEqual(RBNode.__BLACK);
       });

       it('has null pointers for value, id, left, and right', function() {
         expect(RBTree.nullPointer.value).toBeNull();
         expect(RBTree.nullPointer.id).toBeNull();
         expect(RBTree.nullPointer.left).toBeNull();
         expect(RBTree.nullPointer.right).toBeNull();
       });
     }); 
  });
  

  describe('Tree Tests', function() { 
    //Creates 3 default Red nodes to test rotation
    let nil = RBTree.nullPointer;
    let _beta = new RBNode(-5, "beta", nil, nil, 4);
    let _gamma = new RBNode(15, "gamma", nil, nil, 5)
    let _right = new RBNode(10, "right", _beta, _gamma, 3);
    let _left = new RBNode(-10, "left", nil, nil, 2);
    let _root = new RBNode(0, "root", _left, _right, 1);
    let gammaStack = IM.Seq([_root, _right, _gamma]);
    let betaStack = IM.Seq([_root, _right, _beta]);

    describe('Basic Insertion: Simple Rotation Tests', function() {
      //define whiteboarded Tree
      //4 cases: R-R, L-R
      //R-L, L-L
      let setDoubleRed = new RBTree();
      setDoubleRed = 
        setDoubleRed
        .insert(100, 'a')
        .insert(80, 'b')
        .insert(90, 'c');

      it('has a root black node, and two red child nodes', function() {
        expect(setDoubleRed._root.color).toBe(RBNode.__BLACK);
        expect(setDoubleRed._root.value).toBe('c');
        expect(setDoubleRed.find(100).color).toBe(RBNode.__RED);
        expect(setDoubleRed.find(80).color).toBe(RBNode.__RED);
      });

      it('is a right child, with right parent', function() {
        let after = setDoubleRed.insert(105,'d').insert(110,'e');
        //rotation (left on 105)+repaint
        expect(after.find(100).color).toBe(RBNode.__RED);
        expect(after.find(105).left).toBe(after.find(100));
        expect(after.find(105).right).toBe(after.find(110));
      });

      it('is a left child, with right parent', function() {
        //rotation (left on 105)+repaint
        let after = setDoubleRed.insert(105,'d').insert(101,'e');
        expect(after.find(101).left).toBe(after.find(100));
        expect(after.find(101).right).toBe(after.find(105));
        expect(after.find(101).color).toBe(RBNode.__BLACK);
      });

      it('is a right child, with left parent', function() {
        //2 rotations, left on 99, right on 99 to bring it between 95-100
        //after first rotation, same case as below
        //repaint at end.
        let after = setDoubleRed.insert(95,'d').insert(96,'e');
        expect(after.find(96).left).toBe(after.find(95));
        expect(after.find(96).right).toBe(after.find(100));

      });

      it('is a left child, with left parent', function() {
        //single rotation, on 95...repaint
        let after = setDoubleRed.insert(95,'d').insert(94,'e');
        expect(after.find(95).left).toBe(after.find(94));
        expect(after.find(95).right).toBe(after.find(100));
      });  
      //http://i.imgur.com/jQFygDU.png
      //after inserting 91...push blackness, then rotate right on 100
      //rotate left on 100, paint 90 red, 100 black...
    });

    describe('Insertion & Deletion Tests', function() {
      let persistentTree = new RBTree();
      let seq = [ 
        [100, "1st"],
        [80, "2nd"],
        [90, "3rd"],
        [160, "4th"],
        [190, "5th"],
        [140, "6th"],
        [95, "7th"],
        [40, "8th"],
      ];

      let sequentialInsert = () => {
        let counter = 0;
        return function(){
          return seq[counter++];
        };   
      };

      let addOne = sequentialInsert();

      let addFromSeq = () => {
        let node = addOne();
        persistentTree = persistentTree.insert(node[0], node[1]);
        return persistentTree;
      }
      describe('8-element Insertion Tests', function() {
        it('inserts into empty', function() {
          addFromSeq(); //100
          expect(persistentTree.root.value).toBe("1st");
          expect(persistentTree.root.color).toBe(RBNode.__BLACK);
        });

        it('rotates left when required', function() {
          addFromSeq();//80
          addFromSeq();//90
          expect(persistentTree.find(80).value).toEqual('2nd')
        });

        it('rotates and repaints for "Black Uncle, Child-R, Parent-R-Child" Case', function() {
          addFromSeq(); //160
          expect(persistentTree.find(80).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(90).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(100).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(160).color).toEqual(RBNode.__RED);
        });

        it('repaints for "Red Uncle"', function() {
          addFromSeq(); //190
          addFromSeq(); //140
          expect(persistentTree.find(190).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(100).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(140).color).toEqual(RBNode.__RED);
        });

        it('simple inserts onto left subtree', function() {
          addFromSeq(); //95
          addFromSeq(); //40
          expect(persistentTree.size).toBe(8);
          expect(persistentTree.find(80).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(40).color).toEqual(RBNode.__RED);
          expect(persistentTree.find(190).value).toEqual("5th");

        });
        it('passes final state tests', function() {
          expect(persistentTree._root.right.right.key).toEqual(190);
          expect(persistentTree._root.right.right.color).toEqual(RBNode.__BLACK);
          expect(persistentTree._root.left.left.key).toEqual(40);
          expect(persistentTree._root.right.left.left.key).toEqual(95);          
          expect(persistentTree._root.right.left.right.key).toEqual(140);          
        });
      });


      describe('Deletion Tests', function() {
        
        it('deletes a red leaf with no further changes', function() {
          persistentTree.remove(40);
          expect(persistentTree._root.left.left).toEqual(RBTree.nullPointer);
          let rightSide = persistentTree._root.right;
          expect(rightSide.key).toEqual(160);
          expect(rightSide.color).toEqual(RBNode.__RED);
          expect(rightSide.left.right.key).toBe(140);
          expect(rightSide.right.key).toBe(190);
        });

        it('deletes a red non-leaf, with no further changes, replacing with predecessor', function() {
          persistentTree.remove(160);
          let rootN = persistentTree._root;
          let rSide = rootN.right;
          expect(persistentTree.size).toEqual(6);
          expect(rootN.color).toEqual(RBNode.__BLACK);
          expect(rootN.key).toEqual(90);
          expect(rSide.color).toEqual(RBNode.__RED);
          expect(rSide.key).toEqual(140);
          expect(rSide.left.left.key).toEqual(95);
          expect(rSide.right.key).toEqual(190);
        });

        it('deletes a black node with red child, makes red child black', function() {
          //delete 100
        });

        describe('Double Black Cases', function() {
          describe('Case 1: Sibling Black, one child red:', function() {
            //set up case...add nephews to 190, delete and RE-ADD 100.
            it('Handles a "LEFT double-black, right red nephew" Case.', function() {
                  
            });

            it('Handles a "LEFT double-black, left red nephew" Case.', function() {
                          
            });
            it('Handles a "RIGHT double-black, right red nephew" Case.', function() {
                          
            });
            it('Handles a "RIGHT double-black, left red nephew" Case.', function() {
                          
            });
          });
          describe('Case 2: Sibling Black, black children', function() {
            it('deletes a black leaf (with black child): Red Parent', function() {
              
            });

            it('deletes a black leaf (with black child): black parent, recursing up', function() {
              
            });

            it('handles a recursion of double black to the root', function() {
              
            });
          });

          describe('Case 3: Red Sibling', function() {
            it('Handles a LEFT double-black, right red sibling', function() {
              
            });

            it('Handles a RIGHT double-black, left red sibling', function() {
              
            });

          });
          
        });

      });


    });
  describe('Batch Insert with traversal', function() {
    let ten = new RBTree();
    let twentyThings = Array(20);
    for (let i = 0 ; i < 20; i++){
      //tested manually up to 9
      twentyThings[i] = [i, "valueForKey :" + i];
    }
    let completed = ten.insertAll(twentyThings);
    let counter = 0;
    RBTree.traverseInOrder(completed._root, (node) => {
      expect(node.key).toEqual(counter++);
    });
  });

  describe('Large Batch Insert, with traversal and deletion', function() {
    //WARN: This test takes 2-5 minutes in Jest + Babel.
    let ten = new RBTree();
    let manyThings = Array(10000);
    for (let i = 0 ; i < 10000; i++){
      //tested manually up to 9
      manyThings[i] = [i, "valueForKey :" + i];
    }
    let completed = ten.insertAll(manyThings);
    let counter = 0;
    RBTree.traverseInOrder(completed._root, (node) => {
      expect(node.key).toEqual(counter++);
    });

    //insert only keys, with the same value
    //insert numbers from 0 to 10000
    //
    //
    //
    //delete numbers from 1 to 10000
    //expect no errors throw, expect 0 to be the remaining node, red, size to be 1        
  });
  });
});
