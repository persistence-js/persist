jest.autoMockOff();
var IM = require('immutable'),
    SLinkedList = require('../../../src/lists/SLinkedList');

describe('SLinkedList', () => {
  describe('new instance initialization', () => {
    let sLLEmpty = new SLinkedList();

    it('starts with a null head', () => {
      expect(sLLEmpty.head).toBeNull();
    });

    it('starts with a null tail', () => {
      expect(sLLEmpty.tail).toBeNull();
    });

    it('starts with an empty _lzStore', () => {
      expect(sLLEmpty._lzStore.size).toBe(0);
    });

    it('stores a number on initialization', () => {
      let sLLNumber = new SLinkedList(1);
      expect(sLLNumber._lzStore.size).toBe(1);
      expect(sLLNumber.head.__proto__).toEqual(sLLNumber.nodeConstructor);
      expect(sLLNumber.head.data).toEqual(1);
      expect(sLLNumber.tail.data).toEqual(1);
    });

    it('stores a string on initialization', () => {
      let sLLString = new SLinkedList('string value');
      expect(sLLString._lzStore.size).toBe(1);
      expect(sLLNumber.head.__proto__).toEqual(sLLString.nodeConstructor);
      expect(sLLString.head.data).toEqual('string value');
      expect(sLLString.head.next).toBeNull();
      expect(sLLString.tail.data).toEqual('string value');
      expect(sLLString.tail.next).toBeNull();

    });

    it('stores an object on initialization', () => {
      let sLLObject = new SLinkedList({ name: 'clark' });
      expect(sLLObject._lzStore.size).toBe(1);
      expect(sLLObject.head.next).toBeNull();
      expect(sLLObject.tail.next).toBeNull();
      expect(sLLObject.head.data).toEqual({ name: 'clark' });
      expect(sLLObject.tail.data).toEqual({ name: 'clark' });
    });

    it('stores an array on initialization', () => {
      let sLLArray = new SLinkedList(['random string', {'asdfasdf':'asdf'}, { name: 'anna' }, 26, ['tail value']]);
      expect(sLLArray._lzStore.size).toBe(5);
      expect(sLLArray.head.data).toEqual('random string');
      expect(sLLArray.head.next).toNotEqual(null);
      expect(sLLArray.head.next.data['asdfasdf']).toBe('asdf');
      expect(sLLArray.head.next.next.next.data).toBe(26);
      expect(sLLArray.tail.next).toBeNull();
      expect(sLLArray.tail.data).toEqual(['tail value']);
    });
  });

  describe('public interface instance methods', () => {
    let sLLNumber = new SLinkedList(1);
    let sLLArray = new SLinkedList(['random string', {'asdfasdf':'asdf'}, { name: 'anna' }]);

    describe('gets', () => {
      it('gets-head', () => {
        expect(sLLNumber.head.data).toEqual(1);
        expect(sLLArray.head.data).toEqual('random string');
      });

      it('gets-tail', () => {
        expect(sLLNumber.tail.data).toEqual(1);
        expect(sLLArray.tail.data).toEqual({ name: 'anna' });
      });

      it('gets-store', () => {
        expect(sLLNumber.store.length).toEqual(1);
        expect(sLLNumber.store[0]).toEqual(1);
      });

      it('gets-size', () => {
        expect(sLLNumber.size).toEqual(1);
        expect(sLLArray.size).toEqual(3);
      });

      it('reverses', () =>{
        expect(sLLArray.reverse().head.data['name'].toEqual('anna'));
      });
    });

    describe('prepends', () => {
      it('single elements', () => {
        expect(sLLArray.prepend(0).head.data).toEqual(0);
      });

      it('an array', () => {
        expect(sLLArray.prepend([1,2,3].head.next.data)).toEqual(2);
      });

      it('nested arrays', () => {
        expect(sLLArray.prepend([[1,2,3],[1,2]]).head.data).toEqual([1,2,3]);
      });

      it('nodes', () => {
        expect(sLLArray.prepend(sLLArray.head).head.data).toEqual('random string');
      });
    });

    //prepends before nodes
    //prepends after nodes

    describe('appends', () => {
      it('single numbers', () => {
        let sLLNumber2 = sLLNumber.append(2);
        expect(sLLNumber.tail.data).toEqual(1); // shouldn't mutate original list
        expect(sLLNumber2.head.data).toEqual(1);
        expect(sLLNumber2.tail.data).toEqual(2);
      });
    });
    //3 other types
    //appends before nodes
    //appends aftr nodes

    it('flattens', () =>{
      let flattened = sLLArray.prepend([[1,2,3],[1,2]]).flatten();
      expect(flattened.head.data).toEqual(1);
      expect(flattened.next.head.data).toEqual(1);
      expect(flattened.next.next.head.data).toEqual(2);
    });


    it('removes-head', () => {
      let sLLNumber2 = sLLNumber.append(2);
      let sLLNumber3 = sLLNumber.removeHead();
      let sLLNumber4 = sLLNumber2.removeHead();
      expect(sLLNumber.head.data).toEqual(1); // shouldn't mutate original list
      expect(sLLNumber2.head.data).toEqual(1); // shouldn't mutate any copied lists
      expect(sLLNumber3.head.data).toBeNull();
      expect(sLLNumber4.head.data).toEqual(2);
      expect(sLLNumber4.tail.data).toEqual(2);
    });

    it('removes-tail', () => {
      let sLLNumber2 = sLLNumber.append(2);
      let sLLNumber3 = sLLNumber2.removeTail();
      expect(sLLNumber.head.data).toEqual(1); // shouldn't mutate original list
      expect(sLLNumber2.head.data).toEqual(1); // shouldn't mutate any copied lists
      expect(sLLNumber3.head.data).toEqual(1);
      expect(sLLNumber3.tail.data).toBeNull();
    });

    //removeBefore
    //removeAfter
    it('contains', () => {
      let emptyTest = new SLinkedList().contains('random'),
          matchTest = new SLinkedList('random').contains('random'),
          obj = {},
          deepObj = { key1: 'key1' , testArr: ['first', 'second'] },
          deepObj2 = { key1: 'key1' , testArr: ['first', 'second', 'third'], 'other key': 3 },
          arr = [1, 2, 3, 4, 'test', {}],
          matchTest2 = new SLinkedList(obj).contains(obj),
          matchTest3 = new SLinkedList(deepObj).contains(deepObj),
          matchTest4 = new SLinkedList(deepObj).contains(deepObj2),
          matchTest5 = new SLinkedList(arr).contains('test'),
          matchTest6 = new SLinkedList(arr).contains({});
      expect(emptyTest).toEqual(false);
      expect(matchTest).toEqual(true);
      expect(matchTest2).toEqual(true);
      expect(matchTest3).toEqual(true);
      expect(matchTest4).toEqual(false);
      expect(matchTest5).toEqual(true);
      expect(matchTest6).toEqual(false);
    });

    it('traverses', () => {
      let sLL = new SLinkedList([1, 2, 3]),
          result = [],
          cbAdd = (v) => result.push(v),
          cbDel = () => result.pop();
      expect(result.length).toEqual(0);
      sLL.traverse(cbAdd);
      expect(result.length).toEqual(3);
      sLL.traverse(cbDel);
      expect(result.length).toEqual(0);
    });

  });

  describe('static methods', () => {

    it('generates-lz-store', () => {
      let seqCheck = (test) => expect(test).toEqual(jasmine.any(IM.Seq));
      let tests = IM.List([undefined, null, 1, 'hey', { name: 'clark'}, [1,2,3,4,5]]);
      tests.forEach((element) => {
        seqCheck(SLinkedList.generateLzStore(element));
      });
      // let tests = [
      //   SLinkedList.generateLzStore(),
      //   SLinkedList.generateLzStore(null),
      //   SLinkedList.generateLzStore(1),
      //   SLinkedList.generateLzStore('hey'),
      //   SLinkedList.generateLzStore({ name: 'clark' }),
      //   SLinkedList.generateLzStore([1, 2, 3, 4, 5]),
      // ];
      // tests.forEach(seqCheck);
    });

  });

  describe('conversion to', () => {
    //JS, array, object/keyed
  })


  describe('search Methods', () => {
    //find, findlast, max/min  by comparator
  })


  describe('reading values', () => {
    //get/has/contains..move
  })


  describe('conversion methods', () => {
    //toSet, seq, list, map
    ////subclasses: keyed/value/entrySeq
    //chaining
    describe('combination Methods', () => {
      //is subset, superset
    })
  })

  describe('reduce Methods', () => {
    //reduce, reduceright(fromTail)
    //every,some, join, isempty
  })

  describe('comparison Methods', () => {

  })

  describe('static, above', () => {
    //isLL, of...
  })


  describe('creating subsets', () => {
    //slice, rest, butLast, skip...
    //take..

  })

  describe('sequence algorithms', () => {
    //map, filter, ...move reverse
    //sort
    //
  })


});
