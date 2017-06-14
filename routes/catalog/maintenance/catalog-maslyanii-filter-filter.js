
var simpleProductsFilter = require('../components/simple-products-filter');
module.exports = function(req, res, next){
    simpleProductsFilter(req, res, 7, '/catalog/maslyanii-filtr/')
}

