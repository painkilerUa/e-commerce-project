var manage = require('../../../manage.js'),
    log = require('../../../utils/log'),
    xml = require('xml');



module.exports = function(req, res, next){
    var getAllProducts = new Promise ((resolve, reject) => {
        var connection = manage.createConnection(),
        SQLquery = "SELECT id, name, price, product_url, img_url, category_id, vendor, attr_manufacturer FROM products WHERE quantity > 0";
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows);
        });
    })
    getAllProducts.then(
        resolve => {
            var category_1 = [];
            var category_2 = [];
            var another_category = [];
            for(var i = 0; i < resolve.length; i++){
                switch(resolve[i].category_id) {
                case 1:
                category_1.push(resolve[i]);
                break;
                case 2:
                category_2.push(resolve[i]);
                break;
                default:
                another_category.push(resolve[i]);
                }
            }
            var offers_category = [];
            for(var i = 0; i < category_1.length; i++){
                offers_category.push(
                    {
                        offer : [
                            {_attr : {id : category_1[i].id, available : true}},
                            {name : category_1[i].name},
                            {vendor : category_1[i].attr_manufacturer},
                            {url : 'http://mkpp.com.ua/products/' + category_1[i].product_url},
                            {price : category_1[i].price},
                            {currencyId : 'UAH'},
                            {categoryId : 1},
                            {picture : 'http://mkpp.com.ua' + category_1[i].img_url},
                            {delivery : true}
                        ]
                    }
                )
            }
            for(var i = 0; i < another_category.length; i++){
                offers_category.push(
                    {
                        offer : [
                            {_attr : {id : another_category[i].id, available : true}},
                            {name : another_category[i].name},
                            {vendor : another_category[i].attr_manufacturer},
                            {vendorCode : another_category[i].vendor},
                            {url : 'http://mkpp.com.ua/products/' + another_category[i].product_url},
                            {price : another_category[i].price},
                            {currencyId : 'UAH'},
                            {categoryId : 999},
                            {picture : 'http://mkpp.com.ua' + another_category[i].img_url},
                            {delivery : true}
                        ]
                    }
                )
            }

            var date = new Date();
            var currentDate = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
            var price =[{
                yml_catalog : [
                {_attr : {date : currentDate}},
                {shop : [
                    {name: 'MKPP'},
                    {company : 'MKPP'},
                    {url : 'http://mkpp.com.ua/'},
                    {currencies : [
                        {currency : [
                            {_attr : {id : 'UAH', rate : '1'}}
                            ]}
                        ]},
                    {categories : [
                        {
                            category : [{_attr : {id : 1}}, 'Автомобильные масла']
                        }, 
                        {
                            category : [{_attr : {id : 999}}, 'Автомобильные запчасти']
                        }
                        ]},
                    {offers : offers_category}
                    ]}
                ]
            }]
            var xmlstring = xml(price, {declaration: true});
            res.set({
                'Content-Type': 'application/xml'
            })
            res.send(xmlstring);
        },
        reject => {
            log.info('some errors in proces getting data from products for generation yml-export-file-id-1 ' + reject);
        }
    )



















}

