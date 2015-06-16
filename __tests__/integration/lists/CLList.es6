jest.autoMockOff();
var IM = require('immutable'),
    CLList = require('../../../src/lists/CLList');

describe('Circular Linked Lists', function() {
  let oneToFive = [1,2,3,4,5];
  let cLL = new CLList(oneToFive);
  let midNode = cLL.head.next.next;

  describe('CLL-Specific Basic Instance Methods & Properties', function() {

    it('is circular', function() {
      expect(cLL.tail.next).toBe(cLL.head);
    });

    it('has correct values midpoint, head, tail, and size values', function() {
      expect(midNode.data).toBe(3);
      expect(cLL.head.data).toBe(1);
      expect(cLL.tail.data).toBe(5);
      expect(cLL.size).toBe(5);
    });

    it('appends, not modifying the original list', function() {
      expect(cLL.append('NEW').tail.data).toBe('NEW');
      expect(cLL.head.data).toNotBe('NEW');
    });

    it('prepends, not modifying the original list', function() {
      expect(cLL.prepend('NEW').head.data).toBe('NEW');
      expect(cLL.head.data).toNotBe('NEW');
    });

  });

  describe('Add before', function() {
    it('when called with head, behaves exactly as prepend should, ', function() {
      expect(cLL.addBefore(cLL.head, 0).head.data).toBe(cLL.prepend(0).head.data);
    });

    it('returns a new list, with the correct inserted value', function() {
      let nList = cLL.addBefore(midNode, 0);
      expect(cLL.size).toNotBe(nList.size);
      expect(nList.head.next.next.data).toBe(0);
    });

  });

  describe('Remove before', function() {
    let removeBeforeResult = cLL.removeBefore(cLL.head);
    let removeTailResult = cLL.removeTail();

    it('removes tail, when called with head', function() {
      expect(removeBeforeResult.tail.data).toBe(removeTailResult.tail.data);
      expect(removeBeforeResult.head.data).toBe(removeTailResult.head.data);
    });

    it('returns a new list, with the correct length', function() {
      expect(removeBeforeResult.size).toBe(cLL.size - 1);
    });

    it('does not contain the removed node', function() {
      let tailValue = cLL.tail;
      let isTail = (node) => {
        return node === tailValue;
      }
      expect(removeBeforeResult.filter(isTail).length).toBeFalsy();
    });

  });

  describe('Add after', function() {
    it('when called with tail, behaves exactly as append should', function() {
      expect(cLL.addAfter(cLL.tail, 0).head.data).toBe(cLL.append(0).head.data);

    });

    it('returns a new list, with the correct inserted value', function() {
      let nList = cLL.addAfter(midNode, 0);
      expect(cLL.size).toNotBe(nList.size);
      expect(nList.head.next.next.next.data).toBe(0);

    });

  });

  describe('Remove after', function() {
    let removeAfterResult = cLL.removeAfter(cLL.tail);
    let removeHeadResult = cLL.removeHead();

    it('removes head, when called with tail', function() {
      expect(removeAfterResult.tail.data).toBe(removeHeadResult.tail.data);
      expect(removeAfterResult.head.data).toBe(removeHeadResult.head.data);

    });

    it('returns a new list, with the correct length', function() {
      expect(removeAfterResult.size).toBe(cLL.size-1);
    });

    it('does not contain the removed node', function() {
      let headValue = cLL.head;
      let isHead = (node) => {
        return node === headValue;
      }
      expect(removeAfterResult.filter(isHead).length).toBeFalsy();
    });
  });
});
