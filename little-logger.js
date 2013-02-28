var pad = function(p, v) {
  v = v + '';
  var padLength = p - v.length;
  return padLength > -1 ? Array(padLength+1).join('0') + v : v;
};

var getFormatFunctions = function(utc) {
  var getf = function(name, padding) {
    return function(d) {
      var val = d[name].call(d);
      return padding ? pad(padding, val) : val;
    }
  };
  var utcStr = utc ? 'UTC' : '';
  return {
    'D': getf('to' + utcStr + 'String'),
    'Y': getf('get' + utcStr + 'FullYear'),
    'm': function(d) { return pad(2, d.getMonth() + 1); },
    'd': getf('get' + utcStr + 'Date', 2),
    'H': getf('get' + utcStr + 'Hours', 2),
    'M': getf('get' + utcStr + 'Minutes', 2),
    'S': getf('get' + utcStr + 'Seconds', 2),
    'f': getf('get' + utcStr + 'Milliseconds', 3),
    '%': function(d) { return '%'; },
    'l': function(d, l, a) { return l; },
    'a': function(d, l, a) { return a; }
  }
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
  var date = new Date();
  var buff = [];
  for (var i = 0, len = this.options.format.length; i < len; i++) {
    var c1 = this.options.format[i];
    if (c1 === '%' && i < len - 1) {
      var c2 = this.options.format[++i];
      if (c2 in this.formatFunctions) {
        buff.push(this.formatFunctions[c2].call({}, date, level, msg));
      } else {
        buff.push(c1);
        buff.push(c2);
      }
    } else {
      buff.push(c1);
    }
  }
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
