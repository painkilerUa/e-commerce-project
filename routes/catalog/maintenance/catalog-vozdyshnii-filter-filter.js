var manage = require('../../../manage.js'),
    log = require('../../../utils/log');


var simpleProductsFilter = require('../components/simple-products-filter');
module.exports = function(req, res, next){
    simpleProductsFilter(req, res, 8, '/catalog/vozdyshnii-filtr/')
}