"use strict"
const manage = require('../../../manage')
const log = require('../../../utils/log')
const _mysql = require('../../../manageSQL')

module.exports = function(req, res, next){
    let order = Object.assign({}, req.body)

    order
    // let createOrder = new Promise((resolve, reject) => {
    //     let SQLquery = "INSERT INTO products " + queryObjToString(product);
    //     _mysql(SQLquery, (err, rows) => {
    //         if(err){
    //             reject(err);
    //         }
    //         resolve(rows.insertId);
    //     })
    //
    // });
    //
    // function queryObjToString(query){
    //     let firstPart = '(';
    //     let secondPart = "";
    //     for(let i in query){
    //         firstPart += i + ', ';
    //         if(typeof(query[i]) === "string"){
    //             secondPart += "'" + query[i] + "', "
    //         }else{
    //             secondPart += query[i] + ", "
    //         }
    //
    //     }
    //     return firstPart.slice(0, -2) +") VALUES (" + secondPart.slice(0, -2) + ");"
    // }
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // let createOrder = new Promise((resolve, reject) =>{
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
    // createOrder.then(
    //     resolve => {
    //         res.send({_id: resolve})
    //     }, reject => {
    //         log.info('some errors in process creating new customer ' + reject);
    //         res.status(501).send('Customer was not added')
    //     })
}
