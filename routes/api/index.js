"use strict"
const login = require('./login')
const getOrders = require('./orders/getOrders')
const config = require('../../config/index'),
    jwt = require('express-jwt'),
    createCustomer = require('./customers/createCustomer'),
    getCustomers = require('./customers/getCustomers'),
    getProducts = require('./products/getProducts'),
    createProduct = require('./products/createProduct'),
    createOrder = require('./orders/createOrder'),
    editOrder = require('./orders/editOrder')

let jwtCheck = jwt({
    secret: config.get('jwt_secret'),
    audience: config.get('jwt_audience'),
    issuer: config.get('jwt_issuer')
});

module.exports = function (app) {
    app.post('/api/login', login);
    app.get('/api/orders', jwtCheck, getOrders);
    app.post('/api/orders', jwtCheck, createOrder);
    app.put('/api/orders', jwtCheck, editOrder);
    app.get('/api/customers', jwtCheck, getCustomers);
    app.post('/api/customers', jwtCheck, createCustomer);
    app.get('/api/products', jwtCheck, getProducts);
    app.post('/api/products', jwtCheck, createProduct);
}
