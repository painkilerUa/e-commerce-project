
var simpleProducts = require('../components/simple-products');

module.exports = function(req, res, next){
    simpleProducts(req, res, 9, '/catalog/toplivnii-filtr/');
}

