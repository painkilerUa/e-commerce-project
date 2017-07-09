"use strict"
const manage = require('../../../manage');
const log = require('../../../utils/log');
const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next){
    let product = JSON.parse(req.body.props);
    let saveImg = new Promise((resolve, reject) => {
        if(req.files.length){
            let filePath = path.format({
                dir: './publick/static/catalog' + product.category ? product.category : 0,
                name: product.vendor,
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

        if(!product['category_id']){
            product['category_id'] = 0;
        }
        if(!product['quantity']){
            product['quantity'] = 0;
        }
        if(!product['status']){
            product['status'] = 0;
        }
        product.vendor = product.vendor.replace(/\//g,'');

        product['product_url'] = product['attr_manufacturer'] ? product['attr_manufacturer'] + '-' : '' + product.vendor;
        if(req.files.length){
            if(product.category_id === 1){
                product['img_url'] = '/static/catalog/1/' + product.attr_manufacturer + '/' + product.vendor + '.' + req.files[0].mimetype.split('/')[1];
            }else{
                product['img_url'] = '/static/catalog/' + product.category_id + '/' + product.vendor + '.' + req.files[0].mimetype.split('/')[1];
            }
        }
        function queryObjToString(query){
            let firstPart = '(';
            let secondPart = "";
            for(let i in query){
                firstPart += i + ', ';
                if(typeof(query[i]) === "string"){
                    secondPart += "'" + query[i] + "', "
                }else{
                    secondPart += query[i] + ", "
                }

            }
            return firstPart.slice(0, -2) +") VALUES (" + secondPart.slice(0, -2) + ");"
        }

        let SQLquery = "INSERT INTO products " + queryObjToString(product);
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

