var manage = require('../../manage.js');

module.exports = function(req, res, next){
    res.render('admin/index',{title:'Панель управления'});
}