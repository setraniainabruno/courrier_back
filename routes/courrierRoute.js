const express = require('express');
const router = express.Router();
const courrierController = require('../controllers/courrierController');
const authMiddleware = require('../config/middleware');



router.get('/', authMiddleware, courrierController.getCourriers);

router.post('/ajout', authMiddleware, courrierController.ajouterCourrier);

router.get('/max_num_courrier', authMiddleware, courrierController.getMaxNumCourrier);

router.delete('/supprimer/:id', authMiddleware, courrierController.deleteCourrier);

router.put('/modifier/:id', authMiddleware, courrierController.updateCourrier);


router.post('/select_entre_dates', authMiddleware, courrierController.selectCourrierEntreDates);

router.get('/mois_recent', authMiddleware, courrierController.getCourriersDernierMois);

router.get('/nombre', authMiddleware, courrierController.getNombreTotalCourriers);

router.get('/nombre_mois_recent', authMiddleware, courrierController.getNombreCourriersMoisRecent);

router.get('/regroupes_par_date', authMiddleware, courrierController.getCourriersRegroupesParDate);

router.get('/recherche/:cle', authMiddleware, courrierController.rechercherCourrier);

router.get('/recherche', authMiddleware, courrierController.getCourriers);

router.get('/export_bd/:id/:mdp', authMiddleware, courrierController.exportCourriersToCSV);

module.exports = router;
