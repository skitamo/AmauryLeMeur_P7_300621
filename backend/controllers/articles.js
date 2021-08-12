// Importation des modules
const connection = require('../MySQLConnect').connection;
const fs = require("fs");

//Middleware pour afficher tous les articles de la base de donnée
exports.getAllArticles = (req, res, next) => {

    const userId = res.locals.userId;

    let sql = `SELECT articles.articleId, articles.userId, articles.text, articles.mediaUrl, DATE_FORMAT(articles.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, users.firstname, users.lastname, users.photoProfil, COUNT(DISTINCT comments.commentId) AS numberOfComments, COUNT(DISTINCT likes.userId) AS numberOfLikes, COUNT(CASE WHEN likes.userId = ? THEN 1 ELSE null END) AS isLiked 
    FROM Articles
    LEFT JOIN Comments ON articles.articleId = comments.articleId
    LEFT JOIN Users ON articles.userId = users.userId
    LEFT JOIN Likes ON articles.articleId = likes.articleId GROUP BY articles.articleId ORDER BY articles.dateCreation DESC`;
     
    let values = [userId];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            if (result.length == 0) {
                return res.status(400).json({ error: "Aucun article à afficher !" });
            }
            res.status(200).json(result);
        }
    );
};

//Middleware pour afficher un article
exports.getOneArticle = (req, res, next) => {

    const articleId = req.params.id;

    let sql = `SELECT articles.userId, articles.text, articles.mediaUrl, DATE_FORMAT(articles.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, users.firstname, users.lastname, users.photoProfil FROM Articles LEFT JOIN Users ON articles.userId = users.userId WHERE articles.articleId = ?`;
    let values = [articleId];

    connection.query(sql, values, 
        function (err, result) {
            if (err) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            res.status(200).json(result);
        }
    );
};

// Middleware pour créer un article
exports.createArticle = (req, res, next) => {

    const userId = res.locals.userId;
    const text = req.body.text;

    var sqlInsert;
    var values;

    const mediaUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    sqlInsert = `INSERT INTO Articles VALUES (NULL, ?, ?, ?, NOW())`;
    values = [userId, text, mediaUrl];    

    connection.query(sqlInsert, values,
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            res.status(201).json({ message: "Article créé !"});
        }
    );
};

// Middleware pour supprimer un article
exports.deleteArticle = (req, res, next) => {
    const articleId = req.params.id;

    let sqlSelect;
    let sqlDelete;
    let values = [articleId];

    sqlSelect = `SELECT mediaUrl FROM Articles WHERE articleId = ?`;
    connection.query(sqlSelect, values, 
        function (error, result) {
            if (result.length > 0) {
                const filename = result[0].mediaUrl.split("/images/")[1];
                
                fs.unlink(`images/${filename}`, () => {

                    sqlDelete = `DELETE FROM Articles WHERE articleId = ?`;
                    connection.query(sqlDelete, values, 
                        function (error, result) {
                            if (error) {
                                return res.status(500).json({ error: "Erreur serveur !" });
                            }
                            res.status(200).json({ message: "Article supprimé !" });
                        }
                    );
                });               
            } else {
                sqlDelete = `DELETE FROM Articles WHERE articleId = ?`;
                connection.query(sqlDelete, values, 
                    function (error, result) {
                        if (error) {
                            return res.status(500).json(error.message);
                        }
                        res.status(200).json({ message: "Article supprimé !" });
                    }
                );
            }
            if (error) {
                return res.status(500).json(error.message);
            }
        }
    );
};

// Middleware pour liker un article
exports.likeArticle = (req, res, next) => {
    const userId = res.locals.userId;
    const articleId = req.params.id;

    let sqlCount;
    let sqlDelete;
    let sqlInsert;

    sqlCount = `SELECT COUNT(*) AS likeId FROM Likes WHERE userId = ? && articleId = ?`;
    let values = [userId, articleId];

    connection.query(sqlCount, values, 
        function (error, result) {
            if (result[0].likeId > 0) {
                sqlDelete = `DELETE FROM Likes WHERE userId = ? && articleId = ?`;

                connection.query(sqlDelete, values, 
                    function (error, result) {
                        if (error) {
                            return res.status(500).json({ error: "Erreur serveur !" });
                        }
                        res.status(200).json(result);
                    }
                );
            } else {
                sqlInsert = `INSERT INTO Likes VALUES (?, ?, DEFAULT, NOW())`;

                connection.query(sqlInsert, values, 
                    function (error, result) {
                        if (error) {
                            return res.status(500).json({ error: "Erreur serveur !" });
                        }
                        res.status(200).json(result);
                    }
                );
            }
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
        }
    );
};

//Middleware pour récupérer tous les commentaires d'un article
exports.getAllComments = (req, res, next) => {

    const articleId = req.params.id;

    let sql = `SELECT comments.commentId, comments.userId, comments.text, DATE_FORMAT(comments.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, users.userId, users.firstname, users.lastname, users.photoProfil FROM Comments LEFT JOIN Users ON comments.userId = users.userId WHERE comments.articleId = ?`;
    let values = [articleId];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            if (result.length == 0) {
                return res.status(400).json({ message: "Aucun commentaire à afficher !" });
            }
            res.status(200).json(result);
        }
    );
};

// Middleware pour créer un commentaire
exports.createComment = (req, res, next) => {

    const articleId = req.params.id;
    const userId = res.locals.userId;
    const text = req.body.text;

    let sql = `INSERT INTO Comments VALUES (NULL, ?, ?, ?, NOW())`;
    let values = [userId, articleId, text];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            res.status(201).json({ message: "Commentaire crée !" });
        }
    );
};

// Middleware pour supprimer un commentaire
exports.deleteComment = (req, res, next) => {

    const commentId = req.params.id;

    let sql = `DELETE FROM Comments WHERE commentId = ?`;
    let values = [commentId];

    connection.query(sql, values, 
        function (error, result) {
            if (error) {
                return res.status(500).json({ error: "Erreur serveur !" });
            }
            res.status(201).json({ message: "Commentaire supprimé !" });
        }
    );
};