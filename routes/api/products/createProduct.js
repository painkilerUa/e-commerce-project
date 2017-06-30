"use strict"
const manage = require('../../../manage');
const log = require('../../../utils/log');

module.exports = function(req, res, next){
    req
    // let createCustomer = new Promise((resolve, reject) =>{
    //     let connection = manage.createConnection();
    //     let col_name = [];
    //     let values = [];
    //     for(let i in req.body){
    //         col_name.push(i);
    //         values.push(req.body[i])
    //     }
    //
    //     let SQLquery = "INSERT INTO customers (" + col_name.join(', ') + ") VALUES ('" + values.join("', '") + "');";
    //     connection.query(SQLquery, (err, rows, fields) => {
    //         if (err) {
    //             reject(err);
    //             connection.end();
    //         }
    //         connection.end();
    //         resolve(rows.insertId);
    //     });
    // })
    // createCustomer.then(
    //     resolve => {
    //         res.send({customer_id: resolve})
    // }, reject => {
    //     log.info('some errors in process creating new customer ' + reject);
    //     res.status(501).send('Customer was not added')
    // })
}

