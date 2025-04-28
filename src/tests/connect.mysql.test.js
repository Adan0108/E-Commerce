const mysql = require('mysql2');

//create connection to pool server

const pool = mysql.createPool({
  host: "localhost",
  user: "adan",
  password: "123456", 
  database: "E-Commerce",
})

//perform a sample  operation to test the connection
pool.query('SELECT * from users', function (error, results, fields) {
  if (error) throw error;

  console.log('query result: ', results); // 2
  pool.end(err => {
    if (err) {
      console.error('Error closing the pool:', err);
    } else {
      console.log('Pool closed successfully.');
    }
  })
})
