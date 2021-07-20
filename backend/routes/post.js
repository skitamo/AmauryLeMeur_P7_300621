/* Importation des modules */
const express = require('express');

/* Création du router */
const router = express.Router();

/* Association aver le controller */
const postCtrl = require('../controllers/post');

/* Ajout des middlewares auth et multer */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* Création des différentes routes de l'API */
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.post("/:id", auth, postCtrl.deletePost);
router.post("/:id/like", auth, postCtrl.likePost);
router.post("/:id/dislike", auth, postCtrl.dislikePost);

router.get("/:id/comment", auth, postCtrl.getAllComments);
router.post("/:id/comment/create", auth, postCtrl.createComment);
router.get("/:id/comment/delete", auth, postCtrl.deleteComment);

/* Exportation du router */
module.exports = router;