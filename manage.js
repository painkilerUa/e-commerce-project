var mysql = require('mysql'),
    config = require('./config'),
    log = require('./utils/log');

module.exports = {
    createConnection : function(){
                            return mysql.createConnection({
                                host     : config.get('db_host'),
                                user     : config.get('db_user'),
                                port     : config.get('db_port'),
                                password : config.get('db_password'),
                                database : config.get('db_name')
                            });
                        },
    connect: function(){
                    this.connect(
                        function(err) {
                                if (err) {
                                    log.info('error connecting width db: ' + err.stack);
                                }
                                log.info('connection width db is done');
                            }
                        );
                },
    end: function(){
                this.end(
                        function(err){
                            if(err){
                                log.info('in proces finishing connection happened eror' + err.stack);
                            }
                            console.log('connection finished');
                            log.info('connection width db is finished');
                        }
                    );
    }
}
