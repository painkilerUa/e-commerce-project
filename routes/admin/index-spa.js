var manage = require('../../manage.js');
var fs = require('fs');

module.exports = function(req, res, next){
    fs.readFile('./publick/static/admin/index.html', (err, data) => {
        if (err){
            res.status(501).send('Error 501')
            console.log(err)
        }
//        res.setHeader('content-type', 'text/html');
        res.end(data)
    });
}