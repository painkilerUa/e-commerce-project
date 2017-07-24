"use strict"
const log = require('../../../utils/log')
const _mysql = require('../../../manageSQL')

module.exports = (req, res) => {
    if(req.user.scope == 'manager' && req.body.order_status == 'confirmed'){
        res.status(401).send('Insufficient rights for this action')
        return
    }
    let order = {
        order_user_id: req.body.order_user_id,
        order_prepay: req.body.order_prepay,
        order_del_city: req.body.order_del_city,
        order_del_name: req.body.order_del_name,
        order_del_depart_num: req.body.order_del_depart_num,
        order_del_address: req.body.order_del_address,
        order_date: req.body.order_date,
        order_status: req.body.order_status,
        order_status_date: req.body.order_status_date,
        order_comment: req.body.order_comment
    }
    let orderId = null
    new Promise((resolve, reject) => {
        let SQLquery = "UPDATE orders SET " + queryObjToStringForUpdate(order) + " WHERE id=" + req.body.order_id;
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve('resolve');
            }
        })
    }).then((resolve) => {
        let addOrderDetailChain = Promise.resolve();
        for(let product of req.body.products){
            addOrderDetailChain = addOrderDetailChain.then(addOrderDetail(product));
        }
        addOrderDetailChain.then((resolve) => {
            res.send("Order was successfully updated")
        })
    }).catch((err) => {
        log.info('Error in process adding order data to DB' + err);
        res.status(501).send('Order was not added')
    })

    function queryObjToStringForUpdate(queryObj){
        let query = '';
        Object.keys(queryObj).forEach((key) => {

            if(typeof(queryObj[key]) === "string"){
                query += key + "='" + queryObj[key] + "', "
            }else{
                query += key + "=" + queryObj[key] + ", "
            }
        })
        return query.slice(0, -2)
    }

    function queryObjToStringForInsert(queryObj){
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

    function addOrderDetail(product){
        return () => {
            let order_detail = {
                detail_order_id: req.body.order_id,
                detail_product_id: product.id,
                detail_sell_price: product.price,
                detail_bought_price: product.purchase_price,
                detail_quantity: product.quantity
            }
            return new Promise((resolve) =>{
                let SQLquery = "INSERT INTO order_detail " + queryObjToStringForInsert(order_detail) + " ON DUPLICATE KEY UPDATE " + queryObjToStringForUpdate(order_detail);
                _mysql(SQLquery, (err, rows) => {
                    if(err){
                        throw err;
                    }
                    resolve();
                })
            })
        }
    }
}