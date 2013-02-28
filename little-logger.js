var pad = function(p, v) {
  v = v + '';
  var padLength = p - v.length;
  return padLength > -1 ? Array(padLength + 1).join('0') + v : v;
};

var getFormatFunctions = function(utc) {
  var getf = function(name, padding) {
    return function(d) {
      var val = d[name]();
      return padding ? pad(padding, val) : val;
    };
  };
  var utcStr = utc ? 'UTC' : '';
  return {
    'D': getf('to' + utcStr + 'String'),
    'Y': getf('get' + utcStr + 'FullYear'),
    'm': function(d) { return pad(2, d['get' + utcStr + 'Month']() + 1); },
    'd': getf('get' + utcStr + 'Date', 2),
    'H': getf('get' + utcStr + 'Hours', 2),
    'M': getf('get' + utcStr + 'Minutes', 2),
    'S': getf('get' + utcStr + 'Seconds', 2),
    'f': getf('get' + utcStr + 'Milliseconds', 3),
    '%': function() { return '%'; },
    'l': function(d, l, a) { return l; },
    'a': function(d, l, a) { return a; }
  };
};

var getArgumentsAsArray = function(args) {
  return [].splice.call(args, 0);
};

var getBooleanValue = function(val, default_val) {
  return (val === true || val === false) ? val : default_val;
};

var Logger = exports.Logger = function(level, options) {
  this.level(level || 'info');
  options = options || {};
  options.color = getBooleanValue(options.color, true);
  options.utc = getBooleanValue(options.utc, false);
  options.format = options.format || '%Y-%m-%d %H:%M:%S.%f %l: %a';
  options.writer = options.writer || console.log;
  this.options = options;
  this.formatFunctions = getFormatFunctions(this.options.utc);
};

Logger.LOG_LEVELS = {
  'DEBUG': {value: 10, color: '\033[34m'},
  'INFO': {value: 20},
  'WARN': {value: 30, color: '\033[33m'},
  'ERROR': {value: 40, color: '\033[31m'}
};

Logger.prototype.level = function(opt_level) {
  if (opt_level) this.level_key = opt_level.toUpperCase();
  return this.level_key;
};

Logger.prototype.log = function(level, msg) {
  var msg_val = Logger.LOG_LEVELS[level.toUpperCase()];
  var log_val = Logger.LOG_LEVELS[this.level_key.toUpperCase()];
  var date = new Date(), buff = [], prevPos = 0, pos = -1;
  var format = this.options.format;
  // Using indexOf will probably be fastest, according to:
  // http://jsperf.com/multiple-string-replace
  while ((pos = format.indexOf('%', prevPos)) > -1) {
    buff.push(format.substring(prevPos, pos));
    var c1 = format.charAt(++pos);
    if (this.formatFunctions.hasOwnProperty(c1)) {
      buff.push(this.formatFunctions[c1].call({}, date, level, msg));
    } else {
      buff.push('%', c1);
    }
    prevPos = pos + 1;
  }
  buff.push(format.substring(prevPos));
  if (this.options.color && msg_val.color) {
    buff.unshift(msg_val.color);
    buff.push('\033[0m');
  }
  var formattedMsg = buff.join('');
  if (msg_val.value >= log_val.value) {
    var writer = msg_val.writer || this.options.writer;
    var args = getArgumentsAsArray(arguments).splice(2);
    args.unshift(formattedMsg);
    writer.apply(this, args);
  }
  return {
    date: date,
    level: level,
    message: msg,
    formattedMessage: formattedMsg
  };
};

for (var level in Logger.LOG_LEVELS) {
  (function(level) {
    Logger.prototype[level.toLowerCase()] = function(msg) {
      var args = getArgumentsAsArray(arguments);
      args.unshift(level);
      return this.log.apply(this, args);
    };
  })(level);
}
