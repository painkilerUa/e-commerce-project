var manage = require('../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../utils/log'),
    fs = require('fs');

module.exports = function(req, res, next){
    importAntifreeze(res);
}

function importAntifreeze(res){
    var promiseGetProductsFromExelFile = new Promise ((resolve, reject) => {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('./import/antifreeze.xlsx')
        .then(
            (data) => {
                var importProducts = [];
                var rows = data['_worksheets'][1]['_rows'];
//              console.log(rows[7]['_cells'][0]['_value']['value'])
                for(var i = 1; i < rows.length; i++){
                    var currProd = {};
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][0] != undefined){
                        currProd.name = rows[i]['_cells'][0]['_value']['value'];
                    } else {
                        continue
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][5] != undefined){
                        currProd.short_description = rows[i]['_cells'][5]['_value']['value'];
                    } else{
                        currProd.short_description = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][6] != undefined){
                        currProd.description = rows[i]['_cells'][6]['_value']['value'];
                    } else{
                        currProd.description = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][7] != undefined){
                        currProd.price = rows[i]['_cells'][7]['_value']['value'];
                    } else{
                        currProd.price = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][10] != undefined){
                    currProd.category_id = rows[i]['_cells'][10]['_value']['value'];;
                    } else{
                        currProd.category_id = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][8] != undefined){
                        currProd.img_url = '/static/catalog/' + currProd.category_id + '/'+ rows[i]['_cells'][8]['_value']['value'];
                    } else{
                        currProd.img_url = '';
                    }
                     if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][11] != undefined){
                        currProd.quantity = rows[i]['_cells'][11]['_value']['value'];
                    } else{
                        currProd.quantity = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][9] != undefined){
                        currProd.vendor = rows[i]['_cells'][9]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                    } else{
                        currProd.vendor = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][2] != undefined){
                        currProd.attr_manufacturer = rows[i]['_cells'][2]['_value']['value'];
                    } else {
                        currProd.attr_manufacturer = '';
                    }
                    currProd.product_url = currProd.attr_manufacturer.toString().replace(/\s/g, '').toLowerCase() + '-' + currProd.vendor;
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][1] != undefined){
                        currProd.attr_capacity = rows[i]['_cells'][1]['_value']['value'];
                    } else {
                        currProd.attr_capacity = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][3] != undefined){
                        currProd.attr_color = rows[i]['_cells'][3]['_value']['value'];
                    } else {
                        currProd.attr_color = '';
                    }
                    if (rows[i]['_cells'][0]['_value']['value'] != null && rows[i]['_cells'][4] != undefined){
                        currProd.attr_antifreeze_class = rows[i]['_cells'][4]['_value']['value'];
                    } else{
                        currProd.attr_antifreeze_class = '';
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
            promiseArr.push(
                returnExictedVendors => {
                    return resolve[1];
                }
            );
            for(var i = 0; i < resolve[0].length; i++){
                if(resolve[1].indexOf(resolve[0][i]['vendor']) == -1){
                    promiseArr.push(
                        new Promise ((result, error) => {
                            var imgName = resolve[0][i]['img_url'].split('/')[4];
                            var imgPath = resolve[0][i]['img_url'].split('/')[2] + '/' + resolve[0][i]['img_url'].split('/')[3] + '/' + resolve[0][i]['img_url'].split('/')[4];
                            fs.readFile('./temporaryImgImport/' + imgName, (err, data) =>{
                                if (err) error(err);
                                fs.writeFile('./publick/static/' + imgPath, data, err => {
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
                    var existedVendors = resolve[1]();
                    for(var i = 0; i < products.length; i++){
                        if(existedVendors.indexOf(products[i]['vendor']) == -1){
                            var paramsArray = [];
                            for(var attr in products[i]){
                                paramsArray.push(products[i][attr]);
                            }
                            promiseArr.push(
                                new Promise( (result, error) => {
                                    var connection = manage.createConnection();
                                    var SQLquery = "INSERT INTO import (name, short_description, description, price, category_id, img_url, quantity, vendor, attr_manufacturer, product_url, attr_capacity, attr_color, attr_antifreeze_class) VALUES ('" + paramsArray.join("','") + "')";
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
                            SQLquery = "INSERT INTO products (name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_manufacturer, attr_capacity, attr_color, attr_antifreeze_class) SELECT name, short_description, description, price, purchase_price, status, meta_title, product_url, img_url, quantity, vendor, category_id, attr_manufacturer, attr_capacity, attr_color, attr_antifreeze_class FROM import";
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



