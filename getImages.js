var fs = require('fs');
var mysql      = require('mysql');


var readFile = new Promise( (resolve, reject) =>{
  fs.readFile('./publick/temporaryfiles/omega', (err, data) =>{
    if (err) reject('error in reading file' + err);
    var vendorrArray = data.toString().split(',');
    resolve(vendorrArray);
  });
});

readFile.then(
  resolve => {
    for(var i = 0; i < resolve.length; i++){
      getImages(resolve[i]);
    }
  },
  reject =>{

  }
)

function getImages(vendor){
  var getDataForImage = new Promise ((resolve, reject) => {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'password',
      database : 'tecdoc'
    });
    connection.connect();
    var SQL = "SELECT GRA_TAB_NR, GRA_GRD_ID FROM ART_FOR_IMG INNER JOIN TOF_LINK_GRA_ART ON LGA_ART_ID = ART_ID INNER JOIN TOF_GRAPHICS ON GRA_ID = LGA_GRA_ID WHERE ART_ARTICLE_NR = '" + vendor + "'";
    connection.query(SQL, function(err, rows, fields) {
        if (err) {
            reject(err, vendor);
            connection.end();
        }
        connection.end();
        resolve(rows);
    });
  });
  getDataForImage
      .then(
          (rows) => {
              var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : 'password',
                database : 'tecdoc'
              });
              connection.connect();
              var SQL = "SELECT GRD_GRAPHIC from tof_gra_data_" + rows[0]['GRA_TAB_NR'] + " where grd_id = " + rows[0]['GRA_GRD_ID'];
              connection.query(SQL, function(err, rows, fields) {
                  connection.end();
                  fs.writeFile('./temporaryImgImport/' + vendor.replace(/\//g, '') + '.jp2', rows[0]['GRD_GRAPHIC'], err => {
                  if (err) throw err;
                   console.log('images ' + vendor + '.jp2 created');
                  });
              });
          }
      )
      .catch(error => {
          console.log(vendor + ' images did not created');
      });
}


//Commands for converting images files from jp2 to jpg
//FOR %a IN (*.jp2) do (magick convert %a %a.jpg)
