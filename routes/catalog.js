var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    res.render('catalog/catalog',{title:'Панель управления'});
}