var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    var getOrderById = new Promise((resolve, reject)=>{
        var connection = manage.createConnection(),
        SQLquery = "SELECT products_name, products_quantity, products_price, last_name, first_name, surname_name, phone_number, is_pikup_from_ofice, is_local_delivery, adress_in_kharkiv, is_delivery_transport_company, city_name, carrier, carrier_num_office, comment FROM orders WHERE id='" + req.params.order_id + "'";
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
    getOrderById.then(
        resolve => {
            var orderedProducts = [];
            products_name = resolve[0].products_name.split(';');
            products_quantity = resolve[0].products_quantity.split(';');
            products_price = resolve[0].products_price.split(';');
            for(var i = 0; i < products_name.length; i++){
                orderedProducts.push({
                    'name' : products_name[i],
                    'price' : products_price[i],
                    'quantity' : products_quantity[i]
                })
            }
            res.render('./admin/order-details',{title: 'Детальное описание заказа', order : resolve[0], products : orderedProducts});
        },
        reject => {
            log.info('some problem in rendering ' + reject);
        }
    )
}

