"use strict"
const manage = require('../../../manage');
const log = require('../../../utils/log');

module.exports = function(req, res, next){
    if(req.user.scope){
        let getProducts = new Promise((resolve, reject) =>{
            let connection = manage.createConnection();
            let SQLquery = "SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products;";
            connection.query(SQLquery, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                resolve(rows);
            });
        })
        getProducts.then(
            resolve => {
                res.send(resolve)
            }, reject => {
                log.info('some errors in getting customers from DB ' + reject);
                res.status(500).send('Products were not gotten')
            })
    }
}

