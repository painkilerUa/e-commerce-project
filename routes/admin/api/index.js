const login = require('./login')
const orders = require('./orders')
const config = require('../../../config'),
jwt = require('express-jwt');

var jwtCheck = jwt({
    secret: config.get('jwt_secret'),
    audience: config.get('jwt_audience'),
    issuer: config.get('jwt_issuer')
});

module.exports = function (app) {
    app.post('/api/login', login);
    app.get('/api/orders', jwtCheck, orders);


}
