const DataCollector = require('../data-collector')

const collector = new DataCollector({
	minDataPoints: 60,
	maxDataPoints: 1000,
	dataTimeout: 1000,
});

const int = setInterval(() => {
  collector.add(Math.random() > 0.2 ? 'on' : 'off');
}, 1);

setTimeout(() => {
  clearInterval(int);
}, 2000);

setTimeout(() => {
  console.log(collector.percentages());
  console.log(collector.percentageFor('on'));
}, 2100);
