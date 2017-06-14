var fs = require('fs'),
    path = require('path'),
    log = require('../utils/log'),
    pug = require('pug');
module.exports = function(req, res, next){
    fs.readFile(path.join(__dirname, '../data/types', req.body.mod_id + '.json'), (err, data) =>{
        if (err) log.info('error in fs readFile mfa_id = ' + req.body.mod_id + ' ' + err);
        data = JSON.parse(data);
        var compiledFunction = pug.compileFile('./views/form_choosing_car/types.pug'),
            innerHTML = compiledFunction({
                data : data
            });
        res.send(innerHTML);
    });
    
}
