var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    var getAllProducts = new Promise((resolve, reject) => {
        var connection = manage.createConnection(),
            SQLquery = 'SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_manufacturer, attr_capacity, attr_color, attr_antifreeze_class FROM products WHERE category_id = 2 and quantity > 0';
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            connection.end();
            resolve(rows);
        });
    });

    getAllProducts
        .then(
            resolve => {
                // filter settings
                var filterBaseState = {
                    attr_manufacturer : [],
                    attr_capacity : [], 
                    attr_color : [], 
                    attr_antifreeze_class : []
                };
                for(var i = 0; i < resolve.length; i++){
                    var currentProd = resolve[i]
                    if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) == -1){
                        filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
                    }
                    if(filterBaseState.attr_capacity.indexOf(currentProd.attr_capacity) == -1){
                        filterBaseState.attr_capacity.push(currentProd.attr_capacity)
                    }
                    if(filterBaseState.attr_color.indexOf(currentProd.attr_color) == -1){
                        filterBaseState.attr_color.push(currentProd.attr_color)
                    }
                    if(filterBaseState.attr_antifreeze_class.indexOf(currentProd.attr_antifreeze_class) == -1){
                        filterBaseState.attr_antifreeze_class.push(currentProd.attr_antifreeze_class)
                    }
                }
                filterBaseState.attr_manufacturer.sort();
                filterBaseState.attr_color.sort();
                filterBaseState.attr_antifreeze_class.sort();
                function compareNumeric(a, b) {
                    return a - b;
                }
                filterBaseState.attr_capacity.sort(compareNumeric);
                var filterChangedState = {
                    attr_manufacturer : [],
                    attr_capacity : [], 
                    attr_color : [], 
                    attr_antifreeze_class : []
                }
                for(var i = 0; i < filterBaseState.attr_manufacturer.length; i++){
                    var curObj = {
                        name : filterBaseState.attr_manufacturer[i],
                        checked : false
                    };
                    filterChangedState.attr_manufacturer.push(curObj);
                }
                for(var i = 0; i < filterBaseState.attr_capacity.length; i++){
                    var curObj = {
                        name : filterBaseState.attr_capacity[i],
                        checked : false
                    };
                    filterChangedState.attr_capacity.push(curObj);
                }
                for(var i = 0; i < filterBaseState.attr_color.length; i++){
                    var curObj = {
                        name : filterBaseState.attr_color[i],
                        checked : false
                    };
                    filterChangedState.attr_color.push(curObj);
                }
                for(var i = 0; i < filterBaseState.attr_antifreeze_class.length; i++){
                    var curObj = {
                        name : filterBaseState.attr_antifreeze_class[i],
                        checked : false
                    };
                    filterChangedState.attr_antifreeze_class.push(curObj);
                }
                // Pages paginator
                var pagesPaginator = {};
                if (resolve.length > 20){
                    pagesPaginator.numPages = Math.ceil(resolve.length / 20);
                    if(req.query.page) {
                        pagesPaginator.activePage = req.query.page;
                    } else{
                        pagesPaginator.activePage = 1;
                    }
                }else {
                    pagesPaginator.numPages = 1;
                    pagesPaginator.activePage = 1;
                }
                if(req.query.page == 1 || req.query.page == undefined){
                    var products = resolve.splice(0, 20);
                }else{
                    var products = resolve.splice(20 * (req.query.page - 1), 20)
                }

                res.render('catalog/antifreeze_products_list',{title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел', products : products, filter : filterChangedState, pagesPaginator : pagesPaginator});
            },
            reject => {
                log.info('some errors in proces gettig data products from DB on page ./catalog/antifreeze ' + reject);
            }
        );
}

