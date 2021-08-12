const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
.is().min(6)                                    // Doit avoir au moins 6 caractères
.has().digits()                                 // Doit avoir au moins un chiffre

module.exports = passwordSchema;