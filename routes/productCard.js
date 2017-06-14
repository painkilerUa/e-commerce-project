var manage = require('../manage.js'),
    log = require('../utils/log');



module.exports = function(req, res, next){
    var getProductByUrl = new Promise ((resolve, reject) =>{
        var connection = manage.createConnection(),
        SQLquery = "SELECT id, name, short_description, description, price, product_url, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity FROM products WHERE product_url= '" + req.params.product_url + "'";
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

    getProductByUrl.then(
        resolve => {
            var breadCrumbs = {
                'Главная' : '/'
            };
            switch(resolve[0].category_id) {
                case 1:
                    breadCrumbs['Масла'] = '/catalog/avtomobilnye-masla/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 7:
                    breadCrumbs['Масляные фильтры'] = '/catalog/maslyanii-filtr/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 8:
                    breadCrumbs['Воздушные фильтры'] = '/catalog/vozdyshnii-filtr/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 9:
                    breadCrumbs['Фильтры топливные'] = '/catalog/toplivnii-filtr/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 424:
                    breadCrumbs['Фильтры салона'] = '/catalog/filtr-salona/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 306:
                    breadCrumbs['Ремни ГРМ'] = '/catalog/remen-grm/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 305:
                    breadCrumbs['Ремни поликлиновые'] = '/catalog/remen-generatora/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 1217:
                    breadCrumbs['Болты ГБЦ'] = '/catalog/bolt-golovki-bloka-cilindrov/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 82:
                    breadCrumbs['Тормозные диски'] = '/catalog/tormoznoy-disk/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 402:
                    breadCrumbs['Тормозные колодки'] = '/catalog/tormoznyie-kolodki/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 70:
                    breadCrumbs['Тормозные колодки барабанные'] = '/catalog/tormoznyie-kolodki-baraban/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 258:
                    breadCrumbs['Главные тормозные цилиндры'] = '/catalog/glavnii-tormoznoi-cilindr/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 277:
                    breadCrumbs['Рабочие тормозные цилиндры'] = '/catalog/rabochii-tormoznoi-cilindr/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 854:
                    breadCrumbs['Амортизаторы'] = '/catalog/amortizator/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 2462:
                    breadCrumbs['Шаровые опоры'] = '/catalog/sharovaya-opora/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 914:
                    breadCrumbs['Наконечники рулевой тяги'] = '/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 919:
                    breadCrumbs['Пыльники амортизатора'] = '/catalog/pyilnik-amortizatora/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 251:
                    breadCrumbs['Сайлентблоки рычага'] = '/catalog/saylentblok-ryichaga/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 5:
                    breadCrumbs['Шарниры равных угловых скоростей'] = '/catalog/shrys/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 13:
                    breadCrumbs['Полуоси моста'] = '/catalog/polyos/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 479:
                    breadCrumbs['Комплекты сцепления'] = '/catalog/komplekt-scepleniya/';
                    breadCrumbs[resolve[0].name] = '';
                break
                case 316:
                    breadCrumbs['Термостаты'] = '/catalog/termostat/';
                    breadCrumbs[resolve[0].name] = '';
                break
                default:
                    breadCrumbs[resolve[0].name] = '';
                break
            }
            // if(resolve[0].category_id == 1){
            //     breadCrumbs['Масла'] = '/catalog/avtomobilnye-masla/';
            //     breadCrumbs[resolve[0].name] = '';
            // }else{
            //     breadCrumbs[resolve[0].name] = '';
            // }
            res.render('catalog/product_card',{title: resolve[0].name, product : resolve[0], breadCrumbs : breadCrumbs});
        },
        reject => {
            log.info('some errors in proces rendering product page card file productCard.js ' + reject);
        }
    )
}

