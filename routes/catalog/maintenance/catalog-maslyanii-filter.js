var simpleProducts = require('../components/simple-products');

module.exports = function(req, res, next){
    simpleProducts(req, res, 7, '/catalog/maslyanii-filtr/');
}
// module.exports = function(req, res, next){
//     var getAttrJSON = new Promise((resolve, reject) =>{
//         fs.readFile('./data/filter/simple_products_attr.json', (err, data) =>{
//             if (err){
//                 reject(err);
//             }
//             resolve(JSON.parse(data));
//         });
//     });
//     var getProducts = new Promise((resolve, reject) => {
//         var connection = manage.createConnection(),
//             SQLquery = 'SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, attr_manufacturer FROM products WHERE category_id = 7 and quantity > 0';
//         connection.connect();
//         connection.query(SQLquery, function(err, rows, fields) {
//             if (err) {
//                 reject(err);
//                 connection.end();
//             }
//             connection.end();
//             resolve(rows);
//         });
//     });
//     var getAttr = new Promise((resolve, reject) =>{
//         var connection = manage.createConnection(),
//             SQLquery = 'SELECT attr_manufacturer FROM products WHERE category_id = 7 and quantity > 0';
//         connection.connect();
//         connection.query(SQLquery, function(err, rows, fields) {
//             if (err) {
//                 reject(err);
//                 connection.end();
//             }
//             connection.end();
//             resolve(rows);
//         });
//     });
//     Promise.all([getProducts, getAttr, getAttrJSON])
//         .then(
//             resolve => {
//                 // filter settings
//                 var filterBaseState = {
//                     attr_manufacturer : []
//                 };
//                 for(var i = 0; i < resolve[1].length; i++){
//                     var currentProd = resolve[1][i]
//                     if(filterBaseState.attr_manufacturer.indexOf(currentProd.attr_manufacturer) == -1){
//                         filterBaseState.attr_manufacturer.push(currentProd.attr_manufacturer)
//                     }
//                 }
//                 filterBaseState.attr_manufacturer.sort();
//                 var filterElements = {};
//                 for(var key in filterBaseState){
//                     for(var i = 0; i < filterBaseState[key].length; i++){
//                         for(var j = 0; j < resolve[2].length; j++){
//                             for(var prop in resolve[2][j]){
//                                 for(var k = 0; k < resolve[2][j][prop].length; k++){
//                                     for(var pr in resolve[2][j][prop][k]){
//                                         if(pr == filterBaseState[key][i]){
//                                             var curObj = resolve[2][j][prop][k];
//                                             curObj.isChecked = false;
//                                             if(filterElements[prop] === undefined){
//                                                 filterElements[prop] = [curObj]
//                                             }else{
//                                                 filterElements[prop].push(curObj);
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 // Pages paginator
//                 var pagesPaginator = [];
//                 if (resolve[0].length > 20){
//                     var numPages = Math.ceil(resolve[0].length / 20);
//                         pagesPaginator.push({
//                             'name' : '<< В начало',
//                             'href' : '/catalog/maslyanii-filtr/' + '?page=1',
//                             isActive : false
//                         })
//                     if(req.query.page) {
//                         var count = 0;
//                         if((numPages - 3) < req.query.page){
//                             var startPage = numPages - 6;
//                         }else{
//                             var startPage = req.query.page - 3;
//                         }
//                         while( count < 7 && count < numPages && startPage < numPages + 1){
//                             if(startPage > 0){
//                                 if(startPage == req.query.page){
//                                     pagesPaginator.push({
//                                         'name' : startPage,
//                                         'href' : '/catalog/maslyanii-filtr/' + '?page=' + startPage,
//                                         isActive : true
//                                     })
//                                 } else{
//                                     pagesPaginator.push({
//                                         'name' : startPage,
//                                         'href' : '/catalog/maslyanii-filtr/'+ '?page=' + startPage,
//                                         isActive : false
//                                     })
//                                 }
//                                 count++;
//                             }
//                             startPage++;
//                         }
//                     }else{
//                         pagesPaginator.push({
//                             'name' : 1,
//                             'href' : '/catalog/maslyanii-filtr/' + '?page=1',
//                             isActive : true
//                         })
//                         if(numPages > 6){
//                             for(var i = 2; i < 8; i++){
//                                 pagesPaginator.push({
//                                     'name' : i,
//                                     'href' : '/catalog/maslyanii-filtr/' + '?page=' + i,
//                                     isActive : false
//                                 })
//                             }
//                         }else{
//                             for(var i = 2; i < numPages + 1; i++){
//                                 pagesPaginator.push({
//                                     'name' : i,
//                                     'href' : '/catalog/maslyanii-filtr/' + '?page=' + i,
//                                     isActive : false
//                                 })
//                             }
//                         }
//                     }
//                     pagesPaginator.push({
//                         'name' : 'В конец >>',
//                         'href' : '/catalog/maslyanii-filtr/'+ '?page=' + numPages,
//                         isActive : false
//                     })
//                 }
//                 if(req.query.page == 1 || req.query.page == undefined){
//                     var products = resolve[0].splice(0, 20);
//                 }else{
//                     var products = resolve[0].splice(20 * (req.query.page - 1), 20);
//                 }
//                 var seo = {};
//                 seo.h1 = "Масляные фильтра";
//                 seo.title = "Масляные фильтра";
//                 seo.text = "";
//                 res.render('catalog/main_products_list',{title: seo.title, products : products, filterElements : filterElements, selectedAttr : {}, pagesPaginator : pagesPaginator, seo : seo});
//             },
//             reject => {
//                 log.info('some errors in proces gettig data products from DB on file catalog/catalog-maslyanii-filter ' + reject);
//             }
//         );
// }

