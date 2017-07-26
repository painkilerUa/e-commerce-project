"use strict"
const log = require('../../../utils/log')
const _mysql = require('../../../manageSQL')

module.exports = (req, res) => {
    let customer = Object.assign({}, req.body)

    new Promise((resolve, reject) => {
        let SQLquery = "UPDATE customers SET " + queryObjToStringForUpdate(customer) + " WHERE id=" + customer.id;
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve('resolve');
            }
        })
    }).then((resolve) => {
        res.send('Customer has been successfully updated')
    }).catch((err) => {
        log.info('Error in process editing customer data' + err)
        res.status(501).send('Customer has not been updated')
    })
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
