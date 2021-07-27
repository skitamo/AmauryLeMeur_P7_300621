/* Importation des modules */
const multer = require('multer');

/* Création d'un disctionnaire des types MIME */
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/svg' : 'svg',
	'image/gif' : 'gif',
	'video/mp4' : 'mp4',
	'video/avi' : 'avi',
	'video/asf' : 'asf',
	'video/mkv' : 'mkv',
	'video/mpeg' : 'mpeg'
};

/* Création d'un objet de configuration pour multer */
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_').split('.')[0];
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	}
});

/* Exportation de multer */
module.exports = multer({storage: storage}).single('image');