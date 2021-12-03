const mysql = require('mysql2');

function openConnection() {
console.log(`Коннекшн открыт. Выполняю запрос...`);
return new Promise((resolve, reject) => {
  const connection = mysql.createConnection( {
    host: "db.19ivt.ru",
    user: "osu",
    database: "conf-db",
    password: "12345"
  });
  connection.connect((err) => {
    if (err) {
      reject(err);
    } else {
      resolve(connection);
    }
  });
});
}

function closeConnection (connection) {
  connection.destroy();
  console.log("Вроде выполнил. Коннекшн закрыт.");
}

module.exports.queryExec = (queryText) => {
    return new Promise((resolve, reject) => {
        openConnection().then(connection => {
            connection.query(queryText, 
            (err, res, meta) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
            closeConnection(connection);
        });
    });
}