var manage = require('../../manage.js'),
    Excel = require('exceljs'),
    log = require('../../utils/log'),
    fs = require('fs');
//var mysql      = require('mysql');

module.exports = function(req, res, next){
   //  var promisesImgRez = [];
   //  var promiseGetExictedVendors = new Promise((resolve, reject) =>{
   //      var connection = manage.createConnection(),
   //          SQLquery = 'SELECT vendor from products';

   //      connection.connect();
   //      connection.query(SQLquery, function(err, rows, fields) {
   //          if (err) {
   //              reject(err);
   //              connection.end();
   //          }
   //          connection.end();
   //          var vendorArr = [];
   //          for(var i = 0; i < rows.length; i++){
   //              vendorArr.push(rows[i]['vendor']);
   //          }
   //          resolve(vendorArr);
   //      });
   //  });

   //  var promiseGetProductsFromExelFile = new Promise ((resolve, reject) => {
   //      var workbook = new Excel.Workbook();
   //      workbook.xlsx.readFile('./import/busmarket.xlsx')
   //          .then(
   //              (data) => {
   //                  var importProducts = [];
   //                  for(var i = 3; i < 4; i++){
   //                      var currProd = {};
   //                      currProd.vendor = data['_worksheets'][1]['_rows'][i]['_cells'][0]['_value']['value'].replace(/\s/g, '').toLowerCase();
   //                      currProd.brand = data['_worksheets'][1]['_rows'][i]['_cells'][1]['_value']['value'];
   //                      currProd.name = data['_worksheets'][1]['_rows'][i]['_cells'][2]['_value']['value'];
   //                      currProd.price = mathPrice(+data['_worksheets'][1]['_rows'][i]['_cells'][3]['_value']['value'], 29);
   //                      currProd.purchase_price = +data['_worksheets'][1]['_rows'][i]['_cells'][3]['_value']['value'];
   //                      currProd.quantity = data['_worksheets'][1]['_rows'][i]['_cells'][4]['_value']['value'];
   //                      importProducts.push(currProd);
   //                  };
   //                  resolve(importProducts);
   //              }
   //          )
   //          .catch(error => {
   //              log.info('some problem in parsing import file.xlsx ' + error);
   //          });
   //  });

   //  Promise.all([promiseGetExictedVendors, promiseGetProductsFromExelFile])
   //      .then(
   //          result => {
   //              console.log(result);
   //               promisesImgRez.push(
   //                          new Promise ((resolve, reject) => {
   //                              return result[1];
   //                          })
   //                      );
   //              for(var i = 0; i < result[1].length; i++){
   //                  if(result[0].indexOf(result[1][i]['vendor']) == -1){
   //                      promisesImgRez.push(
   //                          new Promise ((resolve, reject) => {
   //                              getImage(result[1][i]['vendor'])
   //                          })
   //                      );
   //                  }
   //              }
   //          },
   //          reject => {
   //              log.info('some promise used in index.pug have a error ' + reject);
   //          }
   //      );
   // Promise.all(promisesImgRez)
   //     .then(
   //         resolve => {
   //             for(var i =0; i < result[0].length; i++){
   //                  var SQLquery = "INSERT INTO import (name, short_description, description, price, quantity, vendor, category_id, attr_manufacturer) VALUES ('" + result[0][i]['name'] + "', '','','" + result[0][i]['price'] + "','"  + result[0][i]['quantity'] + "','" + result[0][i]['vendor'] + "','0','" + result[1][0]['brand'] + "')";
   //                  var connection = manage.createConnection();
   //                  connection.query(SQLquery, function(err, rows, fields) {
   //                      console.log(rows);
   //                  });                    
   //             }
   //              connection.end();
   //     },
   //         reject => {

   //         })


    // var workbook = new Excel.Workbook();
    // workbook.xlsx.readFile('./import/busmarket.xlsx')
    //     .then(
    //         (data) => {
    //             var importProducts = [];
    //             for(var i = 3; i < 4; i++){
    //                 var currProd = {};
    //                 currProd.vendor = data['_worksheets'][1]['_rows'][i]['_cells'][0]['_value']['value'].replace(/\s/g, '').toLowerCase();
    //                 currProd.brand = data['_worksheets'][1]['_rows'][i]['_cells'][1]['_value']['value'];
    //                 currProd.name = data['_worksheets'][1]['_rows'][i]['_cells'][2]['_value']['value'];
    //                 currProd.price = mathPrice(+data['_worksheets'][1]['_rows'][i]['_cells'][3]['_value']['value'], 29);
    //                 currProd.quantity = data['_worksheets'][1]['_rows'][i]['_cells'][4]['_value']['value'];
    //                 importProducts.push(currProd);
    //             };
    //             return importProducts;
    //         }
    //     )
    //     .then(
    //         (importProducts) => {
    //             for(var i = 0; i < importProducts.length; i++){
    //                 var SQLquery = "INSERT INTO import (name, price, quantity, vendor, attr_manufacturer) VALUES ('" + importProducts[i]['name'] + "','" + importProducts[i]['price'] + "','" + importProducts[i]['quantity'] + "','" + importProducts[i]['vendor'] + "','" + importProducts[i]['brand'] + "')";
    //                 var connection = manage.createConnection();
    //                 connection.query(SQLquery, function(err, rows, fields) {
    //                 });
    //             }
    //         }
    //     )
    //     .catch(error => {
    //         log.info('some problem in parsing import file.xlsx ' + error);
    //     });
    res.render('admin/import',{title:'Импорт'});
    // Rules for definition costs
    // function mathPrice(price, currencyRate){
    //     if(price <= 35) return Math.round(price*1.2*currencyRate);
    //     if(35 < price || price <= 70) return Math.round(price*1.15*currencyRate);
    //     if(70 < price || price <= 100) return Math.round(price*1.1*10*currencyRate);
    //     if(price => 100) return Math.round(price*1.08*currencyRate);
    // };
    // function getImage(vendor){
    //     var getDataForImage = new Promise ((resolve, reject) => {
    //         var connection = mysql.createConnection({
    //           host     : 'localhost',
    //           user     : 'root',
    //           password : 'password',
    //           database : 'tecdoc'
    //         });
    //         connection.connect();
    //         var SQL = "SELECT GRA_TAB_NR, GRA_GRD_ID FROM TOF_ARTICLES INNER JOIN TOF_LINK_GRA_ART ON LGA_ART_ID = ART_ID INNER JOIN TOF_GRAPHICS ON GRA_ID = LGA_GRA_ID WHERE ART_ARTICLE_NR = '" + vendor + "'";
    //         connection.query(SQL, function(err, rows, fields) {
    //             if (err) {
    //                 reject(err);
    //                 connection.end();
    //             }
    //             connection.end();
    //             console.log(rows)
    //             resolve(rows);
    //         });
    //     });
    //     getDataForImage
    //         .then(
    //             (rows) => {
    //                 var connection = mysql.createConnection({
    //                   host     : 'localhost',
    //                   user     : 'root',
    //                   password : 'password',
    //                   database : 'tecdoc'
    //                 });
    //                 connection.connect();
    //                 var SQL = "SELECT GRD_GRAPHIC from tof_gra_data_" + rows[0]['GRA_TAB_NR'] + " where grd_id = " + rows[0]['GRA_GRD_ID'];
    //                 connection.query(SQL, function(err, rows, fields) {
    //                     connection.end();
    //                     fs.writeFile('./temporaryImgImport/' + vendor + '.jp2', rows[0]['GRD_GRAPHIC'], err => {
    //                     if (err) throw err;
    //                     console.log('images created');
    //                     });
    //                 });
    //             }
    //         )
    //         .catch(error => {
    //             log.info('some problem in proces import file ' + error);
    //         });
    // }
}




//How can i use exceljs.
// Exemple query data['_worksheets'][1]['_rows'][0//It is number row, like "A"]['_cells'][0//It is number cell, like "1"]['_value']['value']
// As a result of this query we get a value of cell "A1";
