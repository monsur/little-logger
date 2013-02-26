var Logger = exports.Logger = function(level, options) {
  this.level(level);

  options = options || {};
  options.color = options.color || true;
  options.format = options.format || '%Y/%m/%d %H:%M:%S.%f %level: %message';
  options.utc = options.utc || false;
  this.options = options;
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
  var val = opt_val || Logger.LOG_LEVELS[level];
  var date = new Date();
  var utc = this.options.utc;
  if (val.value >= this.level_val.value) {
    msg = (this.options.format
        .replace('%D', utc ? date.toUTCString() : date.toString())
        .replace('%Y', utc ? date.getUTCFullYear() : date.getFullYear())
        .replace('%m', 1 + (utc ? date.getUTCMonth() : date.getMonth()))
        .replace('%d', utc ? date.getUTCDate() : date.getDate())
        .replace('%H', utc ? date.getUTCHours() : date.getHours())
        .replace('%M', utc ? date.getUTCMinutes() : date.getMinutes())
        .replace('%S', utc ? date.getUTCSeconds() : date.getSeconds())
        .replace('%f', utc ? date.getUTCMilliseconds() : date.getMilliseconds())
        .replace('%level', level)
        .replace('%message', msg));
    if (this.options.color && val.color) {
      msg = val.color + msg + '\033[0m';
    }
    console.log(msg);
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
