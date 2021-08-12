// Importation des modules
const express = require('express');

//Création du router
const router = express.Router();

// Association avec le controller
const articlesCtrl = require('../controllers/articles');

// Ajout des middlewares auth et multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Création des différentes routes de l'API
router.get("/", auth, articlesCtrl.getAllArticles);
router.get("/:id", auth, articlesCtrl.getOneArticle);
router.post("/", auth, multer, articlesCtrl.createArticle);
router.post("/:id", auth, articlesCtrl.deleteArticle);
router.post("/:id/like", auth, articlesCtrl.likeArticle);

router.post("/:id/comments/create", auth, articlesCtrl.createComment);
router.get("/:id/comments", auth, articlesCtrl.getAllComments);
router.post("/:id/comments/delete", auth, articlesCtrl.deleteComment);


// Exportation du router
module.exports = router;