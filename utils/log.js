var log = require('winston'),
    config = require('../config');

module.exports = log;
log.add(log.transports.File, { filename: config.get('file_log') });


