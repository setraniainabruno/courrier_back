const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const authMiddleware = require('../config/middleware');

router.post('/ajout',authMiddleware, utilisateurController.ajouterUtilisateur);


router.get('/', authMiddleware, utilisateurController.getUtilisateurs);

router.post('/login', utilisateurController.selectUtilisateurParEmail);

router.get('/nombre', authMiddleware, utilisateurController.getNombreUtilisateurs);

router.get('/select_id/:id', authMiddleware, utilisateurController.selectUtilisateurParId);

router.put('/modification/:id', authMiddleware, utilisateurController.modifierUtilisateur);

router.put('/modification_email/:id', authMiddleware, utilisateurController.modifierEmailUtilisateur);

router.put('/modification_mdp/:id', authMiddleware, utilisateurController.modifierMdpUtilisateur);

router.delete('/supprimer/:id/:mdp', authMiddleware, utilisateurController.deleteUtilisateur);

router.delete('/supprimer_autre/:id', authMiddleware, utilisateurController.deleteAutreUtilisateur);



module.exports = router;
