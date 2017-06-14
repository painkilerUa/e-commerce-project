var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    switch (+req.params.catalog_section){
        case 1:
            res.render('catalog/catalog_section_1',{title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел'});
        break;
    }
}