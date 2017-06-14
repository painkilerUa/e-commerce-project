var manage = require('../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../utils/log'),
    fs = require('fs');
var mysql      = require('mysql');

module.exports = function(req, res, next){
    switch (+req.params['id_part']){
        case 1:
            createTemporaryFiles(res);
        break;
        case 2:
            addRowsFromImportToProducts(res);
        break;
    }
}

function createTemporaryFiles(res) {
    var promisesImgRez = [];
    var promiseGetExictedVendors = new Promise((resolve, reject) =>{
    var connection = manage.createConnection(),
        SQLquery = 'SELECT vendor from products';

        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            var vendorArr = [];
            for(var i = 0; i < rows.length; i++){
                vendorArr.push(rows[i]['vendor']);
            }
            resolve(vendorArr);
        });
    });

    var promiseGetProductsFromExelFile = new Promise ((resolve, reject) => {
        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile('./import/busmarket.xlsx')
            .then(
                (data) => {
                    var importProducts = [];
                    for(var i = 1; i < 6; i++){
                        var currProd = {};
                        currProd.name = data['_worksheets'][1]['_rows'][i]['_cells'][2]['_value']['value'];
                        currProd.price = mathPrice(+data['_worksheets'][1]['_rows'][i]['_cells'][3]['_value']['value'], 29);
                        currProd.purchase_price = +data['_worksheets'][1]['_rows'][i]['_cells'][3]['_value']['value'];                        
                        currProd.vendor = data['_worksheets'][1]['_rows'][i]['_cells'][0]['_value']['value'].replace(/\s/g, '').toLowerCase();
                        currProd.brand = data['_worksheets'][1]['_rows'][i]['_cells'][1]['_value']['value'];
                        currProd.product_url = currProd.brand.toString().replace(/\s/g, '').toLowerCase() + '-' + currProd.vendor.replace(/\//g, '');
                        currProd.category_id = data['_worksheets'][1]['_rows'][i]['_cells'][6]['_value']['value'];
                        currProd.img_url = '/static/catalog/' + currProd.category_id + '/' + currProd.vendor.replace(/\//g, '') + '.jpg';
                        currProd.quantity = data['_worksheets'][1]['_rows'][i]['_cells'][4]['_value']['value'];
                        importProducts.push(currProd);
                    };
                    resolve(importProducts);
                }
            )
            .catch(error => {
                log.info('some problem in parsing import file.xlsx ' + error);
            });
    });
    var promiseArr = [];
    Promise.all([promiseGetExictedVendors, promiseGetProductsFromExelFile])
        .then(
            result => {
                var vendorsForImg = [];
                for(var i = 0; i < result[1].length; i++){
                    if(result[0].indexOf(result[1][i]['vendor']) == -1){
                        vendorsForImg.push(result[1][i]['vendor']);
                        promiseArr.push(
                            new Promise((resolve, reject) => {
                                var connection = manage.createConnection();
                                var SQLquery = "INSERT INTO import (name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_manufacturer) VALUES ('" + result[1][i]['name'] + "', '','','" + result[1][i]['price'] + "','" + result[1][i]['product_url'] + "','" + result[1][i]['img_url'] + "','" + result[1][i]['quantity'] + "','" + result[1][i]['vendor'] + "','" + result[1][i]['category_id'] + "','" + result[1][i]['brand'] + "')";
                                connection.query(SQLquery, function(err, rows, fields) {
                                    if (err) {
                                        reject(err);
                                        connection.end();
                                    }
                                    resolve(rows)
                                    connection.end();
                                });
                            })
                        );
                    }
                }
                promiseArr.push(
                    new Promise ((resolve, reject) =>{
                        fs.writeFile('./publick/temporaryfiles/busmarket', vendorsForImg.toString(), err => {
                            if (err) reject (err);
                            resolve('BusmarketVendorsForImg was created');
                        })
                    })
                );
                Promise.all(promiseArr).then(
                    resolve => {
                        var countAffectedRows = 0;
                        for(var i = 0; i < resolve.length - 1; i++){
                            countAffectedRows += +resolve[i].affectedRows
                        }
                        res.send('<p>В таблицу импорта добавленно ' + countAffectedRows + ' товаров</p><p><button onclick = addProductToCatalog()>Продолжить</button></p>');
                    },
                    reject => {
                        log.info('some promise used in importBusmarker have a error ' + reject);
                    }
                );
            },
            reject => {
                log.info('some promise used in importBusmarker have a error ' + reject);
            }
        );
}

function addRowsFromImportToProducts(res){
    var getImagesUrlFromImport = new Promise((resolve, reject) =>{
        var connection = manage.createConnection(),
        SQLquery = 'SELECT img_url from import';
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            var urlArray = [];
            for(var i = 0; i < rows.length; i++){
                urlArray.push(rows[i]['img_url']);
            }
            resolve(urlArray);
        });
    });
    getImagesUrlFromImport.then(
        resolve => {
            var addImgPromArr = [];
            for(var i = 0; i < resolve.length; i++){
                addImgPromArr.push(
                    new Promise ((result, error) =>{
                        var catalogNum = resolve[i].split('/')[2];
                        var imgName = resolve[i].split('/')[3];
                        fs.readFile('./temporaryImgImport/' + imgName, (err, data) =>{
                            if (err) error(err);
                            fs.writeFile('./publick/catalog/' + catalogNum + '/' + imgName, data, err => {
                                if(err) error(err);
                                if(!err) result('Все изображения из папки temporaryImgImport были добавленны в каталог')
                            })
                        });
                    })
                )
            }
            Promise.all(addImgPromArr).then(
                resolve => {
                    var connection = manage.createConnection(),
                    SQLquery = 'INSERT INTO products (name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity) SELECT name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM import';
                    connection.connect();
                    connection.query(SQLquery, function(err, rows, fields) {
                        if (err) {
                            connection.end();
                            res.send('Script could not added rows from import table to products tables ' + err);
                        }
                        SQLquery = 'delete from import';
                        connection.query(SQLquery, function(errors, data, fields) {
                            if (err) {
                               connection.end();
                               res.send('Script could not delete rows from import table ' + err);
                            }
                            connection.end();
                            res.send('<p>' + resolve[0] + '</br>' + 'В таблицу товаров добавленно ' + rows['affectedRows'] +' товаров</br>'+ 'Из таблицы импорта удалено ' + data['affectedRows'] + 'товаров');
                        });
                    });
                },
                reject => {
                    res.send(reject);
                }
            )
        },
        reject => {
            res.send(reject);
        }
    );
    
}
            // Rules for definition costs
    function mathPrice(price, currencyRate){
        if(price <= 35) return Math.round(price*1.2*currencyRate);
        if(35 < price || price <= 70) return Math.round(price*1.15*currencyRate);
        if(70 < price || price <= 100) return Math.round(price*1.1*10*currencyRate);
        if(price => 100) return Math.round(price*1.08*currencyRate);
    };
