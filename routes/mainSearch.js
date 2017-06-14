var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    var getAllProducts = new Promise ((resolve, reject) =>{
            var connection = manage.createConnection(),
            SQLquery = "SELECT name, price, product_url, vendor FROM products WHERE quantity > 0";
            connection.connect();
            connection.query(SQLquery, function(err, rows, fields) {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                resolve(rows);
            });
        });
    getAllProducts.then(
        resolve =>{
            var filteredProducts = [];
            var searchArr = req.query.query.match(/[a-zа-я0-9]+/gi);
            for(var i = 0; i < resolve.length; i++){
                if(req.query.query.toString().replace(/\s/g, '').toLowerCase() == resolve[i].vendor){
                    filteredProducts.push(
                        {
                            data : resolve[i],
                            range : 99
                        }
                    )
                    continue;
                }
                var currObj = {
                    data : resolve[i],
                    range : 0
                }
                for(var j = 0; j < searchArr.length; j++){
                    if(resolve[i].name.toString().toLowerCase().indexOf(searchArr[j].toLowerCase()) > -1){
                        currObj.range++;
                    }
                }
                filteredProducts.push(
                    currObj
                )
            }
            filteredProducts.sort(compareRange);
            function compareRange(a, b) {
                if (a.range < b.range) return 1;
                if (a.range > b.range) return -1;
            }
            var products = [];
            for(var i = 0; i < filteredProducts.length; i++){
                if(filteredProducts[i].range > 0 && i < 15){
                    products.push(
                        filteredProducts[i]['data']
                    )
                }else{
                    break;
                }
            }
            res.render('main_search',{title: 'Поиск', products : products, search_query : req.query.query});
        },
        reject => {
            log.info('some errors in proces rendering main_search file main_search.js ' + reject);
        }
    )
}