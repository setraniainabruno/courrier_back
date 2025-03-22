const mongoose = require('mongoose');

const moment = require('moment');

const currentDate = moment();
const formattedDate = currentDate.format('DD-MM-YYYY');


const courrierSchema = new mongoose.Schema({
    num_courrier: {
        type: Number,
        required: true
    },
    nom_exp: {
        type: String,
        required: true
    },
    motif_courrier: {
        type: String,
        required: true
    },
    date_courrier: {
        type: Date,
        default: formattedDate
    },
    email_exp: {
        type: String,
        default: ''
    },
    nom_dest: {
        type: String,
        default: ''
    },

});

const Courrier = mongoose.model('Courrier', courrierSchema);

module.exports = Courrier;
