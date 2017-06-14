var manage = require('../manage.js'),
    log = require('../utils/log'),
    fs = require('fs');



module.exports = function(req, res, next){
    var getAttrJSON = new Promise((resolve, reject) =>{
        fs.readFile('./data/filter/oil_attr.json', (err, data) =>{
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
            var arrUrl = req.params.auto_oil_url.split('-');
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
            var query = ' category_id = 1 AND quantity > 0 AND ';
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
                    SQLquery = 'SELECT attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products WHERE category_id = 1 and quantity > 0';
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
                fs.readFile('./data/seo/avtomobilnye_masla.json', (err, data) =>{
                    if (err){
                        reject(err);
                    } 
                    resolve(JSON.parse(data));
                });
            });
            Promise.all([getProducts, getAttr, returnSelectedAttr, returnAttrJSON, getSEOText]).then(
                resolve => {
                var filterBaseState = {
                    attr_type : [],
                    attr_manufacturer : [],
                    attr_sae : [],
                    attr_vid : [],
                    attr_capacity : []
                };
                for(var i = 0; i < resolve[1].length; i++){
                    var currentProd = resolve[1][i];
                    if(filterBaseState.attr_type.indexOf(currentProd.attr_type) == -1){
                        filterBaseState.attr_type.push(currentProd.attr_type)
                    }
                    if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) == -1){
                        filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
                    }
                    if(filterBaseState.attr_sae.indexOf(currentProd.attr_sae) == -1 && currentProd.attr_sae){
                        filterBaseState.attr_sae.push(currentProd.attr_sae)
                    }
                    if(filterBaseState.attr_vid.indexOf(currentProd.attr_vid) == -1){
                        filterBaseState.attr_vid.push(currentProd.attr_vid)
                    }
                    if(filterBaseState.attr_capacity.indexOf(currentProd.attr_capacity) == -1){
                        filterBaseState.attr_capacity.push(currentProd.attr_capacity)
                    }
                }
                filterBaseState.attr_type.sort();
                filterBaseState.attr_manufacturer.sort();
                filterBaseState.attr_sae.sort();
                filterBaseState.attr_vid.sort();
                filterBaseState.attr_capacity.sort((a, b) => {return a - b});

                var filterElements = {};
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
                switch(req.params.auto_oil_url) {
                    case 'aral-5w40':
                    seo.text = resolve[4][0]['aral-5w40'];
                    seo.h1 = "Моторное масло Aral HighTronic 5W-40"
                    break;
                    default:
                    seo.h1 = "Атомобильные масла";
                    seo.text = "";
                    break;
                }
                // Pages paginator
                var pagesPaginator = [];
                if (resolve[0].length > 20){
                    var numPages = Math.ceil(resolve[0].length / 20);
                        pagesPaginator.push({
                            'name' : '<< В начало',
                            'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=1',
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
                                        'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=' + startPage,
                                        isActive : true
                                    })
                                } else{
                                    pagesPaginator.push({
                                        'name' : startPage,
                                        'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=' + startPage,
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
                            'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=1',
                            isActive : true
                        })
                        if(numPages > 6){
                            for(var i = 2; i < 8; i++){
                                pagesPaginator.push({
                                    'name' : i,
                                    'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=' + i,
                                    isActive : false
                                })
                            }
                        }else{
                            for(var i = 2; i < numPages + 1; i++){
                                pagesPaginator.push({
                                    'name' : i,
                                    'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=' + i,
                                    isActive : false
                                })
                            }
                        }
                    }
                    pagesPaginator.push({
                        'name' : 'В конец >>',
                        'href' : '/catalog/avtomobilnye-masla/'+ req.params.auto_oil_url + '?page=' + numPages,
                        isActive : false
                    })
                }
                if(req.query.page == 1 || req.query.page == undefined){
                    var products = resolve[0].splice(0, 20);
                }else{
                    var products = resolve[0].splice(20 * (req.query.page - 1), 20);
                }
                    res.render('catalog/avtomobilnye_masla_products_list',{title:'МКПП - интернет-магазин автозапчастей для иномарок, моторных масел', products : products, filterElements : filterElements, selectedAttr : resolve[2], pagesPaginator : pagesPaginator, seo : seo});
                },
                reject => {
                    log.info('some errors in handling Promise.all([getProducts, getAttr, returnSelectedAttr, returnAttrJSON, getSEOText]) ' + reject);
                }
            )
        },
        reject => {
            log.info('some errors in proces gettig data from /data/filter/oil_attr.json ' + reject);
        })
}
// in feature we can use selectedAttr Object for renderin selected attr in filter on page