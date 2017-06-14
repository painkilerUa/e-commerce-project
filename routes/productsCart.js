var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    var getProductByUrl = new Promise ((resolve, reject) =>{
        var connection = manage.createConnection(),
        SQLquery = "SELECT name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products WHERE product_url= '" + req.params.product_url + "'";
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows);
        });
    })

    getProductByUrl.then(
        resolve => {
            res.render('products_cart',{title: ''});
        },
        reject => {
            log.info('some errors in proces rendering Cart page  file productsCart.js ' + reject);
        }
    )
}

