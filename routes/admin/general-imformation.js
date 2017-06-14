var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    var getGeneralInformation = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = "SELECT last_update_products FROM general_information";;
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows);
        });
    });

    getGeneralInformation.then(
            resolve => {
                var data = {};
                data.last_update_products = resolve[0].last_update_products;
                res.render('./admin/general-information',{title:'', data : data});
            },
            reject => {
                log.info('some errors in proces gettig data from general_information table./admin/general-information ' + reject);
            }
    );
}

