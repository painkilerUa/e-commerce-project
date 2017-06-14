var manage = require('../../../manage.js'),
    log = require('../../../utils/log'),
    fs = require('fs');



module.exports = function(req, res, next){
    res.set({
        'Content-Type': 'application/json'
    })
    var getProductsId = new Promise( (resolve, reject) =>{
        fs.readFile('./data/g_adwords/ads.json', (err, data) =>{
            if (err) reject(err);
            resolve(data);
            })
        });
    getProductsId.then(
        resolve =>{
            var getPriceFromDBById = new Promise((result, errors) => {
                var ads = JSON.parse(resolve);
                var productsId = [];
                for(var i = 0; i < ads.length; i++){
                    for(var key in ads[i]){
                        productsId.push(key);
                    }
                }
                var connection = manage.createConnection(),
                SQLquery = "SELECT vendor, price from products where vendor IN('" + (productsId.length > 0 ? productsId.join("','") : 0) + "')";
                connection.connect();
                connection.query(SQLquery, function(err, rows, fields) {
                    if (err) {
                        errors(err);
                        connection.end();
                    }
                    var fullAnswer = [];
                    for(var i = 0; i < rows.length; i++){
                        for(var j = 0; j < ads.length; j++){
                            for( var key in ads[j]){
                                if(rows[i]['vendor'] == key){
                                    var obj = {};
                                    obj[ads[j][key]] = rows[i]['price'];
                                    fullAnswer.push(obj)
                                }
                            }
                        }
                    }
                    result(fullAnswer);
                    connection.end();
                });
            });
            getPriceFromDBById.then(
                resolve => {
                    res.send(JSON.stringify(resolve));
                },
                reject => {
                    log.info('some errors in proces getting data from DB in file g-adwords-1.js' + reject);
                }
            )
        }, 
        reject =>{
            log.info('some errors in proces getting products id from ads in g-adwords-1.js' + reject);
        })
}



















