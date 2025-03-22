const mongoose = require('mongoose');

const moment = require('moment');

const currentDate = moment();
const formattedDate = currentDate.format('DD-MM-YYYY');

const notifSchema = new mongoose.Schema({
    email: {
        type: String,
        default: ""
    },
    contenue: {
        type: String,
        default: "",
    },
    statut: {
        type: Boolean,
        default: false,
    },
    photo:{
        type:String,
        default:"",
    },
    date_creation: {
        type: String,
        default: formattedDate,
    },
});

module.exports = mongoose.model('Notification', notifSchema);
