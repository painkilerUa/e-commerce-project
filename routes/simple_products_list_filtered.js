var manage = require('../manage.js');
    
module.exports = function(req, res, next){
    var getProductsByIdAndBrands = new Promise((resolve, reject) => {
        var brandsSQL = '';
        if('brand' in req.query){
            var arrBrandsQuery = req.query['brand'];
            if(arrBrandsQuery instanceof Array){
                for(var i = 0; i < arrBrandsQuery.length; i++){
                    brandsSQL += "'" + arrBrandsQuery[i] + "'" +",";
                }
                brandsSQL = " AND attr_manufacturer IN (" + brandsSQL.substring(0, brandsSQL.length - 1) + ")";
            }
            else brandsSQL = " AND attr_manufacturer IN ('" + req.query['brand'] +"')";
        };
        var productsIdSQL = ''
        if('products-id' in req.query){
            productsIdSQL = " WHERE id IN (" + req.query['products-id'] + ")";
        }
        var SQLquery = "SELECT * FROM products" + productsIdSQL + brandsSQL,
            connection = manage.createConnection();
            
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            resolve(rows);
            connection.end();
        });
    });
    var getProductsById = new Promise((resolve, reject) => {
        var productsIdSQL = ''
        if('products-id' in req.query){
            productsIdSQL = " WHERE id IN (" + req.query['products-id'] + ")";
        }
        var SQLquery = "SELECT * FROM products" + productsIdSQL,
            connection = manage.createConnection();
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            resolve(rows);
            connection.end();
        });
    });
    Promise.all([getProductsByIdAndBrands, getProductsById])
        .then(
            result => {
                res.render('catalog/simple_products_list_filtered', {title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел', filteredProd : result[0], allProducts : result[1], queryParams : req.query});
            },
            reject => {
                log.info('some problems in simple_products_list_filtered.js ' + reject);
            }
        );
}
