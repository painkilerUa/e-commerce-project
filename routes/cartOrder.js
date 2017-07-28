"use strict"
const log = require('../utils/log')
const _mysql = require('../manageSQL')


module.exports = function(req, res){

    let customerQuery = {};
    let orderQuery = {
        order_prepay: 'false',
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
        let SQLquery = "SELECT id FROM customers WHERE customer_main_phone=" + customerQuery['customer_main_phone'];
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                if(rows.length !== 0){
                    resolve(rows[0].id)
                }else{
                    resolve(0)
                }
            }
        })
    }).then((resolve) => {

        if(resolve) return resolve;

        return new Promise((resolve, reject) => {
            let SQLquery = "INSERT INTO customers " + queryObjToString(customerQuery);
            _mysql(SQLquery, (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows.insertId);
                }
            })
        })
    }).then((resolve) => {

        orderQuery['order_user_id'] = resolve;

        return new Promise((resolve, reject) => {
            let SQLquery = "INSERT INTO orders " + queryObjToString(orderQuery);
            _mysql(SQLquery, (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows.insertId);
                }
            })
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
        return firstPart.slice(0, -2) +") VALUES (" + secondPart.slice(0, -2) + ");"
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

    function queryObjToStringForUpdate(queryObj) {
        let query = '';
        Object.keys(queryObj).forEach((key) => {

            if (typeof(queryObj[key]) === "string") {
                query += key + "='" + queryObj[key] + "', "
            } else {
                query += key + "=" + queryObj[key] + ", "
            }
        })
        return query.slice(0, -2)
    }
}

