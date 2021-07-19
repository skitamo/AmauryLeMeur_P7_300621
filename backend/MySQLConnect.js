/* Importation des modules */
const mysql = require('mysql');

/* Module permettant de stocker des informations sensible séparément du code */
require('dotenv').config();

/* Connection à la base de donnée */
exports.connection = mysql.createPool({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASSWORD,
	database : process.env.DATABASE,
	port : 3306
});