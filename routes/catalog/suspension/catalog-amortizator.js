var simpleProducts = require('../components/simple-products');

module.exports = function(req, res, next){
    simpleProducts(req, res, 854, '/catalog/amortizator/');
}

