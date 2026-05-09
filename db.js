const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'S0seiquenadasei.', 
    database: 'oinksafe_db' 
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado à base de dados MySQL!');
});

module.exports = connection;