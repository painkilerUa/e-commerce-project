var express = require('express'),
    app = express(),
    middleware = require('./middleware')(app, express),
    config = require('./config'),
    log = require('./utils/log');

app.listen(config.get('port'), function(){
   log.info('Express server listening on port ' + config.get('port'));

});