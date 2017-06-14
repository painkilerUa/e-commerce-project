var fs = require('fs'),
    path = require('path'),
    log = require('../utils/log'),
    pug = require('pug');
module.exports = function(req, res, next){

    // fs.readFile(path.join(__dirname, '../data/models', req.body.mfa_id + '.json'), (err, data) =>{
    //     if (err) log.info('error in fs readFile mfa_id = ' + req.body.mfa_id + ' ' + err);
    //     data = JSON.parse(data);
    //     var compiledFunction = pug.compileFile('./views/form_choosing_car/models.pug'),
    //         innerHTML = compiledFunction({
    //             data : data
    //         });
    //     res.send(innerHTML);
    // });
    var innerHTML = '<p>На данный момент модуль подбора автозапчастей находитя в состоянии доработки. Для побора автозапчастей обратитись к нашим менеджерам по тел. (099) 642-43-96, (067) 300-98-52, (093) 102-58-77</p>'
    res.send(innerHTML);
}
