"use strict"
const manage = require('../../../manage');
const log = require('../../../utils/log');
const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next){
    let saveImg = new Promise((resolve, reject) => {
        if(req.files.length){
            let filePath = path.format({
                dir: './publick/static/',
                name: req.body.vendor,
                ext: '.' + req.files[0].mimetype.split('/')[1]
            });
            fs.writeFile(filePath, req.files[0].buffer, (err) => {
                if (err) reject(err);
                resolve('The file has been saved!');
            });
        }else{
            resolve('')
        }
    });
    let createProduct = new Promise((resolve, reject) =>{
        let connection = manage.createConnection();
        let query = Object.assign({}, req.body);

        if(!query['category_id']){
            query['category_id'] = 0;
        }
        query['product_url'] = req.body.vendor;
        if(req.files.length){
            if(query.category_id === 1){
                query['img_url'] = '/static/catalog/1/' + query.attr_manufacturer + '/' + query.vendor + '.' + req.files[0].mimetype.split('/')[1];
            }else{
                query['img_url'] = '/static/catalog/' + query.category_id + '/' + query.vendor + '.' + req.files[0].mimetype.split('/')[1];
            }
        }
        function queryObjToString(query){
            let firstPart = '(';
            let secondPart = "'";
            for(let i in query){
                firstPart += i + ', ';
                secondPart += query[i] + "', '"
            }
            return firstPart.slice(0, -2) +") VALUES (" + secondPart.slice(0, -3) + ");"
        }

        let SQLquery = "INSERT INTO products " + queryObjToString(query);
        console.log(SQLquery)
        connection.query(SQLquery, (err, rows, fields) => {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows.insertId);
        });
    })
    Promise.all([saveImg, createProduct]).then(
        resolve => {
            res.send({product_id: resolve[1]})
        }, reject => {
            log.info('some errors in process creating new product ' + reject);
            res.status(501).send('Product was not added')
    })
}

