const mongoose = require('mongoose');

// const url = 'mongodb://localhost:27017/gestion_courrier';
const url = "mongodb+srv://brunoharison18:xE2NGihtznNYH9Hv@cluster0.cufza.mongodb.net/gestion_courrier?retryWrites=true&w=majority&appName=Cluster0";


const connecterDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connecté à MongoDB avec Mongoose');
    } catch (erreur) {
        console.error('Erreur lors de la connexion à MongoDB', erreur);
        process.exit(1); 
    }
};

module.exports = connecterDB;
