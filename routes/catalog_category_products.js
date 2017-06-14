var manage = require('../manage.js'),
    log = require('../utils/log'),
    mysql = require ('mysql');



module.exports = function(req, res, next){
    var getVendorForTypeId = new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'password',
            database : 'tecdoc'
            });

        var SQLquery = 'select ART_ARTICLE_NR From TOF_LINK_LA_TYP INNER JOIN TOF_LINK_ART ON LA_ID = LAT_LA_ID INNER JOIN TOF_ARTICLES ON ART_ID = LA_ART_ID WHERE LAT_TYP_ID = ' + req.params.type_id + ' AND LAT_GA_ID = ' + req.params.lat_ga_id;
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

    var getProductsByCategoryId = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = 'SELECT * FROM products WHERE category_id =' + req.params.lat_ga_id;
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

    Promise.all([getVendorForTypeId, getProductsByCategoryId])
        .then(
            result => {
                var products = [];
                for(var i = 0; i < result[1].length; i++){
                    for(var j = 0; j < result[0].length; j++){
                        if (result[1][i]['vendor'].replace(/\s/g, '').toLowerCase() == result[0][j]['ART_ARTICLE_NR'].replace(/\s/g, '').toLowerCase()){
                            products.push(result[1][i]);
                            break;
                        }
                    }
                }
                    res.render('catalog/simple_products_list',{title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел', products : products});
            },
            reject => {
                log.info('some promise used in proces getting products by category_id or for type_id have error ' + reject);
            }
        );

}

