const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const fichierController = require('../controllers/fichierController');
const authMiddleware = require('../config/middleware');


router.post('/ajout_fichier', authMiddleware, upload.array('fichiers'), fichierController.ajoutFichier);

router.get('/select_fichier/:num_courrier', authMiddleware, fichierController.selectFichierParNumCourrier);

router.delete('/supprimer_fichier/:num_courrier', authMiddleware, fichierController.supprimerFichiers);

router.get('/telechargement/:num_courrier', authMiddleware, fichierController.telechargerFichier);

module.exports = router;
