var manage = require('../manage.js'),
    Excel = require('exceljs'),
    log = require('../utils/log');

module.exports = function(){
    var date = new Date();
    var updateTime = date.getTime();
    var getVendorsFromBD = new Promise((resolve, reject) =>{
        var connection = manage.createConnection();
        var SQLquery = "SELECT vendor FROM products";
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            var vendorArray = [];
            for(var i = 0; i < rows.length; i++){
                vendorArray.push(rows[i]['vendor']);
            }
            resolve(vendorArray);
        });
    })
    var getDataFromExelPriceBusmakret = new Promise((resolve, reject) =>{
        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile('./update_price/prices/busmarket.xlsx').then(
            (data) => {
                var importProducts = [];
                var rows = data['_worksheets'][1]['_rows'];
                for(var i = 1; i < rows.length; i++){
                    var currProd = {};
                    if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][1]['_value']['value'] != null){
                        currProd.vendor = rows[i]['_cells'][0]['_value']['value'].replace(/\s/g, '').toLowerCase();
                    } else{
                        continue;
                    }
                    if (rows[i]['_cells'][3] != undefined && rows[i]['_cells'][3]['_value']['value'] != null){
                        currProd.price = mathPrice(rows[i]['_cells'][3]['_value']['value'], 29.3);
                    } else{
                        currProd.price = 0;
                    }
                    importProducts.push(currProd);
                };
                resolve(importProducts);
            },
            err => {
                reject(err);
            }
        )
    })

    Promise.all([getVendorsFromBD, getDataFromExelPriceBusmakret]).then(
        resolve => {
            var promiseArray = [];
            for(var i = 0; i < resolve[1].length; i++){
                if(resolve[0].indexOf(resolve[1][i].vendor) != -1){
                    promiseArray.push(
                        new Promise((result, erorr) =>{
                            var connection = manage.createConnection();
                            var SQLquery = "UPDATE products SET price =" + resolve[1][i].price +" , update_time = "+ updateTime + ", provider_num = 1, quantity=9 WHERE vendor='" + resolve[1][i].vendor + "'";
                            connection.query(SQLquery, function(err, rows, fields) {
                                if (err) {
                                    erorr(err);
                                    connection.end();
                                }
                                connection.end();
                                result(rows);
                            });
                        })
                    )
                }
            }
            Promise.all(promiseArray).then(
                resolve =>{
                    Promise.all([getProductsFromBD(), getDataFromExelPriceMaslotochka()]).then(
                        resolve => {
                            var promiseArray = [];
                            changePriceInDB(resolve, promiseArray, 2);
                            Promise.all(promiseArray).then(
                                resolve =>{
                                    Promise.all([getProductsFromBD(), getDataFromExelPriceOmega()]).then(
                                        resolve =>{
                                            var promiseArray = [];
                                            changePriceInDB(resolve, promiseArray, 3);
                                            Promise.all(promiseArray).then(
                                                resolve => {
                                                    Promise.all([getProductsFromBD(), getDataFromExelPriceLiquiMoly()]).then(
                                                        resolve =>{
                                                            var promiseArray = [];
                                                            changePriceHighestRight(resolve, promiseArray, 5);
                                                            Promise.all(promiseArray).then(
                                                                resolve =>{
                                                                    Promise.all([getProductsFromBD(), getDataFromExelPriceASG()]).then(
                                                                        resolve =>{
                                                                            console.log('date from asg has been gotten');
                                                                            var promiseArray = [];
                                                                            changePriceInDB(resolve, promiseArray, 6);
                                                                            Promise.all(promiseArray).then(
                                                                                resolve =>{
                                                                                    Promise.all([getProductsFromBD(), getDataFromExelPriceMkpp()]).then(
                                                                                        resolve => {
                                                                                            var promiseArray = [];
                                                                                            changePriceHighestRight(resolve, promiseArray, 4);
                                                                                            Promise.all(promiseArray).then(
                                                                                                resolve =>{
                                                                                                    switchOfUnchangedProducts().then(
                                                                                                        resolve =>{
                                                                                                            changeUpdateTime().then(
                                                                                                                resolve => {
                                                                                                                },
                                                                                                                reject => {
                                                                                                                    log.info('some errors in changeUpdateTime function update-price.js ' + reject);
                                                                                                                }
                                                                                                            )
                                                                                                        },
                                                                                                        reject =>{
                                                                                                            log.info('some errors in switchOfUnchangedProducts function update-price.js ' + reject);
                                                                                                        }
                                                                                                    )
                                                                                                },
                                                                                                reject => {
                                                                                                    log.info('some errors in proces udate price Mkpp update-price.js ' + reject);
                                                                                                }
                                                                                            )
                                                                                        },
                                                                                        reject => {
                                                                                            log.info('some errors in proces reading exel file mkpp.xlsx or from DB ' + reject);
                                                                                        }
                                                                                    )
                                                                                },
                                                                                reject =>{
                                                                                    log.info('some errors update price ASG ' + reject);
                                                                                }
                                                                            )
                                                                        },
                                                                        reject =>{
                                                                            log.info('some errors in proces reading exel file asg.xlsx or from DB ' + reject);
                                                                        }
                                                                    )
                                                                },
                                                                reject =>{
                                                                    log.info('some errors update price LiquiMolly ' + reject);
                                                                }
                                                            )
                                                        },
                                                        reject =>{
                                                            log.info('some errors in proces reading exel file 18743.xlsx or from DB ' + reject);
                                                        })
                                                },
                                                reject => {
                                                    log.info('some errors in proces udate price Omegaautopostavka update-price.js ' + reject);
                                                }
                                            )
                                        },
                                        reject =>{
                                            log.info('some errors in proces reading exel file omega.xlsx or from DB ' + reject);
                                        }
                                    );
                                },
                                reject =>{
                                    log.info('some errors in proces udate price maslotochka update-price.js ' + reject);
                                }
                            );
                        },
                        reject => {
                            log.info('some errors in proces reading exel file maslotochka or from DB ' + reject);
                        }
                    )
                },
                reject =>{
                    log.info('some errors in proces udate price busmarket update-price.js ' + reject);
                }
            )
        },
        reject => {
            log.info('some errors in proces reading exel file busmarket.xlsx or from DB ' + reject);
        }
    )

    function getProductsFromBD(){
        return new Promise((resolve, reject) =>{
            var connection = manage.createConnection();
            var SQLquery = "SELECT price, vendor, update_time FROM products";
            connection.query(SQLquery, function(err, rows, fields) {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                var productsArray = [];
                for(var i = 0; i < rows.length; i++){
                    var curObj = {};
                    curObj.price = rows[i]['price'];
                    curObj.vendor = rows[i]['vendor'];
                    curObj.update_time =  rows[i]['update_time']
                    productsArray.push(curObj);
                }
                resolve(productsArray);
            });
        });
    }
    function getDataFromExelPriceMaslotochka(){
        return new Promise((resolve, reject) =>{
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile('./update_price/prices/MasloTochka_price.xlsx').then(
                (data) => {
                    var importProducts = [];
                    var rows = data['_worksheets'][1]['_rows'];
                    for(var i = 1; i < rows.length; i++){
                        var currProd = {};
                        if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][1]['_value']['value'] != null){
                            currProd.vendor = rows[i]['_cells'][0]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                        } else{
                            continue;
                        }
                        if (rows[i]['_cells'][4] != undefined && rows[i]['_cells'][4]['_value']['value'] != null){
                            currProd.price = rulePriceMaslotochka(rows[i]['_cells'][4]['_value']['value']);
                        } else{
                            currProd.price = 0;
                        }
                        if (rows[i]['_cells'][5] != undefined && rows[i]['_cells'][5]['_value']['value'] != null){
                            if(!+rows[i]['_cells'][5]['_value']['value'].toString().replace(/\D+/g,"")){
                                continue;
                            }
                        } else{
                            continue;
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
    }
    function changePriceInDB(data, promiseArray, numProvider){
        for(var i = 0; i < data[1].length; i++){
            for(var j = 0; j < data[0].length; j++){
                if(data[1][i].vendor == data[0][j].vendor){
                    if(data[0][j].update_time < updateTime || data[0][j].update_time == null || data[0][j].price > data[1][i].price){
                        promiseArray.push(
                            new Promise((resolve, reject) =>{
                                var connection = manage.createConnection();
                                var SQLquery = "UPDATE products SET price =" + data[1][i].price +" , update_time = "+ updateTime + ", provider_num = " + numProvider + ", quantity=9 WHERE vendor='" + data[1][i].vendor + "'";
                                connection.query(SQLquery, function(err, rows, fields) {
                                    if (err) {
                                        reject(err);
                                        connection.end();
                                    }
                                    connection.end();
                                    resolve(rows);
                                });
                            })
                        )
                    }
                }
            }
        }
    }
    function switchOfUnchangedProducts(){
        return new Promise((resolve, reject) =>{
            var connection = manage.createConnection();
            var SQLquery = "UPDATE products SET quantity = 0 WHERE update_time !=" + updateTime + " OR update_time IS NULL";
            connection.query(SQLquery, function(err, rows, fields) {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                resolve(rows);
            });
        })
    }
    function getDataFromExelPriceOmega(){
        return new Promise((resolve, reject) =>{
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile('./update_price/prices/omega.xlsx').then(
                (data) => {
                    var importProducts = [];
                    var rows = data['_worksheets'][2]['_rows'];
                    for(var i = 1; i < rows.length; i++){
                        var currProd = {};
                        if (rows[i]['_cells'][2] != undefined && rows[i]['_cells'][2]['_value']['value'] != null){
                            currProd.vendor = rows[i]['_cells'][2]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                        } else{
                            continue;
                        }
                        if (rows[i]['_cells'][6] != undefined && rows[i]['_cells'][6]['_value']['value'] != null){
                            currProd.price = rulePriceOmega(+rows[i]['_cells'][6]['_value']['value'].toString().replace(',', '.'));
                        } else{
                            currProd.price = 0;
                        }
                        if (rows[i]['_cells'][7] != undefined && rows[i]['_cells'][7]['_value']['value'] != null){
                            if(!+rows[i]['_cells'][7]['_value']['value'].toString().replace(/\D+/g,"")){
                                continue;
                            }
                        } else{
                            continue;
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
    }
    function getDataFromExelPriceLiquiMoly(){
        return new Promise((resolve, reject) => {
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile('./update_price/prices/18743.xlsx').then(
                (data) => {
                    var importProducts = [];
                    var rows = data['_worksheets'][1]['_rows'];
                    for(var i = 0; i < rows.length; i++){
                        var currProd = {};
                        if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][0]['_value']['value'] != null){
                            currProd.vendor = rows[i]['_cells'][0]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                        } else{
                            continue;
                        }
                        if (rows[i]['_cells'][4] != undefined && rows[i]['_cells'][4]['_value']['value'] != null){
                            currProd.price = +rows[i]['_cells'][4]['_value']['value'].toString().replace(',', '.');
                        } else{
                            currProd.price = 0;
                        }
                        importProducts.push(currProd);
                    };
                    resolve(importProducts);
                },
                err => {
                    reject(err);
                }
            )
        })
    }
    function getDataFromExelPriceASG(){
        return new Promise((resolve, reject) => {
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile('./update_price/prices/asg.xlsx').then(
                (data) => {
                    var importProducts = [];
                    var rows = data['_worksheets'][1]['_rows'];
                    for(var i = 0; i < rows.length; i++){
                        var currProd = {};
                        if (rows[i]['_cells'][7] != undefined && rows[i]['_cells'][7]['_value']['value'] != null){
                            currProd.vendor = rows[i]['_cells'][7]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                        } else{
                            continue;
                        }
                        if (rows[i]['_cells'][5] != undefined && rows[i]['_cells'][5]['_value']['value'] != null){
                            currProd.price = rulePriceASG(+rows[i]['_cells'][5]['_value']['value'].toString().replace(',', '.'));
                        } else{
                            currProd.price = 0;
                        }
                        importProducts.push(currProd);
                    };
                    resolve(importProducts);
                },
                err => {
                    reject(err);
                }
            )
        })
    }
    function getDataFromExelPriceMkpp(){
        return new Promise((resolve, reject) => {
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile('./update_price/prices/mkpp.xlsx').then(
                (data) => {
                    var importProducts = [];
                    var rows = data['_worksheets'][1]['_rows'];
                    for(var i = 0; i < rows.length; i++){
                        var currProd = {};
                        if (rows[i]['_cells'][0] != undefined && rows[i]['_cells'][0]['_value']['value'] != null){
                            currProd.vendor = rows[i]['_cells'][0]['_value']['value'].toString().replace(/\s/g, '').toLowerCase();
                        } else{
                            continue;
                        }
                        if (rows[i]['_cells'][2] != undefined && rows[i]['_cells'][2]['_value']['value'] != null){
                            currProd.price = +rows[i]['_cells'][2]['_value']['value'].toString().replace(',', '.');
                        } else{
                            currProd.price = 0;
                        }
                        if (rows[i]['_cells'][3] != undefined && rows[i]['_cells'][3]['_value']['value'] != null){
                            if(!+rows[i]['_cells'][3]['_value']['value']){
                                continue;
                            }
                        } else{
                            continue;
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
    }
    function changePriceHighestRight(data, promiseArray, numProvider){
        for(var i = 0; i < data[1].length; i++){
            for(var j = 0; j < data[0].length; j++){
                if(data[1][i].vendor == data[0][j].vendor){
                    promiseArray.push(
                        new Promise((resolve, reject) =>{
                            var connection = manage.createConnection();
                            var SQLquery = "UPDATE products SET price =" + data[1][i].price +" , update_time = "+ updateTime + ", provider_num = " + numProvider + ", quantity=9 WHERE vendor='" + data[1][i].vendor + "'";
                            connection.query(SQLquery, function(err, rows, fields) {
                                if (err) {
                                    reject(err);
                                    connection.end();
                                }
                                connection.end();
                                resolve(rows);
                            });
                        })
                    )
                }
            }
        }
    }
    function changeUpdateTime(){
        return new Promise((resolve, reject) =>{
            var connection = manage.createConnection();
            var SQLquery = "UPDATE general_information SET last_update_products = NOW() WHERE id=3";
            connection.query(SQLquery, function(err, rows, fields) {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                resolve(rows);
            });
        })
    }
    // Rules for definition costs
    function mathPrice(price, currencyRate){
        if(price <= 35) return Math.round(price*1.2*currencyRate);
        if(35 < price && price <= 70) return Math.round(price*1.15*currencyRate);
        if(70 < price && price <= 100) return Math.round(price*1.1*10*currencyRate);
        if(price > 100) return Math.round(price*1.08*currencyRate);
    };
    function rulePriceMaslotochka(price){
        if(price <= 100) return Math.round(price*1.2);
        if(100 < price && price <= 200) return Math.round(price*1.15);
        if(200 < price && price <= 1000) return Math.round(price*1.1);
        if(price > 1000) return Math.round(price*1.08);
    }
    function rulePriceOmega(price){
        if(price <= 100){
            return Math.round(price*1.2);
        }else if(100 < price && price <= 200){
            return Math.round(price*1.15);
        }else if(200 < price && price <= 1000){
            return Math.round(price*1.1);
        }else if(price > 1000){
            return Math.round(price*1.08);
        }
    }
    function rulePriceASG(price){
        if(price <= 100){
            return Math.round(price*1.2);
        }else if(100 < price && price <= 200){
            return Math.round(price*1.15);
        }else if(200 < price && price <= 1000){
            return Math.round(price*1.1);
        }else if(price > 1000){
            return Math.round(price*1.08);
        }
    }
}