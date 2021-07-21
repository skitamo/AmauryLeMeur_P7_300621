const connection = require('../MySQLConnect').connection;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/* Module permettant de stocker des informations sensibles séparément du code */
require('dotenv').config();

/* Middleware permettant de créer un nouvel utilisateur */
exports.signup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const email = req.body.email;
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const password = hash;

		let sql = `INSERT INTO User VALUES (NULL, ?, ?, ?, ?, NULL, NULL, DEFAULT, NOW())`;
		let values = [email, firstname, lastname, password];

		connection.query(sql, values,
			function (err, result) {
				if (err) {
					return res.status(500).json({ error: "Erreur serveur !" });
				}
				res.status(201).json({ message: "Utilisateur créé !" });
			}
		);
	})
	.catch(e => res.status(500).json({ error: "Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un symbole spécial"}))
};

/* Middleware permettant la connexion d'un utilisateur existant */
exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	let sql = `SELECT userId, password FROM User WHERE email = ?`;
	let values = [email];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length===0) {
				return res.status(401).json({ error: "L'utilisateur n'existe pas. Veuillez-vous inscrire avant de vous connecter !"});
			}

			bcrypt.compare(password, result[0].password)
			.then(valid => {
				if (!valid) {
					return res.status(401).json({ error: "Mot de passe incorrect !"});
				}
				res.status(200).json({
					userId: result[0].userId,
					token: jwt.sign(
						{ userId: result[0].userId },
						process.env.KEY_TOKEN,
						{ expiresIn: '24h' }
					)
				});
			})
			.catch(error => res.status(500).json({ error: "Erreur serveur !"}));
		}
	);
};

/* Middleware permettant de supprimer un utilisateur */
exports.deleteUser = (req, res, next) => {
	const userId = res.locals.userId;
	const password = req.body.password;

	let sql = `SELECT password, profilePicture FROM User WHERE userId = ?`;
	let values = [userId];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length===0) {
				return res.status(401).json({ error: "Utilisateur non trouvé !"});
			}

			const filename = result[0].profilePicture.split('/images/')[1];
			if (filename != "avatar_default.svg") {
				fs.unlink(`images/${filename}`, () => {
					if (error) {
						return res.status(500).json({ error: "Erreur serveur !" });
					}
				});
			}

			bcrypt.compare(password, result[0].password)
			.then(valid => {
				if (!valid) {
					return res.status(401).json({ error: "Mot de passe incorrect !" });
				} else {
					let sql = `DELETE FROM User WHERE userId = ?`;
					let values = [userId];

					connection.query(sql, values,
						function (error, result) {
							if (error) {
								return res.status(500).json(error.message);
							}
							res.status(201).json({ message: "Utilisateur supprimé !" });
						}
					);
				}
			})
			.catch(error => res.status(500).json({ error: "Erreur serveur !"}));
		}
	);
};

/* Middleware permettant de modifier un utilisateur */
exports.updateUser = (req, res, next) => {
	const userId = res.locals.userId;
	const email = req.body.email;
	const resume = req.body.resume;
	const password = req.body.password;

	if (req.file) { /* Si le changement concerne la photo de profile, on update directement */
		const profilePicture = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

		let sql = `SELECT profilePicture FROM User WHERE userId = ?`;
		let values = [userId];

		connection.query(sql, values,
			function (err, result) {
				if (err) {
					return res.status(500).json({ error: "Erreur serveur !" });
				}

				const filename = result[0].profilePicture.split('/images/')[1];

				let sql = `UPDATE User SET profilePicture = ? WHERE userId = ?`;
				let values = [profilePicture, userId];

				if (filename !== "avatar_default.svg") {
					fs.unlink(`images/${filename}`, () => { /* On supprime le fichier en amont */

						connection.query(sql, values, function (err, result) {
							if (err) {
								return res.status(500).json({ error: "Erreur serveur !" });
							}
							return res.status(200).json({ message: "Utilisateur modifié !" });
						});
					});
				} else {
					connection.query(sql, values, function (err, result) {
						if (err) {
							return res.status(500).json({ error: "Erreur serveur !"});
						}
						return res.status(200).json({ message: "Utilisateur modifié !"});
					});
				}
			}
		);

	} else {

		let sql = `SELECT password FROM User WHERE userId = ?`;
		let values = [userId];

		connection.query(sql, values,
			function (err, result) {
				if (err) {
					return res.status(500).json({ error: "Erreur serveur !" });
				}
				if (result.length == 0) {
					return res.status(401).json({ error: "Utilisateur non trouvé !" });
				}

				const newPassword = req.body.newPassword;

				bcrypt.compare(password, result[0].password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					if (newPassword) { /* Si un nouveau mot de passe est défini */
					bcrypt.hash(newPassword, 10)
						.then(hash => {
							sql = `UPDATE User SET email = ?, resume = ?, password = ? WHERE userId = ?`;
							values = [email, resume, hash, userId];

							connection.query(sql, values, 
								function (err, result) {
									if (err) {
										return res.status(500).json({ error: "Erreur serveur !" });
									}
									if (result.affectedRows == 0) {
										return res.status(400).json({ error: "Erreur serveur : Impossible de modifier cet utilisateur !" });
									}
									res.status(200).json({ message: "Modifications enregistrées !" });
								}
							);
						})
						.catch(e => res.status(500).json({ error: "Erreur serveur !" }));

					} else { /* Si le mot de passe reste le même */
						sql = `UPDATE User SET email = ?, resume = ? WHERE userId = ?`;
						values = [email, resume, userId];

						connection.query(sql, values,
							function (err, result) {
								if (err) {
									return res.status(500).json({ error: "Erreur serveur !"});
								}
								if (result.affectedRows == 0) {
									return res.status(400).json({ error: "Erreur serveur : Impossible de modifier cet utilisateur !" });
								}
								res.status(200).json({ message: "Modifications enregistrées !" });
							}
						);
					}
				})
				.catch(error => res.status(500).json({ error: "Erreur serveur !" }));
			}
		);
	}
};

/* Middleware permettant d'afficher le profil d'un utilisateur */
exports.displayProfile = (req, res, next) => {
	const userId = req.params.id;

	let sql = `SELECT userId, firstName, lastName, email, resume, profilePicture, DATE_FORMAT(user.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, job, role FROM User WHERE userId = ?`;
	let values = [userId];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length===0) {
				return res.status(401).json({ error: "L'utilisateur n'existe pas !" });
			}
			res.status(200).json(result);
		}
	);
};

/* Middleware pour afficher le profil de l'utilisateur connecté */
exports.getUserConnected = (req, res, next) => {
	const userId = res.locals.userId;

	let sql = `SELECT userId, firstName, lastName, email, resume, profilePicture, DATE_FORMAT(user.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, job, role FROM User WHERE userId = ?`;
	let values = [userId];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length===0) {
				return res.status(401).json({ error: "L'utilisateur n'existe pas !" });
			}
			res.status(200).json(result);
		}
	);
};