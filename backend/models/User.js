/* Importation des modules */
const sequelize = require('sequelize');

/* Création du schémas de données */
const userSchema = sequelize.define('User', {
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
});

/* Exportation du schéma de données */
module.exports = sequelize.define('User', userSchema);