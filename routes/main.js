var manage = require('../manage.js'),
    fs = require('fs'),
    log = require('../utils/log');




module.exports = function(req, res, next){
    var promiseDataPopProduct = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = 'SELECT id, name, product_url, img_url, price from products where id IN(50,142,10,71,20,5,950,180,790,887,1224)';

        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            resolve(rows);
            connection.end();
        });
    });
    var promiseGetManufacturers = new Promise((resolve, reject) => {
        fs.readFile('./data/manufacturers.json', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });

    Promise.all([promiseDataPopProduct, promiseGetManufacturers])
        .then(
            result => {
                res.render('index',{title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел', popProd : result[0], manufacturers: result[1]});
            },
            reject => {
                log.info('some promise used in index.pug have a error ' + reject);
            }
        );

}





