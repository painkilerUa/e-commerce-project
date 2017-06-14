module.exports = function (app, express) {
    var pug = require('pug'),
        config = require('../config'),
        path = require('path'),
        router = require('../routes'),
        bodyParser = require('body-parser'),
        updatePrice = require('../update_price/update-price-cron')(),
        favicon = require('serve-favicon');


        app.use(favicon('./publick/static/images/frontend/favicon.ico'));

        app.use(bodyParser.urlencoded({extended : false}));
        app.use(bodyParser.json());
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, '../views'));

        app.use(express.static(config.get('publick_dir')));
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        router(app);
};