var manage = require('../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../utils/log'),
    fs = require('fs');
var mysql      = require('mysql');

module.exports = function(req, res, next){
    switch (+req.params['id_part']){
        case 1:
            importOil(res);
        break;
    }
}

function importOil(res){
    var promiseGetProductsFromExelFile = new Promise ((resolve, reject) => {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('./import/oil.xlsx')
        .then(
            (data) => {
                var importProducts = [];
                var rows = data['_worksheets'][1]['_rows'];
                for(var i = 1; i < rows.length; i++){
                    var currProd = {};
                    if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][0]['_value']['value'] != null){
                        currProd.name = rows[i]['_cells'][0]['_value']['value'];
                    } else {
                        continue
                    }
                    if (rows[i]['_cells'][1] != undefined && rows[i]['_cells'][1]['_value']['value'] != null){
                        currProd.attr_type = rows[i]['_cells'][1]['_value']['value'];
                    } else {
                        currProd.attr_type = '';
                    }
                    if (rows[i]['_cells'][2] != undefined && rows[i]['_cells'][2]['_value']['value'] != null){
                        currProd.attr_manufacturer = rows[i]['_cells'][2]['_value']['value'];
                    } else {
                        currProd.attr_manufacturer = '';
                    }
                    if (rows[i]['_cells'][3] != undefined && rows[i]['_cells'][3]['_value']['value'] != null){
                        currProd.attr_vid = rows[i]['_cells'][3]['_value']['value'];
                    } else {
                        currProd.attr_vid = '';
                    }
                    if (rows[i]['_cells'][4] != undefined && rows[i]['_cells'][4]['_value']['value'] != null){
                        currProd.attr_sae = rows[i]['_cells'][4]['_value']['value'];
                    } else{
                        currProd.attr_sae = '';
                    }
                    if (rows[i]['_cells'][5] != undefined && rows[i]['_cells'][5]['_value']['value'] != null){
                        currProd.attr_capacity = +rows[i]['_cells'][5]['_value']['value'];
                    } else{
                        currProd.attr_capacity = '';
                    }
                    if (rows[i]['_cells'][6] != undefined && rows[i]['_cells'][6]['_value']['value'] != null){
                        currProd.price = rows[i]['_cells'][6]['_value']['value'];
                    } else{
                        currProd.price = 1;
                    }
                    if (rows[i]['_cells'][75] != undefined && rows[i]['_cells'][7]['_value']['value'] != null){
                        currProd.short_description = rows[i]['_cells'][7]['_value']['value'];
                    } else{
                        currProd.short_description = '';
                    }
                    if (rows[i]['_cells'][8] != undefined && rows[i]['_cells'][8]['_value']['value'] != null){
                        currProd.description = rows[i]['_cells'][8]['_value']['value'];
                    } else{
                        currProd.description = '';
                    }
                    if (rows[i]['_cells'][9] != undefined && rows[i]['_cells'][9]['_value']['value'] != null){
                        currProd.vendor = rows[i]['_cells'][9]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                    } else{
                        currProd.vendor = '';
                    }
                    currProd.product_url = currProd.attr_manufacturer.toString().replace(/\s/g, '').toLowerCase() + '-' + currProd.vendor;
                    if (rows[i]['_cells'][11] != undefined && rows[i]['_cells'][11]['_value']['value'] != null){
                        currProd.category_id = rows[i]['_cells'][11]['_value']['value'];
                    } else{
                        currProd.category_id = '';
                    }
                    if (rows[i]['_cells'][10] != undefined && rows[i]['_cells'][10]['_value']['value'] != null){
                    currProd.img_url = '/static/catalog/' + currProd.category_id + '/' + currProd.attr_manufacturer.toString().replace(/\s/g, '-').toLowerCase() + '/' + rows[i]['_cells'][10]['_value']['value'];
                    } else{
                        currProd.img_url = '';
                    }
                    if (rows[i]['_cells'][12] != undefined && rows[i]['_cells'][12]['_value']['value'] != null){
                        currProd.quantity = rows[i]['_cells'][12]['_value']['value'];
                    } else{
                        currProd.quantity = '';
                    }
                    importProducts.push(currProd);
                };
                resolve(importProducts);
            },
            err => {
                reject(err);
            }
        )
    });
    
    var getExistedVendorsFromProduc = new Promise((resolve, reject) => {
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
    Promise.all([promiseGetProductsFromExelFile, getExistedVendorsFromProduc]).then(
        resolve => {
            var promiseArr = [];
            promiseArr.push(
                returnProductsFromExelFile => {
                    return resolve[0];
                }
            );
            for(var i = 0; i < resolve[0].length; i++){
                if(resolve[1].indexOf(resolve[0][i]['vendor']) == -1){
                    promiseArr.push(
                        new Promise ((result, error) => {
                            var imgName = resolve[0][i]['img_url'].split('/')[5];
                            var imgPath = resolve[0][i]['img_url'].split('/')[3] + '/' + resolve[0][i]['img_url'].split('/')[4] + '/' + resolve[0][i]['img_url'].split('/')[5];
                            fs.readFile('./temporaryImgImport/' + imgName, (err, data) =>{
                                if (err) error(err);
                                fs.writeFile('./publick/static/catalog/' + imgPath, data, err => {
                                    if(err) error(err);
                                    if(!err) result('Все изображения из папки temporaryImgImport были добавленны в каталог')
                                })
                            });
                        })
                    );
                }
            };

            Promise.all(promiseArr).then(
                resolve => {
                    var promiseArr = [];
                    var products = resolve[0]();
                    for(var i = 0; i < products.length; i++){
                        if(resolve[1].indexOf(products[i]['vendor']) == -1){
                            promiseArr.push(
                                new Promise((result, error) => {
                                    var connection = manage.createConnection();
                                    var SQLquery = "INSERT INTO import (name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, " + (products[i]['attr_sae'] ? 'attr_sae, ' : '') + "attr_capacity) VALUES ('" + products[i]['name'] + "', '" + products[i]['short_description'] + "', '" + products[i]['description'] + "', '" + products[i]['price'] + "', '" + products[i]['product_url'] + "', '" + products[i]['img_url'] + "', '" + products[i]['quantity'] + "', '" + products[i]['vendor'] + "', '" + products[i]['category_id'] + "', '" + products[i]['attr_type'] + "', '" + products[i]['attr_manufacturer'] + "', '" + products[i]['attr_vid'] + "', '" + (products[i]['attr_sae'] ? products[i]['attr_sae'] + "', '" : '') + products[i]['attr_capacity'] + "')";
                                    connection.query(SQLquery, function(err, rows, fields) {
                                        if (err) {
                                            error(err);
                                            connection.end();
                                        }
                                        result(rows)
                                        connection.end();
                                    });
                                })
                            );
                        }
                    };
                    Promise.all(promiseArr).then(
                        resolve => {
                            var connection = manage.createConnection(),
                            SQLquery = "INSERT INTO products (name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity) SELECT name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM import";
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
                            res.send(reject);
                        }
                    );
                },
                reject => {
                    res.send(reject);
                }
            );
        },
        reject => {
            res.send( reject);
        }
    )
}



