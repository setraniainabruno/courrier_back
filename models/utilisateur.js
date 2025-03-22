const mongoose = require('mongoose');

const moment = require('moment');

const utilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pseudo: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    mdp: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        required: true
    },
    lieu: {
        type: String,
        default: ''
    },
    dateC: {
        type: String,
        default: () => moment().format('DD-MM-YYYY')
    }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
