var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    var editProductById = new Promise ((resolve, reject) => {
        var params = req.body;
        var chengedValue = [];
        for(var key in params){
            chengedValue.push(key + "='" + params[key] + "'")
        }
        var connection = manage.createConnection(),
        SQLquery = "UPDATE products SET " + chengedValue.join(",") + " WHERE id='" + req.params.product_id + "'";
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows);
        });
    })
    editProductById.then(
        resolve => {
                res.render('./admin/succesfull_editing_product',{title: 'Товар изменен', serverAnswer : resolve});
        },
        reject => {
            log.info('some errors in proces adding data to table orders cartOrder.js ' + reject);
        }
    )
}

