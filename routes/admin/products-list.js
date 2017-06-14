var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    var getAllProducts = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = 'SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity, attr_color, attr_antifreeze_class FROM products';
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
                res.render('./admin/products-list',{title:'Каталог товаров', products : resolve});
            },
            reject => {
                log.info('some errors in proces gettig data orders from DB on page ./admin/products-list ' + reject);
            }
        );
}

