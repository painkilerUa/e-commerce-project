var manage = require('../../../manage.js'),
    log = require('../../../utils/log');


var simpleProducts = require('../components/simple-products');

module.exports = function(req, res, next){
    simpleProducts(req, res, 8, '/catalog/vozdyshnii-filtr/');
}

