const passwordSchema = require('../models/Password');

// On vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(500).json({ error: "Le mot de passe doit contenir au moins 6 caractères dont un chiffre" });
    } else {
        next();
    }
};