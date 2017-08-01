"use strict"
const _mysql = require('../../../manageSQL')
const log = require('../../../utils/log');

module.exports = (req, res) => {
    new Promise((resolve, reject) => {
        let SQLquery = "SELECT * FROM"
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                res.send(rows[0])
            }
        })
    }).catch((err) => {
        log.info('Error in process getting data about last prices update' + err);
        res.status(501).send('Error in process getting data about last prices update')
    })
}