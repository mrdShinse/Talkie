'use strict';

describe('paging', function() {
  let {paging: Paging, control: control, Bacon: Bacon} = Talkie({api:true});

  function rightKey() {
    KeyEvent.simulate(39, 39); // →
  }

  function leftKey() {
    KeyEvent.simulate(37, 37); // →
  }

  it('currentEs', function() {
    let paging = Paging({
      startPage : 1,
      endPage   : 3,
      slideElements: []
    });

    let current = paging.currentEs;
    let expects = [1, 2, 3, 2, 1];
    current.onValue(function(v) {
      assert(expects.shift() === v);
      if (!expects.length) {
        return Bacon.noMore;
      }
    });

    paging.nextBus.plug(control.key(39));
    paging.prevBus.plug(control.key(37));

                // 1
    rightKey(); // 1 > 2
    rightKey(); // 2 > 3
    rightKey(); // 3 > 3 (skip)

    leftKey();  // 3 > 2
    leftKey();  // 2 > 1
    leftKey();  // 1 > 1 (skip)

    // TODO startPage test
  });

  it('percentEs', function() {
    let paging = Paging({
      startPage : 1,
      endPage   : 4,
      slideElements: []
    });
    paging.nextBus.plug(control.key(39));
    paging.prevBus.plug(control.key(37));

    let percent = paging.percentEs;
    let expects = ['25%', '50%', '75%', '100%'];
    percent.onValue(function(v) {
      assert(expects.shift() === v);
      if (!expects.length) {
        return Bacon.noMore;
      }
    });
                // 25%
    leftKey();  // 25% (skip)
    rightKey(); // 25% > 50%
    rightKey(); // 50% > 75%
    rightKey(); // 75% > 100%
  });

  it('start & end', function() {
    let paging = Paging({
      startPage : 1,
      endPage   : 3,
      slideElements: []
    });
    paging.nextBus.plug(control.key(39));
    paging.prevBus.plug(control.key(37));

    let start = paging.startEs;
    let end   = paging.endEs;

    rightKey(); // 1 > 2

    start.onValue(function(v) {
      assert(1 === v);
      return Bacon.noMore;
    });
    leftKey(); // 2 > 1

    end.onValue(function(v) {
      assert(3 === v);
      return Bacon.noMore;
    });
    rightKey(); // 1 > 2
    rightKey(); // 2 > 3

  });

});
