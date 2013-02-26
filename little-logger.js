var Logger = exports.Logger = function(level, options) {
  this.level(level);

  options = options || {};
  options.color = options.color || true;
  options.format = options.format || '%d %l: %m';
  this.options = options;
};

Logger.LOG_LEVELS = {
  'DEBUG': {value: 10, color: '\033[34m'},
  'INFO': {value: 20, color: '\033[0m'},
  'WARN': {value: 30, color: '\033[33m'},
  'ERROR': {value: 40, color: '\033[31m'}
};

Logger.prototype.level = function(opt_level) {
  if (opt_level) {
    this.level_key = level.toUpperCase();
    this.level_val = Logger.LOG_LEVELS[this.level_key];
  }
  return this.level_key;
};

Logger.prototype.log = function(level, msg, opt_val) {
  var val = opt_val || Logger.LOG_LEVELS[level];
  if (val.value >= this.level_val.value) {
    msg = this.options.format.replace('%d', new Date()).replace('%l', level).replace('%m', msg);
    if (this.options.color) {
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
