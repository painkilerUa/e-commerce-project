"use strict"
const _mysql = require('../../manageSQL.js'),
    log = require('../../utils/log'),
    fs = require('fs');

module.exports = (req, res) => {
    let getAttrJSON = new Promise((resolve, reject) =>{
        fs.readFile('./data/filter/antifreeze_attr.json', (err, data) =>{
            if (err){
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
    let getProducts = new Promise((resolve, reject) => {
        let SQLquery = 'SELECT id, name, short_description, description, price, purchase_price, product_url, img_url, quantity, vendor, category_id, attr_manufacturer, attr_color, attr_antifreeze_class, attr_capacity, provider_num FROM products WHERE category_id = 2 and quantity > 0';
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows)
            }
        })
    });
    let getAttr = new Promise((resolve, reject) => {
        let SQLquery = 'SELECT attr_manufacturer, attr_capacity, attr_color, attr_antifreeze_class FROM products WHERE category_id = 2 and quantity > 0';
        _mysql(SQLquery, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows)
            }
        })
    });

    Promise.all([getProducts, getAttr, getAttrJSON]).then(
        resolve => {
            var filterBaseState = {
                attr_manufacturer : [],
                attr_antifreeze_class : [],
                attr_color : [],
                attr_capacity : []
            };
            for(var i = 0; i < resolve[1].length; i++){
                var currentProd = resolve[1][i];

                if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) == -1){
                    filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
                }
                if(filterBaseState.attr_antifreeze_class.indexOf(currentProd.attr_antifreeze_class) == -1){
                    filterBaseState.attr_antifreeze_class.push(currentProd.attr_antifreeze_class)
                }
                if(filterBaseState.attr_color.indexOf(currentProd.attr_color) == -1){
                    filterBaseState.attr_color.push(currentProd.attr_color)
                }
                if(filterBaseState.attr_capacity.indexOf(currentProd.attr_capacity) == -1){
                    filterBaseState.attr_capacity.push(currentProd.attr_capacity)
                }
            }
            filterBaseState.attr_manufacturer.sort();
            filterBaseState.attr_antifreeze_class.sort();
            filterBaseState.attr_color.sort();
            filterBaseState.attr_capacity.sort((a, b) => {return a - b});

            let filterElements = {};

            for(let key in filterBaseState){
                for(let i = 0; i < filterBaseState[key].length; i++){
                    for(let j = 0; j < resolve[2].length; j++){
                        for(let prop in resolve[2][j]){
                            for(let k = 0; k < resolve[2][j][prop].length; k++){
                                for(let pr in resolve[2][j][prop][k]){
                                    if(pr == filterBaseState[key][i]){
                                        let curObj = resolve[2][j][prop][k];
                                        curObj.isChecked = false;
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
            // Pages paginator
            let pagesPaginator = [];
            if (resolve[0].length > 20){
                let numPages = Math.ceil(resolve[0].length / 20);
                pagesPaginator.push({
                    'name' : '<< В начало',
                    'href' : '/catalog/antifreeze/' + '?page=1',
                    isActive : false
                })
                if(req.query.page) {
                    let count = 0;
                    let startPage;
                    if((numPages - 3) < req.query.page){
                        startPage = numPages - 6;
                    }else{
                        startPage = req.query.page - 3;
                    }
                    while( count < 7 && count < numPages && startPage < numPages + 1){
                        if(startPage > 0){
                            if(startPage == req.query.page){
                                pagesPaginator.push({
                                    'name' : startPage,
                                    'href' : '/catalog/antifreeze/' + '?page=' + startPage,
                                    isActive : true
                                })
                            } else{
                                pagesPaginator.push({
                                    'name' : startPage,
                                    'href' : '/catalog/antifreeze/'+ '?page=' + startPage,
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
                        'href' : '/catalog/antifreeze/' + '?page=1',
                        isActive : true
                    })
                    if(numPages > 6){
                        for(let i = 2; i < 8; i++){
                            pagesPaginator.push({
                                'name' : i,
                                'href' : '/catalog/antifreeze/' + '?page=' + i,
                                isActive : false
                            })
                        }
                    }else{
                        for(let i = 2; i < numPages + 1; i++){
                            pagesPaginator.push({
                                'name' : i,
                                'href' : '/catalog/antifreeze/' + '?page=' + i,
                                isActive : false
                            })
                        }
                    }
                }
                pagesPaginator.push({
                    'name' : 'В конец >>',
                    'href' : '/catalog/antifreeze/'+ '?page=' + numPages,
                    isActive : false
                })
            }
            let products;
            if(req.query.page == 1 || req.query.page == undefined){
                products = resolve[0].splice(0, 20);
            }else{
                products = resolve[0].splice(20 * (req.query.page - 1), 20);
            }

// SEO
            let seo = {};
            seo.h1 = "Автомобильные антифризы";
            seo.title = "Магазин МКПП | Автомобильные антифризы";
            seo.text = "";
            res.render('catalog/antifreeze_products_list.pug',{title: seo.title, products : products, filterElements : filterElements, selectedAttr : {}, pagesPaginator : pagesPaginator, seo : seo});
        },
        reject => {
            log.info('some errors in handling Promise.all([getProducts, getAttr, returnAttrJSON]) ' + reject);
        }
    )
}