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
      expect(sLLEmpty.size).toBe(0);
    });

    it('stores a number on initialization', () => {
      let sLLNumber = new SLinkedList(1);
      expect(sLLNumber.size).toBe(1);
      expect(sLLNumber.head.data).toEqual(1);
      expect(sLLNumber.head.next).toBeNull();
      expect(sLLNumber.tail.data).toEqual(1);
    });

    it('stores a string on initialization', () => {
      let sLLString = new SLinkedList('string value');
      expect(sLLString.size).toBe(1);
      expect(sLLString.head.next).toBeNull();
      expect(sLLString.head.data).toEqual('string value');
      expect(sLLString.tail.data).toEqual('string value');
      expect(sLLString.tail.next).toBeNull();

    });

    it('stores an object on initialization', () => {
      let sLLObject = new SLinkedList({ name: 'clark' });
      expect(sLLObject.size).toBe(1);
      expect(sLLObject.head.next).toBeNull();
      expect(sLLObject.tail.next).toBeNull();
      expect(sLLObject.head.data).toEqual({ name: 'clark' });
      expect(sLLObject.tail.data).toEqual({ name: 'clark' });
    });

    it('stores an array on initialization', () => {
      let sLLArray = new SLinkedList(['random string', {'asdfasdf':'asdf'}, { name: 'anna' }, 26, ['tail value']]);
      expect(sLLArray.size).toBe(5);
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

    describe('reverse', () => {
      it('reverses', () =>{
        expect(sLLArray.reverse().head.data['name'].toEqual('anna'));
      });
    });

    describe('prepends', () => {
      it('prepends single elements', () => {
        expect(sLLArray.prepend(0).head.data).toEqual(0);
      });

      it('prepends an array', () => {
        expect(sLLArray.prepend([1,2,3].head.next.data)).toEqual(2);
      });

      it('prepends nested arrays', () => {
        expect(sLLArray.prepend([[1,2,3],[1,2]]).head.data).toEqual([1,2,3]);
      });

      it('prepends nodes', () => {
        expect(sLLArray.prepend(sLLArray.head).head.data).toEqual('random string');
      });
    });

    describe('appends', () => {
      it('appends single numbers', () => {
        let sLLNumber2 = sLLNumber.append(2);
        expect(sLLNumber.tail.data).toEqual(1); // shouldn't mutate original list
        expect(sLLNumber2.head.data).toEqual(1);
        expect(sLLNumber2.tail.data).toEqual(2);
      });
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
  });
});
