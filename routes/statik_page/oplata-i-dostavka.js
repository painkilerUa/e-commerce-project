var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    res.render('statik_page/oplata-i-dostavka',{title:'Оплата и доставка'});
}