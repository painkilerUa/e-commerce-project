const login = require('./login')
const orders = require('./orders/orders')
const config = require('../../config/index'),
    jwt = require('express-jwt'),
    createCustomer = require('./customers/createCustomer'),
    getCustomers = require('./customers/getCustomers')

var jwtCheck = jwt({
    secret: config.get('jwt_secret'),
    audience: config.get('jwt_audience'),
    issuer: config.get('jwt_issuer')
});

module.exports = function (app) {
    app.post('/api/login', login);
    app.get('/api/orders', jwtCheck, orders);
    app.get('/api/customers', jwtCheck, getCustomers);
    app.post('/api/customers', jwtCheck, createCustomer);

}
