const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 8080,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    connection.end();
});