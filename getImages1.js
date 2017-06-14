var fs = require('fs');
var mysql      = require('mysql');


  var getData = new Promise ((resolve, reject) => {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'password',
      database : 'mkpp'
    });
    connection.connect();
    var SQL = "SELECT id FROM products";
    connection.query(SQL, function(err, rows, fields) {
        if (err) {
            reject(err, vendor);
            connection.end();
        }
        connection.end();
        resolve(rows);
    });
  });

  getData.then(
    rows => {
      var promArr = [];
      for(var i = 0; i < rows.length; i++){
        promArr.push(
          new Promise ((resolve, reject) => {
            var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : 'password',
                database : 'mkpp'
              });
            connection.connect();
            var SQL = "UPDATE products set product_url = REPLACE(product_url, ' ', '-') WHERE id=" + rows[i].id;
            console.log(SQL);
            connection.query(SQL, function(err, rows, fields) {
                if (err) {
                    reject(err);
                    connection.end();
                }
                connection.end();
                resolve(rows);
            })
          })
          )
      }
      Promise.all(promArr).then(
          resolve =>{
            console.log(resolve)
          },
          reject => {
            console.log(reject)
          }
        )
    }
  )





