# asdrubal

A data collection module which keeps the last N datapoints and returns the distribution percentages of each value. It also supports data point expiration.

## How to use it ?

	const DataCollector = require('asdrubal');
	const collector = new DataCollector({...opts});

	// Add values to it
	for (let x = 0; x < 3; x++)
	  collector.add('likes_it');
	for (let x = 0; x < 2; x++)
	  collector.add('doesnt_like_it');

	// Get raw number of occurrences
	console.log(collector.occurrences());

	// Get value distribution percentage
	console.log(collector.percentages());

	// Get a specific percentage
	console.log(collector.percentageFor('likes_it'));


## Supported options

These are the options which can be sent to the constructor:
- `minDataPoints`: The minimum number of data points to generate distribution percentages; If there are less datapoints than the value specified here, the `percentages()` and `percentageFor()` will return `NOT_ENOUGH_DATAPOINTS` or whathever the `onNotEnoughDataPoints` optional function returns;
- `maxDataPoints`: The number of datapoints after which they'll start to be dropped on `add()`;
- `dataTimeout`: The datapoint timeout (in ms or `undefined`);
- `onNotEnoughDataPoints`: The function to call when there are not enough datapoints to generate percentages.

