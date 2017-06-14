var manage = require('../../../manage.js'),
    log = require('../../../utils/log'),
    fs = require('fs');



module.exports = function(req, res, category_id, main_url) {
    var getAttrJSON = new Promise((resolve, reject) =>{
        fs.readFile('./data/filter/simple_products_attr.json', (err, data) =>{
        if (err){
            reject(err);
        }
        resolve(JSON.parse(data));
});
});
    getAttrJSON.then(
        resolve => {
        var queryObj = {};
    var selectedAttr = {};
    var arrUrl = req.params.manufacturers_url.split('-');
    for(var j = 0; j < arrUrl.length; j++){
        for(var i = 0; i < resolve.length; i++){
            for(var key in resolve[i]){
                for(var k = 0; k < resolve[i][key].length; k++){
                    for(var prop in resolve[i][key][k]){
                        if(prop == arrUrl[j]){
                            if(queryObj[key] === undefined){
                                queryObj[key] = [arrUrl[j]];
                                selectedAttr[key] = [resolve[i][key][k]];
                            }else{
                                queryObj[key].push(arrUrl[j]);
                                selectedAttr[key].push(resolve[i][key][k]);
                            }
                        }
                    }
                }
            }
        }
    }
    var returnSelectedAttr = new Promise((resolve, reject) => {
            resolve(arrUrl);
});
    var returnAttrJSON = new Promise((result, errors) => {
            result(resolve);
});
    var query = ' category_id = ' + category_id + ' AND quantity > 0 AND ';
    var count = 0;
    for(var key in queryObj){
        query += (count ? " AND " : "") + key + " IN ('";
        query += queryObj[key].join("','")
        query += "')";
        count++;
    }
    query += ' ORDER BY name';
    var getProducts = new Promise((resolve, reject) => {
            var connection = manage.createConnection(),
            SQLquery = 'SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products WHERE ' + query;
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
    var getAttr = new Promise((resolve, reject) =>{
            var connection = manage.createConnection(),
            SQLquery = 'SELECT attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products WHERE category_id = ' + category_id + ' and quantity > 0';
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
    var getSEOText = new Promise((resolve, reject) =>{
            fs.readFile('./data/seo/seo-simple-product.json', (err, data) =>{
            if (err){
                reject(err);
            }
            resolve(JSON.parse(data));
});
});
    Promise.all([getProducts, getAttr, returnSelectedAttr, returnAttrJSON, getSEOText]).then(
        resolve => {
        var filterBaseState = {
            attr_manufacturer : []
        };
    for(var i = 0; i < resolve[1].length; i++){
        var currentProd = resolve[1][i];
        if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) == -1){
            filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
        }
    }
    filterBaseState.attr_manufacturer.sort();
    var filterElements = {};
    filterElements.main_url = main_url;
    for(var key in filterBaseState){
        for(var i = 0; i < filterBaseState[key].length; i++){
            for(var j = 0; j < resolve[3].length; j++){
                for(var prop in resolve[3][j]){
                    for(var k = 0; k < resolve[3][j][prop].length; k++){
                        for(var pr in resolve[3][j][prop][k]){
                            if(pr == filterBaseState[key][i]){
                                var curObj = resolve[3][j][prop][k];
                                if(resolve[2].indexOf(pr) > -1){
                                    curObj.isChecked = true;
                                }else{
                                    curObj.isChecked = false;
                                }
                                if(filterElements[prop] === undefined){
                                    filterElements[prop] = [curObj]
                                }else{
                                    filterElements[prop].push(curObj);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var seo = {};
    seo.h1 = "";
    seo.title = "";
    seo.text = "";
    resolve[4].some(function(item, i, arr) {
        if(item.url == main_url){
            item['sub_category'].some((item, i, arr)=>{
                if(req.params.manufacturers_url == item['param']){
                    for(var key in item['data']){
                        seo[key] = item['data'][key]
                    }
                    return true
                }
            })
            return true;
        }
    });
    // Pages paginator
    var pagesPaginator = [];
    if (resolve[0].length > 20){
        var numPages = Math.ceil(resolve[0].length / 20);
        pagesPaginator.push({
            'name' : '<< В начало',
            'href' : category_id + req.params.manufacturers_url + '?page=1',
            isActive : false
        })
        if(req.query.page) {
            var count = 0;
            if((numPages - 3) < req.query.page){
                var startPage = numPages - 6;
            }else{
                var startPage = req.query.page - 3;
            }
            while( count < 7 && count < numPages && startPage < numPages + 1){
                if(startPage > 0){
                    if(startPage == req.query.page){
                        pagesPaginator.push({
                            'name' : startPage,
                            'href' : category_id + req.params.manufacturers_url + '?page=' + startPage,
                            isActive : true
                        })
                    } else{
                        pagesPaginator.push({
                            'name' : startPage,
                            'href' : category_id + req.params.manufacturers_url + '?page=' + startPage,
                            isActive : false
                        })
                    }
                    count++;
                }
                startPage++;
            }
        }else{
            pagesPaginator.push({
                'name' : 1,
                'href' : category_id + req.params.manufacturers_url + '?page=1',
                isActive : true
            })
            if(numPages > 6){
                for(var i = 2; i < 8; i++){
                    pagesPaginator.push({
                        'name' : i,
                        'href' : category_id + req.params.manufacturers_url + '?page=' + i,
                        isActive : false
                    })
                }
            }else{
                for(var i = 2; i < numPages + 1; i++){
                    pagesPaginator.push({
                        'name' : i,
                        'href' : category_id + req.params.manufacturers_url + '?page=' + i,
                        isActive : false
                    })
                }
            }
        }
        pagesPaginator.push({
            'name' : 'В конец >>',
            'href' : category_id + req.params.manufacturers_url + '?page=' + numPages,
            isActive : false
        })
    }
    if(req.query.page == 1 || req.query.page == undefined){
        var products = resolve[0].splice(0, 20);
    }else{
        var products = resolve[0].splice(20 * (req.query.page - 1), 20);
    }
    res.render('catalog/main_products_list',{title: seo.title, products : products, filterElements : filterElements, selectedAttr : resolve[2], pagesPaginator : pagesPaginator, seo : seo});

    },
        reject => {
            log.info('some errors in handling Promise.all([getProducts, getAttr, returnSelectedAttr, returnAttrJSON, getSEOText]) on page' + main_url + reject);
        })
    },
    reject => {
        log.info('some errors in proces gettig data from ./data/filter/simple_products_attr.json ' + reject);
    })
}
