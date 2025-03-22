const mongoose = require('mongoose');

const moment = require('moment');

const fileSchema = new mongoose.Schema({
    num_courrier:{
        type:Number,
        required:true
    },
    nom_fichier: {
        type: String,
        required: true,
    },
    extension: {
        type: String,
        required: true,
    },
    date_creation: {
        type: String,
        default:  () => moment().format('DD-MM-YYYY') 
    },
});

module.exports = mongoose.model('Fichier', fileSchema);
