var manage = require('../../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../../utils/log'),
    fs = require('fs');

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
        var promiseGetExictedVendors = new Promise((resolve, reject) => {
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
            workbook.xlsx.readFile('./import/omega.xlsx')
                .then(
                    (data) => {
                        var importProducts = [];
                        var rows = data['_worksheets'][1]['_rows'];
                        for(var i = 1; i < rows.length; i++){
                            var currProd = {};
                            if (rows[i]['_cells'][2] != undefined && rows[i]['_cells'][2]['_value']['value'] != null){
                                currProd.name = rows[i]['_cells'][2]['_value']['value'];
                            } else {
                                continue
                            }
                            if (rows[i]['_cells'][5] != undefined && rows[i]['_cells'][5]['_value']['value'] != null){
                                currProd.short_description = rows[i]['_cells'][5]['_value']['value'];
                            } else{
                                currProd.short_description = '';
                            }
                            if (rows[i]['_cells'][6] != undefined && rows[i]['_cells'][6]['_value']['value'] != null){
                                currProd.description = rows[i]['_cells'][6]['_value']['value'];
                            } else{
                                currProd.description = '';
                            }
                            if (rows[i]['_cells'][3] != undefined && rows[i]['_cells'][3]['_value']['value'] != null){
                                currProd.price = rows[i]['_cells'][3]['_value']['value'];
                            } else{
                                currProd.price = '';
                            }
                            if (rows[i]['_cells'][7] != undefined && rows[i]['_cells'][7]['_value']['value'] != null){
                            currProd.category_id = rows[i]['_cells'][7]['_value']['value'];;
                            } else{
                                currProd.category_id = '';
                            }
                            if (rows[i]['_cells'][1] != undefined && rows[i]['_cells'][1]['_value']['value'] != null){
                                currProd.vendor = rows[i]['_cells'][1]['_value']['value'].toString().toLowerCase().replace(/\s/g, '')
                            } else{
                                currProd.vendor = '';
                            }
                            currProd.img_url = '/static/catalog/' + currProd.category_id + '/' + currProd.vendor.toString().replace(/\//g, '') + '.jpg'
                            if (rows[i]['_cells'][4] != undefined && rows[i]['_cells'][4]['_value']['value'] != null){
                                currProd.quantity = rows[i]['_cells'][4]['_value']['value'];
                            } else{
                                currProd.quantity = '';
                            }
                            if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][0]['_value']['value'] != null){
                                currProd.attr_manufacturer = rows[i]['_cells'][0]['_value']['value'];
                            } else {
                                currProd.attr_manufacturer = '';
                            }
                            currProd.product_url = currProd.attr_manufacturer.toString().replace(/\s/g, '').toLowerCase() + '-' + currProd.vendor.replace(/\//g, '');
                            importProducts.push(currProd);
                        };
                        resolve(importProducts);
                    },
                    err => {
                        reject(err);
                    }
                )
        });

        Promise.all([promiseGetExictedVendors, promiseGetProductsFromExelFile]).then(
            result => {
                var vendorsForImg = [];
                var promiseArr = [];
                for(var i = 0; i < result[1].length; i++){
                    if(result[0].indexOf(result[1][i]['vendor']) == -1){
                        vendorsForImg.push(result[1][i]['vendor'].replace(/\//g, ''));
                        var paramsArray = [];
                        for(var attr in result[1][i]){
                            paramsArray.push(result[1][i][attr]);
                        }
                        promiseArr.push(
                            new Promise((resolve, reject) => {
                                var connection = manage.createConnection();
                                var SQLquery = "INSERT INTO import (name, short_description, description, price, category_id, vendor, img_url, quantity, attr_manufacturer, product_url) VALUES ('" + paramsArray.join("','") + "')";
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
                        fs.writeFile('./publick/static/temporaryfiles/omega', vendorsForImg.toString(), err => {
                            if (err) reject (err);
                            resolve('Omega vendors for img was created');
                        })
                    })
                );
                Promise.all(promiseArr).then(
                    resolve => {
                        var countAffectedRows = 0;
                        for(var i = 0; i < resolve.length - 1; i++){
                            countAffectedRows += +resolve[i].affectedRows
                        }
                        res.send('<p>В таблицу импорта добавленно ' + countAffectedRows + ' товаров</p><p>' + resolve[resolve.length - 1] + '</p><p><button onclick = addProductToCatalog() id="add-products-to-catalog">Продолжить</button></p>');
                    },
                    reject => {
                        log.info('some promise used in importOmegaautopostavka have a error ' + reject);
                        res.send(reject);
                    }
                )
            },
            errors => {
                log.info('some promise used in importOmegaautopostavka have a error ' + reject);
                res.send(reject);
            }
        )
    }
    function addRowsFromImportToProducts(res){
        var getImagesUrlFromImport = new Promise((resolve, reject) => {
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
                var addImgProm = [];
                for(var i = 0; i < resolve.length; i++){
                    addImgProm.push(
                        new Promise ((result, error) =>{
                            var catalogNum = resolve[i].split('/')[3];
                            var imgName = resolve[i].split('/')[4];
                            fs.readFile('./temporaryImgImport/' + imgName, (err, data) =>{
                                if (err){
                                    error(err);
                                } 
                                fs.writeFile('./publick/static/catalog/' + catalogNum + '/' + imgName, data, err => {
                                    if(err) error(err);
                                    if(!err) result('Все изображения из папки temporaryImgImport были добавленны в каталог')
                                })
                            });
                        })
                    )
                }
                Promise.all(addImgProm).then(
                    resolve => {
                        var connection = manage.createConnection(),
                        SQLquery = "INSERT INTO products (name, short_description, description, price, category_id, vendor, img_url, quantity, attr_manufacturer, product_url) SELECT name, short_description, description, price, category_id, vendor, img_url, quantity, attr_manufacturer, product_url FROM import";
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
                                res.send('<p> В таблицу товаров добавленно ' + rows['affectedRows'] +' товаров</br>'+ 'Из таблицы импорта удалено ' + data['affectedRows'] + ' товаров');
                            });
                        });
                    },
                    reject => {
                        var connection = manage.createConnection(),
                        SQLquery = 'delete from import';
                        connection.query(SQLquery, function(errors, data, fields) {
                            if (errors) {
                               connection.end();
                               console.log('Script could not delete rows from import table import-omegaautopostavka-ajax ' + err);
                            }
                            connection.end();
                        });
                        res.send(reject);
                    }
                )
            },
            reject => {
                res.send(reject);
            }
        )
    }

