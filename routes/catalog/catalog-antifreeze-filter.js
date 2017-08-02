"use strict"
const _mysql = require('../../manageSQL.js'),
    log = require('../../utils/log'),
    fs = require('fs');



module.exports = (req, res) => {
    new Promise((resolve, reject) =>{
        fs.readFile('./data/filter/antifreeze_attr.json', (err, data) =>{
            if (err){
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        });
    }).then(
        resolve => {
            let queryObj = {};
            let selectedAttr = {};
            let arrUrl = req.params.sub_url.split('-');
            for(let j = 0; j < arrUrl.length; j++){
                for(let i = 0; i < resolve.length; i++){
                    for(let key in resolve[i]){
                        for(let k = 0; k < resolve[i][key].length; k++){
                            for(let prop in resolve[i][key][k]){
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
            let returnSelectedAttr = new Promise((resolve, reject) => {
                resolve(arrUrl);
            });
            let returnAttrJSON = new Promise((result, errors) => {
                result(resolve);
            });
            let query = ' category_id = 2 AND quantity > 0 AND ';
            let count = 0;
            for(let key in queryObj){
                query += (count ? " AND " : "") + key + " IN ('";
                query += queryObj[key].join("','")
                query += "')";
                count++;
            }
            query += ' ORDER BY name';
            let getProducts = new Promise((resolve, reject) => {
                let SQLquery = 'SELECT id, name, short_description, description, price, purchase_price, product_url, img_url, quantity, vendor, category_id, attr_manufacturer, attr_color, attr_antifreeze_class, attr_capacity, provider_num FROM products WHERE ' + query;
                _mysql(SQLquery, (err, rows) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows)
                    }
                })
            });
            let getAttr = new Promise((resolve, reject) =>{
                let SQLquery = 'SELECT attr_manufacturer, attr_color, attr_antifreeze_class, attr_capacity FROM products WHERE category_id = 2 and quantity > 0';
                _mysql(SQLquery, (err, rows) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows)
                    }
                });
            });
            let getSEOText = new Promise((resolve, reject) =>{
                fs.readFile('./data/seo/multi_attr_products.json', (err, data) =>{
                    if (err){
                        reject(err);
                    }else{
                        resolve(JSON.parse(data));
                    }
                });
            });
            Promise.all([getProducts, getAttr, returnSelectedAttr, returnAttrJSON, getSEOText]).then(
                resolve => {
                let filterBaseState = {
                    attr_manufacturer : [],
                    attr_antifreeze_class : [],
                    attr_color : [],
                    attr_capacity : []
                };
                for(let i = 0; i < resolve[1].length; i++){
                    let currentProd = resolve[1][i];

                    if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) === -1){
                        filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
                    }

                    if(filterBaseState.attr_antifreeze_class.indexOf(currentProd.attr_antifreeze_class) === -1){
                        filterBaseState.attr_antifreeze_class.push(currentProd.attr_antifreeze_class)
                    }

                    if(filterBaseState.attr_color.indexOf(currentProd.attr_color) === -1){
                        filterBaseState.attr_color.push(currentProd.attr_color)
                    }

                    if(filterBaseState.attr_capacity.indexOf(currentProd.attr_capacity) === -1){
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
                        for(let j = 0; j < resolve[3].length; j++){
                            for(let prop in resolve[3][j]){
                                for(let k = 0; k < resolve[3][j][prop].length; k++){
                                    for(let pr in resolve[3][j][prop][k]){
                                        if(pr == filterBaseState[key][i]){
                                            let curObj = resolve[3][j][prop][k];
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
                // SEO

                let seo = {};
                seo.h1 = "Автомобильные антифризы";
                seo.title = "Магазин МКПП | Атомобильные антифризы";
                seo.text = "";
                    //TODO: Improve for SEO
                // resolve[4].forEach((item, i, arr) => {
                //     if(item.url == main_url){
                //         item['sub_category'].some((item, i, arr)=>{
                //             if(req.params.manufacturers_url == item['param']){
                //                 for(var key in item['data']){
                //                     seo[key] = item['data'][key]
                //                 }
                //                 return true
                //             }
                //         })
                //         return true;
                //     }
                // });


                // Pages paginator
                let pagesPaginator = [];
                if (resolve[0].length > 20){
                    let numPages = Math.ceil(resolve[0].length / 20);
                        pagesPaginator.push({
                            'name' : '<< В начало',
                            'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=1',
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
                                        'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=' + startPage,
                                        isActive : true
                                    })
                                } else{
                                    pagesPaginator.push({
                                        'name' : startPage,
                                        'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=' + startPage,
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
                            'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=1',
                            isActive : true
                        })
                        if(numPages > 6){
                            for(let i = 2; i < 8; i++){
                                pagesPaginator.push({
                                    'name' : i,
                                    'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=' + i,
                                    isActive : false
                                })
                            }
                        }else{
                            for(let i = 2; i < numPages + 1; i++){
                                pagesPaginator.push({
                                    'name' : i,
                                    'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=' + i,
                                    isActive : false
                                })
                            }
                        }
                    }
                    pagesPaginator.push({
                        'name' : 'В конец >>',
                        'href' : '/catalog/antifreeze/'+ req.params.sub_url + '?page=' + numPages,
                        isActive : false
                    })
                }
                let products;
                if(req.query.page == 1 || req.query.page === undefined){
                    products = resolve[0].splice(0, 20);
                }else{
                    products = resolve[0].splice(20 * (req.query.page - 1), 20);
                }
                    res.render('catalog/antifreeze_products_list.pug', {title: seo.title, products : products, filterElements : filterElements, selectedAttr : {}, pagesPaginator : pagesPaginator, seo : seo});
                },
                reject => {
                    log.info('some errors in handling Promise.all() catalog-antifreeze-filter' + reject);
                }
            )
        },
        reject => {
            log.info('some errors in proces gettig data from /data/filter/multi_attr_products.json ' + reject);
        })
}
// in feature we can use selectedAttr Object for rendering selected attr in filter on page