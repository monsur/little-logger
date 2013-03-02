# little-logger

Sometimes you need a robust logging mechanism for your enterprise-level system. Little-logger is not for those times.

Little-logger is a little logging utility for Node.js. Its for those times when you need to sprinkle a little logging throughout your code.

Though it may be little, it still packs some nice features, like:

  * Four different logging levels: debug, info, warn, error
  * Colorized output
  * Custom formatters for controlling the output
  * Log to stdio, stderr, or specify your own logging function.
  * Individual levels can be logged to different locations.
  * Small footprint: less than 100 loc, no external dependencies.


## Install

    npm install little-logger

Or just copy [little-logger.js](https://raw.github.com/monsur/little-logger/master/little-logger.js) to your project directory.

## Usage

Take a look at [example.js](https://github.com/monsur/little-logger/blob/master/example.js) for complete usage info. Here's an example:

    var logger = require('little-logger');

    var l = new logger.Logger();
    l.info('The default log level is "info".');

    l = new logger.Logger('debug');
    l.info('This logger will log any message at level DEBUG or higher.');
    l.info('Supports four log levels:');
    l.debug('DEBUG');
    l.info('INFO');
    l.warn('WARN');
    l.error('ERROR');


### Creating a new logger

The `Logger(level, options)` method creates a new log instance. This constructor takes two arguments:

  * _level_ (string) - The level to log. Valid values are 'debug', 'info', 'warn', 'error'. Default value is 'info'.
  * _options_ (object) - An object specifying additional arguments for creating the logger:
    * _color_ (boolean) - Whether the output should be colorized.
    * _format_ (string) - The format of the output message. More on format below.
    * _writer_ (function) - The function that logs the message. Default value is `console.log`.
    * _utc_ (boolean) - Log dates as UTC. Defaults to `false`.


### Message formatting

The _format_ option supports printf-style formatting variables. The default format is:

    %Y-%m-%d %H:%M:%S.%f %l: %a

Whie logs the date in YYYY-mm-dd format, followed by the time, followed by the log level and then the log message. The supported formatting options are:

  * _%D_ - Logs the date as a string, like calling the date's `toString()` method.
  * _%Y_ - The 4-digit year.
  * _%m_ - The month.
  * _%d_ - The date.
  * _%H_ - The hour.
  * _%M_ - The minute.
  * _%S_ - The seconds.
  * _%f_ - The milliseconds.
  * _%l_ - The log level (lowercase).
  * _%L_ - The log level (uppercase).
  * _%a_ - The log message.
  * _%%_ - The '%' symbol.


### Methods

`debug(msg)`
`info(msg)`
`warn(msg)`
`error(msg)` - Logs a message of the given type. Supports additional formatting parameters, see the [Node.js docs](http://nodejs.org/api/util.html#util_util_format_format) for more details.

`log(level, msg)` - Logs a message of the given log level. The methods above are all shorthand for the `log()` method.

`enable()`
`disable()` - Enables or disables logging.

`level()` - Returns the current log level.

`level(l)` - Sets the current log level.




