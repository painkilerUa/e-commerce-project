var manage = require('../../manage.js'),
    log = require('../../utils/log');



module.exports = function(req, res, next){
    res.render('./admin/yml-export-settings',{title: '',});
}

