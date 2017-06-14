var simpleProducts = require('../components/simple-products');

module.exports = function(req, res, next){
    simpleProducts(req, res, 1217, '/catalog/bolt-golovki-bloka-cilindrov/');
}

