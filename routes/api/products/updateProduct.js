"use strict"

const log = require('../../../utils/log')
const _mysql = require('../../../manageSQL')
const fs = require('fs')
const path = require('path')

module.exports = (req, res) => {
    let product = JSON.parse(req.body.props);

    let saveImg = new Promise((resolve, reject) => {
        if(req.files.length){
            let filePath = path.format({
                dir: './publick/static/catalog/' + (product.category ? product.category : 0),
                name: product.vendor,
                ext: '.' + req.files[0].mimetype.split('/')[1]
            });
            fs.writeFile(filePath, req.files[0].buffer, (err) => {
                if (err){
                    reject(err);
                }else{
                    resolve('The file has been saved!');
                }
            });
        }else{
            resolve('')
        }
    });

    let createProduct = new Promise((resolve, reject) =>{

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

        let SQLquery = "UPDATE products SET " + queryObjToStringForUpdate(product) + " WHERE id=" + product.id;
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve('resolve');
            }
        })

    })
    Promise.all([saveImg, createProduct]).then(
        resolve => {
            res.send('Product has been successfully updated')
        }, reject => {
            res.status(501).send('Product was not added');
            log.info('some errors in process updating product ' + reject);
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
