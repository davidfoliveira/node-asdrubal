const DataCollector = require('../data-collector')


describe('Simple', () => {
  beforeEach(() => {
    collector = new DataCollector({
      minDataPoints: 60,
      maxDataPoints: 1000,
      dataTimeout:   1000,
    });
  });

  function preFill() {
    const mehTimes = 60 + parseInt(Math.random()*300);
    const okTimes = 60 + parseInt(Math.random()*300);
    for (let x = 0; x < mehTimes; x++) {
      collector.add('meh');
    }
    for (let x = 0; x < okTimes; x++) {
      collector.add('ok');
    }
    return {
      mehTimes: mehTimes,
      okTimes:  okTimes,
    }
  }

  it('Can be instantiated', () => {
    expect(collector).not.toBe(null);
  });

  it('Supports values to be added', () => {
    collector.add('meh');
    expect(true);
  });

  it('Returns the number of datapoints after adding', () => {
    const dps = collector.add('meh');
    expect(dps).toEqual(1);
  });

  it('Returns the right number of occurrences', () => {
    const {mehTimes, okTimes} = preFill();
    const occurs = collector.occurrences();
    expect(occurs).toEqual({
      byValue: {
        meh: mehTimes,
        ok:  okTimes,
      },
      total: (mehTimes + okTimes),
    });
  });

  it('Discards datapoints added after dataTimeout', () => {
    // Add a datapoint
    collector.add('meh');

    setTimeout(() => {
      const {mehTimes, okTimes} = preFill();
      const occurs = collector.occurrences();

      expect(occurs).toEqual({
        byValue: {
          meh: mehTimes,
          ok:  okTimes,
        },
        total: (mehTimes + okTimes),
      });
    }, 1000);
  });

  it('Percentages are accurate', () => {
    const {mehTimes, okTimes} = preFill();
    const occurs = collector.occurrences();
    const pcts = collector.percentages();

    const pctsAgain = {};
    Object.keys(occurs.byValue).forEach((value) => {
      pctsAgain[value] = (occurs.byValue[value] / occurs.total) * 100;
    });
    expect(pcts).toEqual(pctsAgain);
  });

  it('Returns the percentage for a specific value', () => {
    const {mehTimes, okTimes} = preFill();
    const occurs = collector.occurrences();
    const pcts = collector.percentages();
    expect(collector.percentageFor('meh') == pcts['meh']);
  });

  it('Returns NOT_ENOUGH_DATAPOINTS by default if there are no enough values', () => {
    // Add not-enough datapoints
    for (let x = 0; x < collector.opts.minDataPoints - 1; x++) {
      collector.add('meh');
    }

    // Get the occurrence number
    const occurs = collector.percentages();
    expect(occurs).toEqual('NOT_ENOUGH_DATAPOINTS');
  });

  it('Calls onNotEnoughDataPoints() when there are not enough datapoints', () => {
    // Add not-enough datapoints
    for (let x = 0; x < collector.opts.minDataPoints - 1; x++) {
      collector.add('meh');
    }

    // Overwrite onNotEnoughDataPoints
    collector.opts.onNotEnoughDataPoints = () => {
      return {
        hola: 123
      }
    };

    // Get the occurrence number
    const occurs = collector.percentages();
    expect(occurs).toEqual({hola: 123});
  });
});
