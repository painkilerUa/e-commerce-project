var manage = require('../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../utils/log'),
    fs = require('fs');

module.exports = function(req, res, next){
    var getAllProducts = new Promise((resolve, reject)=>{
        var connection = manage.createConnection(),
        SQLquery = "SELECT id, name, price, quantity, vendor, category_id, provider_num FROM products";
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
    getAllProducts.then(
        resolve =>{
            res.send(JSON.stringify(resolve));
        },
        reject => {
            log.info('some errors in proces gettig data products from DB on page ./admin/cabinet-ajax ' + reject);
        }
    )
}




