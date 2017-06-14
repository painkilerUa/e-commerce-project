var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    var insertOrder = new Promise ((resolve, reject) => {
        var params = req.body;
        var values = [];
        var ordered_products = JSON.parse(params.ordered_products);
        var products_name = [];
        var products_quantity = [];
        var products_price = [];
        for(var i = 0; i < ordered_products.length; i++){
            products_name.push(ordered_products[i]['name']);
            products_quantity.push(ordered_products[i]['ordered']);
            products_price.push(ordered_products[i]['price'])
        }
        values.push(products_name.join(';'));
        values.push(products_quantity.join(';'));
        values.push(products_price.join(';'));
        values.push(params.last_name);
        values.push(params.first_name);
        if(params.surname_name){
            values.push(params.surname_name);
        }else{
            values.push('');
        }
        values.push(params.phone_number);
        if(params.is_pikup_from_ofice){
            values.push(params.is_pikup_from_ofice);
        }else{
            values.push('');
        }
        if(params.is_local_delivery){
            values.push(params.is_local_delivery);
        }else{
            values.push('');
        }
        if(params.adress_in_kharkiv){
            values.push(params.adress_in_kharkiv);
        }else{
            values.push('');
        }
        if(params.is_delivery_transport_company){
            values.push(params.is_delivery_transport_company);
        }else{
            values.push('');
        }
        if(params.city_name){
            values.push(params.city_name);
        }else{
            values.push('');
        }
        if(params.carrier){
            values.push(params.carrier);
        }else{
            values.push('');
        }
        if(params.carrier_num_office){
            values.push(params.carrier_num_office);
        }else{
            values.push('');
        }
        if(params.comment){
            values.push(params.comment);
        }else{
            values.push('');
        }
        var connection = manage.createConnection(),
        SQLquery = "INSERT INTO orders (products_name, products_quantity, products_price, last_name, first_name, surname_name, phone_number, is_pikup_from_ofice, is_local_delivery, adress_in_kharkiv, is_delivery_transport_company, city_name, carrier, carrier_num_office, comment) VALUES ('" + values.join("','") + "')";
        console.log(SQLquery);
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
    insertOrder.then(
        resolve => {
            if(resolve.affectedRows > 0){
                res.render('succesfull_order',{title: 'Заказ принят успешно', cleanLocalStorage : true, massage : 'Ваш заказ принят. В ближайшее врямя с вами свяжутся наши менеджери для уточнения деталей покупки.'});
            }else{
                res.render('succesfull_order',{title: 'Ошибки при оформлении заказ', cleanLocalStorage : false, massage : 'В процессе оформления заказа произошли ошибки. Пожалуйста повторите заказ, или свяжитесь с нами по телефону.'});
            }
        },
        reject => {
            res.render('succesfull_order',{title: 'Заказ принят успешно', cleanLocalStorage : false, massage : 'В процессе оформления заказа произошли ошибки. Пожалуйста повторите заказ, или свяжитесь с нами по телефону.'});
            log.info('some errors in proces adding data to table orders cartOrder.js ' + reject);
        }
    )
}

