"use strict"
const _mysql = require('../../../manageSQL')
const log = require('../../../utils/log');






module.exports = function(req, res){
    if(req.user.scope){
        new Promise((resolve, reject) => {
            let SQLquery = "SELECT orders.id, order_user_id, order_prepay, order_del_city, order_del_name, order_del_depart_num, " +
                "order_del_address, order_date, order_status, order_status_date, order_tracking_num, order_is_notificated, order_comment, " +
                "customer_surname, customer_name, customer_patronymic, customer_main_phone, customer_add_phone, customer_add_1_phone," +
                " customer_email, customer_city, customer_del_name, customer_del_depart_num, customer_local_address, customer_comment," +
                "order_detail.id AS detail_order_row_id, detail_order_id, detail_product_id, detail_sell_price, detail_bought_price, detail_quantity," +
                "products.id as product_id, name " +
                "FROM orders INNER JOIN order_detail ON orders.id = detail_order_id INNER JOIN products ON order_detail.detail_product_id = products.id INNER JOIN customers ON orders.order_user_id = customers.id ORDER BY orders.id"
            _mysql(SQLquery, (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            })
        }).then((resolve) => {
            let orders = [];
            for(let i = 0; i < resolve.length; i++){
                if(i && resolve[i].id === resolve[i-1].id){
                    let product = {
                        id: resolve[i].detail_product_id,
                        row_id: resolve[i].detail_order_row_id,
                        name: resolve[i].name,
                        vendor: resolve[i].vendor,
                        price: resolve[i].detail_sell_price,
                        purchase_price: resolve[i].detail_bought_price,
                        category_id: resolve[i].category_id,
                        quantity: resolve[i].detail_quantity
                    }
                    orders[orders.length -1].products.push(product)
                }else {
                    let curOrder = {
                        order_id: resolve[i].id,
                        order_comment: resolve[i].order_comment,
                        order_date: resolve[i].order_date,
                        order_del_address: resolve[i].order_del_address,
                        order_del_city: resolve[i].order_del_city,
                        order_del_depart_num: resolve[i].order_del_depart_num,
                        order_del_name: resolve[i].order_del_name,
                        order_is_notificated: resolve[i].order_is_notificated,
                        order_prepay: resolve[i].order_prepay,
                        order_status: resolve[i].order_status,
                        order_status_date: resolve[i].order_status_date,
                        order_tracking_num: resolve[i].order_tracking_num,
                        order_user_id: resolve[i].order_user_id,
                        order_comment: resolve[i].order_comment,
                        products: [{
                            id: resolve[i].detail_product_id,
                            row_id: resolve[i].detail_order_row_id,
                            name: resolve[i].name,
                            vendor: resolve[i].vendor,
                            price: resolve[i].detail_sell_price,
                            purchase_price: resolve[i].detail_bought_price,
                            category_id: resolve[i].category_id,
                            quantity: resolve[i].detail_quantity

                        }],
                        customer_name: resolve[i].customer_name,
                        customer_patronymic: resolve[i].customer_patronymic,
                        customer_surname: resolve[i].customer_surname,
                        customer_main_phone: resolve[i].customer_main_phone,
                        customer_add_1_phone: resolve[i].customer_add_1_phone,
                        customer_add_phone: resolve[i].customer_add_phone,
                        customer_email: resolve[i].customer_email
                    }
                    orders.push(curOrder);
                }
            }
            res.send(orders);
        }).catch((err) => {
            log.info('Error in process getting orders data ' + err)
            res.status(501).send('Orders have not been got')
        })
//SELECT * FROM orders INNER JOIN order_detail ON orders.id = order_detail.detail_order_id INNER JOIN products ON order_detail.detail_product_id = products.id;
    }
}
