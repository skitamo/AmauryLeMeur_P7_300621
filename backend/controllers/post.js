/* Importation des modules */
const connection = require('../MySQLConnect').connection;
const fs = require('fs');

/* Middleware permettant d'afficher tous les posts de la base de données */
exports.getAllPosts = (req, res, next) => {

	const userId = res.locals.userId;

	let sql = `SELECT post.postId, post.userId, post.contentText, post.contentMediaUrl, DATE_FORMAT(post.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, user.firstName, user.lastName, user.profilePicture, COUNT(DISTINCT comment.commentId) AS numberOfComments, COUNT(DISTINCT like.userId) AS numberOfLikes, COUNT(DISTINCT dislike.userId) AS numberOfDislikes, COUNT(CASE WHEN likes.userId = ? THEN 1 ELSE null END) AS isLiked, COUNT(CASE WHEN dislike.userId = ? THEN 1 ELSE null END) AS isDisliked
		FROM Post
		LEFT JOIN Comment ON post.postId = comment.postId
		LEFT JOIN User ON post.userId = user.userId
		LEFT JOIN Like ON post.postId = like.postId 
		LEFT JOIN Dislike ON post.postId = dislike.postId GROUP BY post.postId ORDER BY post.dateCreation DESC`;

	let values = [userId];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length == 0) {
				return res.status(400).json({ error: "Aucun post à afficher !" });
			}
			res.status(200).json(result);
		}
	);
};

/* Middleware permettant d'afficher un post */
exports.getOnePost = (req, res, next) => {

	const postId = req.params.id;

	let sql = `SELECT post.postId, post.contentText, post.contentMediaUrl, DATE_FORMAT(post.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, user.firstName, user.lastName, user.profilePicture FROM Post LEFT JOIN User ON post.userId = user.userId WHERE post.postId = ?`;
	let values = [postId];

	connection.query(sql, values,
		function (err, result) {
			if (err) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			res.status(200).json(result);
		}
	);
};

/* Middleware permettant de publier un post */
exports.createPost = (req, res, next) => {

	const userId = res.locals.userId;
	const contentText = req.body.contentText;

	var sqlInsert;
	var values;

	const contentMediaUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

	sqlInsert = `INSERT INTO Post VALUES (NULL, ?, ?, ?, NOW())`;
	values = [userId, contentText, contentMediaUrl];

	connection.query(sqlInsert, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			res.status(200).json({ message: "Post créé !" });
		}
	);
};

/* Middleware permettant de supprimer un post */
exports.deletePost = (req, res, next) => {
	const postId = req.params.id;

	let sqlSelect;
	let sqlDelete;
	let values = [postId];

	sqlSelect = `SELECT contentMediaUrl FROM Post WHERE postId = ?`;
	connection.query(sqlSelect, values,
		function (error, result) {
			if (result.length > 0) {
				const filename = result[0].contentMediaUrl.split('/images/')[1];

				fs.unlink(`images/${filename}`, () => {

					sqlDelete = `DELETE FROM Post WHERE postId = ?`;
					connection.query(sqlDelete, values,
						function (error, result) {
							if (error) {
								return res.status(500).json({ error: "Erreur serveur !" });
							}
							res.status(200).json({ message: "Post supprimé !" });
						}
					);
				});
			} else {
				sqlDelete = `DELETE FROM Post WHERE postId = ?`;
				connection.query(sqlDelete, values,
					function (error, result) {
						if (error) {
							return res.status(500).json(error.message);
						}
						res.status(200).json({ message: "Post supprimé !" });
					}
				);
			}
			if (error) {
				return res.status(500).json(error.message);
			}
		}
	);
};

/* Middleware permettant de liker un post */
exports.likePost = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.id;

    let sqlCount;
    let sqlDelete;
    let sqlInsert;

    sqlCount = `SELECT COUNT(*) AS postId FROM Like WHERE userId = ? && postId = ?`;
    let values = [userId, postId];

    connection.query(sqlCount, values, 
        function (error, result) {
            if (result[0].likeId > 0) {
                sqlDelete = `DELETE FROM Like WHERE userId = ? && postId = ?`;

                connection.query(sqlDelete, values, 
                    function (error, result) {
                        if (error) {
                            return res.status(500).json({ error: "Erreur serveur !" });
                        }
                        res.status(200).json(result);
                    }
                );
            } else {
                sqlInsert = `INSERT INTO Like VALUES (?, ?, DEFAULT, NOW())`;

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

/* Middleware permettant de disliker un post */
exports.dislikePost = (req, res, next) => {
    const userId = res.locals.userId;
    const postId = req.params.id;

    let sqlCount;
    let sqlDelete;
    let sqlInsert;

    sqlCount = `SELECT COUNT(*) AS dislikeId FROM Dislike WHERE userId = ? && postId = ?`;
    let values = [userId, postId];

    connection.query(sqlCount, values, 
        function (error, result) {
            if (result[0].likeId > 0) {
                sqlDelete = `DELETE FROM Dislike WHERE userId = ? && postId = ?`;

                connection.query(sqlDelete, values, 
                    function (error, result) {
                        if (error) {
                            return res.status(500).json({ error: "Erreur serveur !" });
                        }
                        res.status(200).json(result);
                    }
                );
            } else {
                sqlInsert = `INSERT INTO Dislike VALUES (?, ?, DEFAULT, NOW())`;

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

/* Middleware permettant de récupérer tous les commentaires d'un post */
exports.getAllComments = (req, res, next) => {

	const postId = req.params.id;

	let sql = `SELECT comment.commentId, comment.userId, comment.contentText, DATE_FORMAT(comment.dateCreation, '%e %M %Y à %kh%i') AS dateCreation, user.userId, user.firstName, user.lastName, user.profilePicture FROM Comment LEFT JOIN User ON comment.userId = user.userId WHERE comment.postId = ?`;
	let values = [postId];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			if (result.length == 0) {
				return res.status(400).json({ message: "Aucun commentaire publié !" });
			}
			res.status(200).json(result);
		}
	);
};

/* Middleware permettant de publier un commentaire */
exports.createComment = (req, res, next) => {

	const postId = req.params.id;
	const userId = req.locals.userId;
	const contentText = req.body.contentText;

	let sql = `INSERT INTO Comment VALUES (NULL, ?, ?, ?, NOW())`;
	let values = [userId, postId, contentText];

	connection.query(sql, values,
		function (error, result) {
			if (error) {
				return res.status(500).json({ error: "Erreur serveur !" });
			}
			res.status(201).json({ message: "Commentaire publié !" });
		}
	);
};

/* Middleware permettant de supprimer un commentaire */
exports.deleteComment = (req, res, next) => {

	const commentId = req.params.id;

	let sql = `DELETE FROM Comment WHERE commentId = ?`;
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