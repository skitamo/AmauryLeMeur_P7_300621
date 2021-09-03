// Importation du module mysql
const mysql = require('mysql');

// Module permettant de stocker des informations sensibles séparément du code
require('dotenv').config();

// Connection à la base de donnée
const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PW,
    database : process.env.DB_DATABASE,
    timezone : process.env.DB_TIMEZONE,
    charset : process.env.DB_CHARSET
  });