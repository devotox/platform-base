var util = require('util');
var _ = require('lodash');
var winston = require('winston');
var log_controller = {}; // Create a log controller;


var database = winston.transports.Database = function(options) {

    this.name = 'Database';

    this.options = options;

    this.level = options.level || 'info';
};

util.inherits(database, winston.Transport);

database.prototype.log = function(level, msg, meta, callback) {
    meta.seneca = meta.seneca || global.__seneca__;

    if (!(meta && meta.seneca)) {
        return console.error('** API DATABASE LOG ERROR ** - No Seneca Instance Passed In:', meta && meta.seneca);
    }
    if (!(meta && meta.seneca_function &&
        _.isFunction(log_controller[meta.seneca_function]))) {
        return console.error('** API DATABASE LOG ERROR ** - No Corresponding Seneca Function:', meta && meta.seneca_function);
    }

    var log = log_controller[meta.seneca_function].call(meta.seneca, meta.request, meta.response, level, meta, msg);
    return _.isFunction(callback) && callback(log);
};

module.exports = function(level, to_database, to_console, filename) {

    var options = {
        silent: false,
        colorize: true,
        showLevel: true,
        prettyPrint: true,
        filename: filename,
        level: level || 'error'
    };

    var logger = new(winston.Logger)({
        levels: {
            trace: 0,
            input: 1,
            verbose: 2,
            prompt: 3,
            debug: 4,
            info: 5,
            data: 6,
            help: 7,
            warn: 8,
            error: 9
        },
        colors: {
            trace: 'magenta',
            verbose: 'cyan',
            warn: 'yellow',
            prompt: 'grey',
            input: 'grey',
            debug: 'blue',
            info: 'green',
            data: 'grey',
            help: 'cyan',
            error: 'red'
        }
    });

    if (to_database) {
        logger.add(winston.transports.Database, options);
    }
    if (to_console) {
        logger.add(winston.transports.Console, options);
    }
    if (filename) {
        logger.add(winston.transports.File, options);
    }

    return logger;
};