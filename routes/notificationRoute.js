const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');



router.get('/', notificationController.getNotifications);

router.post('/ajouter', notificationController.ajouterNotification);

router.delete('/supprimer/:id', notificationController.supprimerNotification);

router.delete('/supprimer_tout', notificationController.supprimerToutesLesNotifications);

router.get('/compter_non_lues', notificationController.compterNotificationsNonLues);

router.put('/marquer_comme_lues', notificationController.marquerToutesCommeLues);

module.exports = router;