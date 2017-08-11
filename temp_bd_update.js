var manage = require('./manage.js'),
    mysql = require ('mysql');



    var getProducts = new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'password',
            database : 'mkpp_update'
            });

        var SQLquery = "SELECT * FROM products WHERE category_id = 3";
        connection.connect();
        connection.query(SQLquery, function(err, rows, fields) {
            if (err) {
                reject(err);
                connection.end();
            }
            resolve(rows);
            connection.end();
        });
    });

    getProducts
        .then(
            result => {
                var queryArr = [];
                // var changes = {
                //     'моторное масло' : 'engoil',
                //     'трансмиссионное масло' : 'transoil',
                //     'ARAL' : 'aral',
                //     'BMW' : 'bmw',
                //     'CASTROL' : 'castrol',
                //     'ELF' : 'elf',
                //     'FORD' : 'ford',
                //     'FUCHS TITAN' : 'fuchs',
                //     'GM' : 'gm',
                //     'LIQUI MOLY' : 'lm',
                //     'MAZDA' : 'mazda',
                //     'MERCEDES-BENZ' : 'mb',
                //     'MOBIL' : 'mobil',
                //     'MOBIS' : 'mobis',
                //     'NISSAN' : 'nissan',
                //     'SUBARU' : 'subaru',
                //     'TOTAL' : 'total',
                //     'TOYOTA' : 'toyota',
                //     'VAG' : 'vag',
                //     'ZIC' : 'zic',
                //     '0W-30' : '0w30',
                //     '0W-40' : '0w40',
                //     '10W-30' : '10w30',
                //     '10W-40' : '10w40',
                //     '10W-60' : '10w60',
                //     '15W-40' : '15w40',
                //     '5W-20' : '5w20',
                //     '5W-30' : '5w30',
                //     '5W-40' : '5w40',
                //     '75W-80' : '75w80',
                //     '75W-85' : '75w85',
                //     '75W-90' : '75w90',
                //     '80W-90' : '80w90',
                //     '85W-140' : '85w140',
                //     'минеральная' : 'mineral',
                //     'полусинтетическая' : 'semisynth',
                //     'синтетическая' : 'synth'
                // }

//                var changes = {
//                    'BOSCH' : 'bosch',
//                    'ASHIKA': 'ashika',
//                    'VERNET': 'vernet',
//                    'KNECHT' : 'knecht',
//                    'MANN' : 'mann',
//                    'MFILTER' : 'mfilter',
//                    'LUK': 'luk',
//                    'CIFAM': 'cifam',
//                    'AISIN': 'aisin',
//                    'MOBIS' : 'mobis',
//                    'PURFLUX' : 'purflux',
//                    'WIX' : 'wix',
//                    'CONTITECH' : 'contitech',
//                    'DAYCO': 'dayco',
//                    'FEBI BILSTEIN': 'febi',
//                    'RIDER': 'rider',
//                    'RUVILLE': 'ruville',
//                    'TRW': 'trw',
//                    'MANDO' : 'mando',
//                    'LEMFORDER' : 'lemforder',
//                    'PARTS MALL': 'partsmall',
//                    'CTR': 'ctr'
//                }

                // var changes = {
                //     'ALASKA' : 'alaska',
                //     'HEPU' : 'hepu',
                //
                // }
                // var changes = {
                //     'G12' : 'g12',
                //     'G11' : 'g11',
                //
                // }
                // var changes = {
                //     'Зеленый' : 'green',
                //     'Красный' : 'red',
                //     'Лиловый' : 'violet'
                //
                // }
                var changes = {
                    'CAR TECH' : 'cartech',
                    'PLASTPIL' : 'plastpil'
                }

// query for motor oil queryArr.push("UPDATE products SET attr_type='" + changes[result[i]['attr_type']] + "', attr_manufacturer='" + changes[result[i]['attr_manufacturer']] + "', attr_vid='"+ changes[result[i]['attr_vid']] + "', attr_sae= '" + changes[result[i]['attr_sae']] + "' WHERE id=" + result[i]['id']);
// query for oil filter queryArr.push("UPDATE products SET attr_manufacturer='" + changes[result[i]['attr_manufacturer']] + "' WHERE id=" + result[i]['id']);


                for(var i = 0; i < result.length; i++){
                    queryArr.push("UPDATE products SET attr_manufacturer='" + changes[result[i]['attr_manufacturer']] + "' WHERE id=" + result[i]['id']);
                }
                makeUpdate(queryArr);
                function makeUpdate(queryArr){
                    var query = queryArr.shift();
                    if(!query) return;
                    return update(query).then(
                        resolve => {
                            makeUpdate(queryArr);
                            console.log('made changes')
                        },
                        reject => {
                            console.log('some error' + reject);
                        }
                    )
                }
                function update(query){
                    return new Promise((resolve, reject) => {
                        var connection = mysql.createConnection({
                            host     : 'localhost',
                            user     : 'root',
                            password : 'password',
                            database : 'mkpp_update'
                            });

                        var SQLquery = query;
                        connection.connect();
                        connection.query(SQLquery, function(err, rows, fields) {
                            if (err) {
                                reject(err);
                                connection.end();
                            }
                            resolve(rows);
                            connection.end();
                        });
                    })
                }
            },
            reject => {
                console.log(reject)
            }
        );

// UPDATE products SET attr_type='engoil', attr_manufacturer='aral', attr_vid='semisynth', attr_sae= '10w40' WHERE id=2;