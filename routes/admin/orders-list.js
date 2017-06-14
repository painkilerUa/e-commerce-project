var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    var getAllProducts = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = 'SELECT id, last_name, first_name, surname_name FROM orders';
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

    getAllProducts
        .then(
            resolve => {
                res.render('./admin/order-list',{title:'Заказы', orders : resolve});
            },
            reject => {
                log.info('some errors in proces gettig data orders from DB on page ./admin/order-list ' + reject);
            }
        );
}

