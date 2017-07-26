"use strict"
const log = require('../../../utils/log')
const _mysql = require('../../../manageSQL')

module.exports = (req, res) => {

    let actionName = req.body.method;
    let actionData = req.body.data;

    switch (actionName) {
        case 'fullEditing':
            fullEditingOrder(actionData);
            break;
        case 'changeStatusOrder':
            changeStatusOrder(actionData);
            break;
    }

    function fullEditingOrder(actionData) {
        if (req.user.scope === 'manager' && actionData.order_status === 'confirmed') {
            res.status(401).send('Insufficient rights for this action')
            return
        }
        let order = {
            order_user_id: actionData.order_user_id,
            order_prepay: actionData.order_prepay,
            order_del_city: actionData.order_del_city,
            order_del_name: actionData.order_del_name,
            order_del_depart_num: actionData.order_del_depart_num,
            order_del_address: actionData.order_del_address,
            order_date: actionData.order_date,
            order_status: actionData.order_status,
            order_status_date: actionData.order_status_date,
            order_comment: actionData.order_comment,
            order_tracking_num: actionData.order_tracking_num
        }

        new Promise((resolve, reject) => {
            let SQLquery = "UPDATE orders SET " + queryObjToStringForUpdate(order) + " WHERE id=" + actionData.order_id;
            _mysql(SQLquery, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('resolve');
                }
            })
        }).then((resolve) => {
            let addOrderDetailChain = Promise.resolve();
            for (let product of actionData.products) {
                addOrderDetailChain = addOrderDetailChain.then(addOrderDetail(product));
            }
            addOrderDetailChain.then((resolve) => {
                res.send("Order was successfully updated")
            })
        }).catch((err) => {
            log.info('Error in process adding order data to DB' + err);
            res.status(501).send('Order was not added')
        })

        function queryObjToStringForUpdate(queryObj) {
            let query = '';
            Object.keys(queryObj).forEach((key) => {

                if(key === 'id' && !queryObj[key]) return;
                if (typeof(queryObj[key]) === "string") {
                    query += key + "='" + queryObj[key] + "', "
                } else {
                    query += key + "=" + queryObj[key] + ", "
                }
            })
            return query.slice(0, -2)
        }

        function queryObjToStringForInsert(queryObj) {
            let firstPart = '(';
            let secondPart = "";
            for (let i in queryObj) {
                if(i === 'id' && !queryObj[i]) continue;
                firstPart += i + ', ';
                if (typeof(queryObj[i]) === "string") {
                    secondPart += "'" + queryObj[i] + "', "
                } else {
                    secondPart += queryObj[i] + ", "
                }

            }
            return firstPart.slice(0, -2) + ") VALUES (" + secondPart.slice(0, -2) + ")"
        }

        function addOrderDetail(product) {
            return () => {
                let order_detail = {
                    id: product.row_id,
                    detail_order_id: actionData.order_id,
                    detail_product_id: product.id,
                    detail_sell_price: product.price,
                    detail_bought_price: product.purchase_price,
                    detail_quantity: product.quantity
                }
                return new Promise((resolve) => {
                    let SQLquery = "INSERT INTO order_detail " + queryObjToStringForInsert(order_detail) + " ON DUPLICATE KEY UPDATE " + queryObjToStringForUpdate(order_detail);
                    _mysql(SQLquery, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        resolve();
                    })
                })
            }
        }
    }

    function changeStatusOrder(actionData){
        if (req.user.scope === 'manager' && actionData.order_status === 'confirmed') {
            res.status(401).send('Insufficient rights for this action')
            return
        }

        new Promise((resolve, reject) => {
            let SQLquery = "UPDATE orders SET order_status='" + actionData.order_status + "', order_status_date=" + (+new Date()) + " WHERE id=" + actionData.order_id;
            _mysql(SQLquery, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('resolve');
                }
            })
        }).then((resolve) => {
            res.send('Order status has been successfully updated')
        }).catch((err) => {
            log.info('Error in process updating order status' + err);
            res.status(501).send('Error in process updating order status')
        })
    }
}
