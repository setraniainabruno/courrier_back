const express = require('express');
const cors = require('cors');
const http = require('http');


const connecterDB = require('./config/db');
const { Server } = require('socket.io');

const utilisateurRoutes = require('./routes/utilisateurRoute');
const courrierRoutes = require('./routes/courrierRoute');
const fichierRoutes = require('./routes/fichierRoute');
const emailRoutes = require('./routes/emailRoute');
const notificationRoutes = require('./routes/notificationRoute');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors({
    origin: 'http://localhost:3725',
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:'http://localhost:3725',
        credentials:true,
        methods:["GET","POST"]
    }
});
app.io = io;

connecterDB();

app.use('/api/utilisateurs', utilisateurRoutes);

app.use('/api/courriers', courrierRoutes);

app.use('/api/fichiers', fichierRoutes);

app.use('/api/email', emailRoutes);

app.use('/api/notifications', notificationRoutes);



const PORT = 3723;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
