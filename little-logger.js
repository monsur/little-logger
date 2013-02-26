var Logger = exports.Logger = function(level, options) {
  this.level(level);

  options = options || {};
  options.color = options.color || true;
  options.format = options.format || '%Y/%m/%d %H:%M:%S.%f %l: %a';
  options.utc = options.utc || false;
  options.writer = options.writer || console.log;
  this.options = options;

  var utcStr = this.options.utc ? 'UTC' : '';
  this.dateFunctions = {
      '%D': 'to' + utcStr + 'String',
      '%Y': 'get' + utcStr + 'FullYear',
      '%m': 'get' + utcStr + 'Month',
      '%d': 'get' + utcStr + 'Date',
      '%H': 'get' + utcStr + 'Hours',
      '%M': 'get' + utcStr + 'Minutes',
      '%S': 'get' + utcStr + 'Seconds',
      '%f': 'get' + utcStr + 'Milliseconds'};
};

Logger.LOG_LEVELS = {
  'DEBUG': {value: 10, color: '\033[34m'},
  'INFO': {value: 20},
  'WARN': {value: 30, color: '\033[33m'},
  'ERROR': {value: 40, color: '\033[31m'}
};

Logger.prototype.level = function(opt_level) {
  if (opt_level) {
    this.level_key = opt_level.toUpperCase();
    this.level_val = Logger.LOG_LEVELS[this.level_key];
  }
  return this.level_key;
};

Logger.prototype.log = function(level, msg, opt_val) {
  var val = opt_val || Logger.LOG_LEVELS[level.toUpperCase()];
  var date = new Date();
  var utc = this.options.utc;
  if (val.value >= this.level_val.value) {
    var msg_ = this.options.format;
    for (var format in this.dateFunctions) {
      var result = date[this.dateFunctions[format]].call(date);
      if (format === '%m') {
        result = result + 1;
      }
      msg_ = msg_.replace(format, result);
    }
    msg_ = msg_.replace('%l', level).replace('%a', msg);
    if (this.options.color && val.color) {
      msg_ = val.color + msg_ + '\033[0m';
    }
    this.options.writer(msg_);
  }
};

for (var level in Logger.LOG_LEVELS) {
  var val = Logger.LOG_LEVELS[level];
  (function(level, val) {
    Logger.prototype[level.toLowerCase()] = function(msg) {
      this.log(level, msg, val);
    };
  })(level, val);
}
