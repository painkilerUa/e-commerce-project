var simpleProductsFilter = require('../components/simple-products-filter');
module.exports = function(req, res, next){
    simpleProductsFilter(req, res, 5, '/catalog/shrys/')
}