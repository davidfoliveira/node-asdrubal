class DataCollector {
  constructor(opts={}) {
    // Apply option defaults
    this.opts = Object.assign({
      minDataPoints: 1,
      maxDataPoints: 1000,
      dataTimeout: 60000,
      onNotEnoughDataPoints: () => 'NOT_ENOUGH_DATAPOINTS',
    }, opts);
    this.dataPoints = [ ];
  }

  // Add a value
  add(value) {
    // Remove the excess of datapoints
    if (this.dataPoints.length >= this.opts.maxDataPoints) {
      this.dataPoints.splice(0, this.dataPoints.length - this.opts.maxDataPoints + 1);
    }
    // Add this one
    this.dataPoints.push({
      when:  new Date().getTime(),
      value: value,
    });
    return this.dataPoints.length;
  }

  // Return the total number of hits per value and the overall number of hits
  occurrences() {
    const limit = new Date().getTime() - this.opts.dataTimeout;
    const countByValue = {};

    let total = 0;
    for (let x = this.dataPoints.length - 1; x >=0 && this.dataPoints[x].when >= limit ; x--) {
      const value = this.dataPoints[x].value;
      if (!countByValue[value]) countByValue[value] = 0;
      countByValue[value]++;
      total++;
    }

    return {
      byValue: countByValue,
      total: total
    };
  }

  // Return the distribution in percentages
  percentages(ignoreMinDataPoints=false) {
    const occurs = this.occurrences();

    // Do we have enough datapoints?
    if (this.opts.minDataPoints !== undefined && occurs.total < this.opts.minDataPoints && !ignoreMinDataPoints) {
      return this.opts.onNotEnoughDataPoints();
    }

    // Calculate percentages
    const pcts = {};
    Object.keys(occurs.byValue).forEach(value => {
      pcts[value] = (occurs.byValue[value] / occurs.total) * 100;
    });

    return pcts;
  }

  // Return the percentage for a specific value
  percentageFor(value) {
    const pcts = this.percentages();

    // Any error? Just return it
    if (typeof(pcts) === 'string') return pcts;

    // Return the percentage for that specific value
    return pcts[value];
  }
}

module.exports = DataCollector;
