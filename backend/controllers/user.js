// Importation des modules
const connection = require('../MySQLConnect').connection;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Module qui permet de stocker des informations sensibles séparément du code
require('dotenv').config();

// Module qui permet de se connecter à la base de données

const connection = mysql.createPool({
    host     : 'localhost',
    user     : 'Groupoadmin',
    password : 'GroupoPW',
    database : 'groupomaniadb',
    timezone : 'local',
    charset : 'utf8mb4'
  });

// Middleware pour créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = hash;
        console.log(hash)

        let sql = `INSERT INTO users VALUES (NULL, ?, ?, ?, ?, NULL, NULL, DEFAULT, NOW())`;
        let values = [email, firstname, lastname, password];
        
        console.log(connection)
        connection.query(sql, values, 
            function (err, result) {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.status(201).json({ message: "Utilisateur créé !" });
            }
        );
    })
    .catch(e => res.status(500).json(e));
};

// Middleware pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let sql = `SELECT userId, password FROM Users WHERE email = ?`;
    let values = [email];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            if (result.length===0) {
                return res.status(401).json({ error: "L'utilisateur n'existe pas. Veuillez vous inscrire d'abord !" });
            }
        
            bcrypt.compare(password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: result[0].userId,
                    token: jwt.sign(
                        { userId: result[0].userId },
                        process.env.TOK_SECRET,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error: "Erreur serveur !" }));
        }
    );
};

// Middleware pour supprimer un utilisateur
exports.deleteUser = (req, res, next) => {
    const userId = res.locals.userId;
    const password = req.body.password;

    let sql = `SELECT password, photoProfil FROM Users WHERE userId = ?`;
    let values = [userId];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            if (result.length===0) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            
            const filename = result[0].photoProfil.split('/images/')[1];
            if (filename != "photoProfil_default.jpg") {
                fs.unlink(`images/${filename}`, () => {
                    if (error) {
                        return res.status(500).json({ error: "Erreur serveur !" });
                    }
                });
            }

            bcrypt.compare(password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                } else {
                    let sql = `DELETE FROM Users WHERE userId = ?`;
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
            .catch(error => res.status(500).json({ error: "Erreur serveur !" }));
        }
    );
};

//Middleware pour modifier un utilisateur
exports.updateUser = (req, res, next) => {
    const userId = res.locals.userId;
    const email = req.body.email;
    const bio = req.body.bio;
    const password = req.body.password;

    if (req.file) { // Si le changement concerne l'avatar on update directement
        const photoProfil = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        let sql = `SELECT photoProfil FROM Users WHERE userId = ?`;
        let values = [userId];

        connection.query(sql, values, 
            function (err, result) {
                if (err) {
                    return res.status(500).json({ error: "Erreur serveur !" });
                }

                const filename = result[0].photoProfil.split('/images/')[1];

                let sql = `UPDATE Users SET photoProfil = ? WHERE userId = ?`;
                let values = [photoProfil, userId];

                if (filename !== "photoProfil_default.jpg") {
                    fs.unlink(`images/${filename}`, () => {// On supprime le fichier image en amont
                        
                        connection.query(sql, values, function (err, result) {
                            if (err) {
                                return res.status(500).json({ error: "Erreur serveur !" });
                            }
                            return res.status(200).json({ message: "Utilisateur modifé !" });
                        });
                    });
                } else {
                    connection.query(sql, values, function (err, result) {
                        if (err) {
                            return res.status(500).json({ error: "Erreur serveur !" });
                        }
                        return res.status(200).json({ message: "Utilisateur modifé !" });
                    });
                }
            }
        );

    } else {

        let sql = `SELECT password FROM Users WHERE userId = ?`;
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
                    if (newPassword) { // Si un nouveau mdp est défini
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                sql = `UPDATE Users SET email = ?, bio = ?, password = ? WHERE userId = ?`;
                                values = [email, bio, hash, userId];

                                connection.query(sql, values, 
                                    function (err, result) {
                                        if (err) {
                                            return res.status(500).json({ error: "Erreur serveur !" });
                                        }
                                        if (result.affectedRows == 0) {
                                            return res.status(400).json({ error: "Erreur serveur : Impossible de modifier cet utilisateur !" });
                                        }
                                        res.status(200).json({ message: "Modifications bien prises en compte !" });
                                    }
                                );
                            })
                            .catch(e => res.status(500).json({ error: "Erreur serveur !" }));

                    } else { // Si le mdp reste le même
                        sql = `UPDATE Users SET email = ?, bio = ? WHERE userId = ?`;
                        values = [email, bio, userId];

                        connection.query(sql, values, 
                            function (err, result) {
                                if (err) {
                                    return res.status(500).json({ error: "Erreur serveur !" });
                                }
                                if (result.affectedRows == 0) {
                                    return res.status(400).json({ error: "Erreur serveur : Impossible de modifier cet utilisateur !" });
                                }
                                res.status(200).json({ message: "Modifications bien prises en compte !" });
                            }
                        );
                    }
                })
                .catch(error => res.status(500).json({ error: "Erreur serveur !" }));
            }
        );
    }
};

//Middleware pour afficher le profil d'un utilisateur
exports.displayProfil = (req, res, next) => {
    const userId = req.params.id;

    let sql = `SELECT userId, firstname, lastname, email, bio, photoProfil, DATE_FORMAT(users.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, role FROM Users WHERE userId = ?`;
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

//Middleware pour afficher le profil de l'utilisateur connecté
exports.getUserConnected = (req, res, next) => {
    const userId = res.locals.userId;

    let sql = `SELECT userId, firstname, lastname, email, bio, photoProfil, DATE_FORMAT(users.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, role FROM Users WHERE userId = ?`;
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
}