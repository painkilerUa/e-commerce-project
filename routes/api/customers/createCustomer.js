"use strict"
const _mysql = require('../../../manageSQL')
const log = require('../../../utils/log');

module.exports = function(req, res, next){
    let customer = Object.assign({}, req.body)

    new Promise((resolve, reject) => {
        let SQLquery = "INSERT INTO customers " + queryObjToString(customer);
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows.insertId);
            }
        })
    }).then((resolve) => {
        res.send({customer_id: resolve})
    }).catch((err) => {
        log.info('Error in process adding order data to DB' + err)
        res.status(501).send('Customer was not added')
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
}

