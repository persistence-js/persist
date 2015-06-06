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
      debugger;
      setDoubleRed = 
        setDoubleRed
        .insert(100, 'a')
        .insert(80, 'b')
        .insert(90, 'c');

      it('has a root black node, and two red child nodes', function() {
        debugger;
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
      let RB_Tree = new RBTree();
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
        RB_Tree = RB_Tree.insert(node[0], node[1]);
        return RB_Tree;
      }
      describe('8-element Insertion Tests', function() {
        it('inserts into empty', function() {
          addFromSeq(); //100
          expect(RB_Tree.root.value).toBe("1st");
          expect(RB_Tree.root.color).toBe(RBNode.__BLACK);
        });

        it('rotates left when required', function() {
          addFromSeq();//80
          addFromSeq();//90
          expect(RB_Tree.find(80).value).toEqual('2nd')
        });

        it('rotates and repaints for "Black Uncle, Child-R, Parent-R-Child" Case', function() {
          addFromSeq(); //160
          expect(RB_Tree.find(80).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(90).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(100).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(160).color).toEqual(RBNode.__RED);
        });

        it('repaints for "Red Uncle"', function() {
          addFromSeq(); //190
          addFromSeq(); //140
          expect(RB_Tree.find(190).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(100).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(140).color).toEqual(RBNode.__RED);
        });

        it('simple inserts onto left subtree', function() {
          addFromSeq(); //95
          addFromSeq(); //40
          expect(RB_Tree.size).toBe(8);
          expect(RB_Tree.find(80).color).toEqual(RBNode.__BLACK);
          expect(RB_Tree.find(40).color).toEqual(RBNode.__RED);
          expect(RB_Tree.find(190).value).toEqual("5th");
        });
      });


      describe('Deletion Tests', function() {
        
        it('deletes a red leaf with no further changes', function() {
          
        });

        it('deletes a red non-leaf, with no further changes, replacing with predecessor', function() {
          
        });

        it('deletes a black node with red child, makes red child black', function() {
          
        });

        describe('Double Black Cases', function() {
          describe('Case 1: Sibling Black, one child red:', function() {

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
  xdescribe('Batch Insert with traversal', function() {
    let ten = new RBTree();
    let twentyThings = Array(20);
    for (let i = 0 ; i < 20; i++){
      //tested manually up to 9
      twentyThings[i] = [i, "valueForKey :" + i];
    }
    // let completed = ten.insertAll(twentyThings);
    // let counter = 0;
    // RBTree.traverseInOrder(completed._root, (node) => {
    //   expect(node.key).toEqual(counter++);
    // });
  });

  describe('Large Batch Insert, with traversal and deletion', function() {
    //insert only keys, with the same value
    //insert numbers from 0 to 10000
    //delete numbers from 1 to 10000
    //expect no errors throw, expect 0 to be the remaining node, red, size to be 1        
  });
  });
});
