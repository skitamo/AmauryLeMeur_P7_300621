// Importation des modules
const express = require('express');
const path = require('path');
const cors = require('cors');

// Importation des modules de sécurité
const helmet = require('helmet');

// Déclaration des routes
const articlesRoutes = require('./routes/articles');
const userRoutes = require('./routes/user');

// Création d'une application express
const app = express();

// Middleware Header pour éviter les erreurs CORS
app.use(cors());

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(express.urlencoded({ extended: true }));

// Module qui permet de protéger l'application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
app.use(helmet());

// Utilisation de bodyParser pour transforme les données arrivant de la requête POST en objet JSON
app.use(express.json());

// Midleware pour charger les fichiers qui sont dans le dossier 'images'
app.use('/images/', express.static(path.join(__dirname, 'images')));

// Middlewares pour transmettre les requêtes vers les routes correspondantes
app.use('/api/articles', articlesRoutes);
app.use('/api/user', userRoutes);

// Exportation de l'application
module.exports = app;