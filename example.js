// type "node example.js" to run these examples.

var logger = require('./little-logger');

var l = new logger.Logger();
l.info('The default log level is "info".');

l = new logger.Logger('debug');
l.info('This logger will log any message at level DEBUG or higher.');
l.info('Supports four log levels:');
l.debug('\tDEBUG');
l.info('\tINFO');
l.warn('\tWARN');
l.error('\tERROR');

l = new logger.Logger('debug', {color: false});
l.info('By default, output is colorized.');
l.warn('But this can be turned off.');

l = new logger.Logger('info', {format: '%a'});
l.info('The log format can be changed.');

l = new logger.Logger('info', {format: '%m/%d/%Y %H:%M:%S.%f %a', utc: true});
l.info('There are fine-grained controls for displaying the date.');
l.info('And times can be either local or UTC.');

l = new logger.Logger('info', {writer: console.error});
l.info('Logs to stdio by default');
l.info('But can log to stderr as well');

l = new logger.Logger('info', {writer: function(msg) {
  console.log(msg + ' (this message is logged from a custom logger)');
}});
l.info('You can even write your own logger function.');
