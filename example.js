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
