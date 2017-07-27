"use strict"
const log = require('../utils/log')
const _mysql = require('../manageSQL')


module.exports = function(req, res){

    let customerQuery = {};
    let orderQuery = {
        order_prepay: false,
        order_date: +new Date(),
        order_status: 'pending',
        order_status_date: +new Date(),
    };

    Object.keys(req.body).forEach((fieldName) => {

        switch(fieldName.match(/^[a-z]+_/)[0].slice(0,-1)) {
            case 'customer':
                customerQuery[fieldName] = req.body[fieldName];
                break;

            case 'order':
                orderQuery[fieldName] = req.body[fieldName];
                break;
        }

    })

    new Promise((resolve, reject) => {
        let SQLquery = "INSERT INTO customers " + queryObjToString(customerQuery) + " ON DUPLICATE KEY SELECT id WHERE customer_main_phone=" + customerQuery['customer_main_phone'];
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows.insertId);
            }
        })
    }).then((resolve) => {

        orderQuery['order_user_id'] = resolve;

        let SQLquery = "INSERT INTO orders " + queryObjToString(orderQuery);
        return _mysql(SQLquery, (err, rows) => {
            if(err){
                throw err;
            }else{
                return rows.insertId;
            }
        })

    }).then((resolve) => {
        let products = JSON.parse(req.body.ordered_products);
        let addOrderDetailChain = Promise.resolve();
        for(let product of products){
            addOrderDetailChain = addOrderDetailChain.then(addOrderDetail(resolve, product));
        }
        addOrderDetailChain.then((resolve) => {
            res.render('succesfull_order',{title: 'Заказ принят успешно', cleanLocalStorage : true, massage : 'Ваш заказ принят. В ближайшее врямя с вами свяжутся наши менеджери для уточнения деталей покупки.'});
        })
    }).catch((err) => {
        log.info('some errors in proces adding data to table orders cartOrder.js ' + err);
        res.render('succesfull_order',{title: 'Ошибки при оформлении заказ', cleanLocalStorage : false, massage : 'В процессе оформления заказа произошли ошибки. Пожалуйста повторите заказ, или свяжитесь с нами по телефону.'});
    })


    function queryObjToString(queryObj){
        let firstPart = '(';
        let secondPart = "";
        for(let i in queryObj){
            firstPart += i + ', ';
            if(typeof(queryObj[i]) === "string"){
                secondPart += "'" + queryObj[i] + "', "
            }else{
                secondPart += queryObj[i] + ", "
            }

        }
        return firstPart.slice(0, -2) +") VALUES (" + secondPart.slice(0, -2) + ")"
    }

    function addOrderDetail(orderId, product){
        return () => {
            let order_detail = {
                detail_order_id: orderId,
                detail_product_id: product.id,
                detail_sell_price: product.price,
                detail_bought_price: product.purchase_price,
                detail_quantity: product.ordered
            }
            return new Promise((resolve) =>{
                let SQLquery = "INSERT INTO order_detail " + queryObjToString(order_detail);
                _mysql(SQLquery, (err, rows) => {
                    if(err){
                        throw err;
                    }
                    resolve();
                })
            })
        }
    }
    // var insertOrder = new Promise ((resolve, reject) => {
    //     var params = req.body;
    //     var values = [];
    //     var ordered_products = JSON.parse(params.ordered_products);
    //     var products_name = [];
    //     var products_quantity = [];
    //     var products_price = [];
    //     for(var i = 0; i < ordered_products.length; i++){
    //         products_name.push(ordered_products[i]['name']);
    //         products_quantity.push(ordered_products[i]['ordered']);
    //         products_price.push(ordered_products[i]['price'])
    //     }
    //     values.push(products_name.join(';'));
    //     values.push(products_quantity.join(';'));
    //     values.push(products_price.join(';'));
    //     values.push(params.last_name);
    //     values.push(params.first_name);
    //     if(params.surname_name){
    //         values.push(params.surname_name);
    //     }else{
    //         values.push('');
    //     }
    //     values.push(params.phone_number);
    //     if(params.is_pikup_from_ofice){
    //         values.push(params.is_pikup_from_ofice);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.is_local_delivery){
    //         values.push(params.is_local_delivery);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.adress_in_kharkiv){
    //         values.push(params.adress_in_kharkiv);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.is_delivery_transport_company){
    //         values.push(params.is_delivery_transport_company);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.city_name){
    //         values.push(params.city_name);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.carrier){
    //         values.push(params.carrier);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.carrier_num_office){
    //         values.push(params.carrier_num_office);
    //     }else{
    //         values.push('');
    //     }
    //     if(params.comment){
    //         values.push(params.comment);
    //     }else{
    //         values.push('');
    //     }
    //     var connection = manage.createConnection(),
    //     SQLquery = "INSERT INTO orders (products_name, products_quantity, products_price, last_name, first_name, surname_name, phone_number, is_pikup_from_ofice, is_local_delivery, adress_in_kharkiv, is_delivery_transport_company, city_name, carrier, carrier_num_office, comment) VALUES ('" + values.join("','") + "')";
    //     console.log(SQLquery);
    //     connection.connect();
    //     connection.query(SQLquery, function(err, rows, fields) {
    //         if (err) {
    //             reject(err);
    //             connection.end();
    //         }
    //         connection.end();
    //         resolve(rows);
    //     });
    // })
    // insertOrder.then(
    //     resolve => {
    //         if(resolve.affectedRows > 0){
    //             res.render('succesfull_order',{title: 'Заказ принят успешно', cleanLocalStorage : true, massage : 'Ваш заказ принят. В ближайшее врямя с вами свяжутся наши менеджери для уточнения деталей покупки.'});
    //         }else{
    //             res.render('succesfull_order',{title: 'Ошибки при оформлении заказ', cleanLocalStorage : false, massage : 'В процессе оформления заказа произошли ошибки. Пожалуйста повторите заказ, или свяжитесь с нами по телефону.'});
    //         }
    //     },
    //     reject => {
    //         res.render('succesfull_order',{title: 'Заказ принят успешно', cleanLocalStorage : false, massage : 'В процессе оформления заказа произошли ошибки. Пожалуйста повторите заказ, или свяжитесь с нами по телефону.'});
    //         log.info('some errors in proces adding data to table orders cartOrder.js ' + reject);
    //     }
    // )
}

