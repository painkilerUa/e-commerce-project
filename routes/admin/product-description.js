var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    if(req.params.product_id && isNumeric(req.params.product_id)){
        var product_id = req.params.product_id;
    }else{
        var product_id = '';
    }
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    var getProductById = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = "SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity, attr_color, attr_antifreeze_class FROM products WHERE id='" + product_id + "'";
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

    getProductById
        .then(
            resolve => {
                res.render('./admin/edit-product',{title:'', product : resolve[0]});
            },
            reject => {
                log.info('some errors in proces gettig data orders from DB on page ./admin/products-list ' + reject);
            }
        );
}

