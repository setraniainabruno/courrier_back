const Notification = require('../models/notification');

exports.ajouterNotification = async (req, res) => {
    try {
        const { email, contenue, photo } = req.body;

        const nouvelleNotification = new Notification({
            email,
            contenue,
            photo,
        });

        await nouvelleNotification.save();
        res.status(201).json({ message: 'Notification ajoutée avec succès', notification: nouvelleNotification });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la notification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();

        notifications.reverse();
        res.status(200).json({ message: 'Notifications récupérées avec succès', notifications });
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.supprimerNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notificationSupprimee = await Notification.findByIdAndDelete(id);
        if (!notificationSupprimee) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.supprimerToutesLesNotifications = async (req, res) => {
    try {
        const resultat = await Notification.deleteMany({});

        if (resultat.deletedCount === 0) {
            return res.status(404).json({ message: 'Aucune notification trouvée à supprimer' });
        }

        res.status(200).json({ message: 'Toutes les notifications ont été supprimées avec succès', resultat });
    } catch (error) {
        console.error('Erreur lors de la suppression des notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.compterNotificationsNonLues = async (req, res) => {
    try {
        const nombre = await Notification.countDocuments({ statut: false });

        res.status(200).json({ message: 'Nombre de notifications non lues', nombre });
    } catch (error) {
        console.error('Erreur lors du comptage des notifications non lues:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.marquerToutesCommeLues = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { statut: false },
            { $set: { statut: true } }
        );

        res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues', modifiées: result.nModified });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getNotificationsAvecCompte = async (req, res) => {
    try {
        const notifications = await Notification.find();
        notifications.reverse();

        const nombreNonLues = await Notification.countDocuments({ statut: false });

        req.app.io.emit("updateNotifications", { notifications, nombreNonLues });

        res.status(200).json({ 
            message: 'Notifications récupérées avec succès', 
            notifications,
            nombreNonLues 
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};