# little-logger

Sometimes you need a robust logging mechanism for your enterprise-level system. For those times, little-logger is not for you.

Little-logger is a little logging utility for node.js. Its more for those times when you need to sprinkle a little logging in your code.

Though it may be little, it still packs some nice features, like:

  * Four different logging levels: debug, info, warn, error
  * Colorized output
  * Custom formatters for controlling the output
  * Log to stdio, stderr, or specify your own logging function.
  * Small code base: ~100 loc, no external dependencies.


## Install

    npm install little-logger


## Usage

Take a look at [example.js](https://github.com/monsur/little-logger/blob/master/example.js) for complete usage info. Here's an example:

    var logger = require('./little-logger');

    var l = new logger.Logger();
    l.info('The default log level is "info".');

    l = new logger.Logger('debug');
    l.info('This logger will log any message at level DEBUG or higher.');
    l.info('Supports four log levels:');
    l.debug('DEBUG');
    l.info('INFO');
    l.warn('WARN');
    l.error('ERROR');
