const Utilisateur = require('../models/utilisateur');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const cleSecret = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0!';

exports.ajouterUtilisateur = async (req, res) => {
    try {
        const { nom, prenom, email, pseudo = '', photo = '', mdp, role, lieu = '' } = req.body;

        if (!nom || !prenom || !email || !mdp || !role) {
            return res.status(400).json({ message: 'Veuillez fournir tous les champs obligatoires.' });
        }
        const { mdpUtil, correcte_mdp } = req.body;

        const estCorrecte = await bcrypt.compare(mdpUtil, correcte_mdp);
        if (!estCorrecte) {
            console.log('Mot de passe incorrect');
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const mdpCrypte = await bcrypt.hash(mdp, 10);
        const nouvelUtilisateur = new Utilisateur({
            nom,
            prenom,
            email,
            pseudo,
            photo,
            mdp: mdpCrypte,
            role,
            lieu
        });

        await nouvelUtilisateur.save();

        res.status(201).json({ message: 'Utilisateur ajouté avec succès', utilisateur: nouvelUtilisateur });
    } catch (erreur) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur', erreur });
    }
};


exports.getUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({});
        res.status(200).json(utilisateurs);
    } catch (erreur) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', erreur });
    }
};

exports.getNombreUtilisateurs = async (req, res) => {
    try {
        const nombreUtilisateurs = await Utilisateur.countDocuments();
        res.status(200).json({ total: nombreUtilisateurs });
    } catch (erreur) {
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre d\'utilisateurs', erreur });
    }
};

exports.selectUtilisateurParId = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await Utilisateur.findById(id);

        if (!user) {
            console.log('Aucun utilisateur trouvé pour cet ID');
            return res.status(404).json({ message: 'Aucun utilisateur trouvé pour cet ID' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};





exports.selectUtilisateurParEmail = async (req, res) => {
    const { email, mdp } = req.body;

    try {
        const user = await Utilisateur.findOne({ email: email });

        if (!user) {
            console.log('Aucun utilisateur trouvé pour ce e-mail');
            return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ce e-mail' });
        }
        const isMatch = await bcrypt.compare(mdp, user.mdp);
        if (!isMatch) {
            console.log('Mot de passe incorrect'+await bcrypt.hash(mdp, 10));
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const info = {
            _id: user._id,
            email: user.email,
            role: user.role,
            mdp: user.mdp
        };

        const token = jwt.sign(info, cleSecret, { expiresIn: '30d' });


        res.status(200).json({ token, user: { _id: user._id, email: user.email, role: user.role, mdp: user.mdp } });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.modifierUtilisateur = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, pseudo, lieu, mdp, correcte_mdp } = req.body;

    const estCorrecte = await bcrypt.compare(mdp, correcte_mdp);
    if (!estCorrecte) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    try {
        const utilisateurMisAJour = await Utilisateur.findByIdAndUpdate(
            id,
            { nom, prenom, pseudo, lieu },
            { new: true, runValidators: true }
        );

        if (!utilisateurMisAJour) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
            console.log('Utilisateur non trouvé');
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', utilisateur: utilisateurMisAJour });
        console.log('Utilisateur mis à jour avec succès', utilisateurMisAJour);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.modifierEmailUtilisateur = async (req, res) => {
    const { id } = req.params;
    const { email, mdp, correcte_mdp } = req.body;

    const estCorrecte = await bcrypt.compare(mdp, correcte_mdp);
    if (!estCorrecte) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    try {
        const utilisateurMisAJour = await Utilisateur.findByIdAndUpdate(
            id,
            { email },
            { new: true, runValidators: true }
        );

        if (!utilisateurMisAJour) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
            console.log('Utilisateur non trouvé');
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', utilisateur: utilisateurMisAJour });
        console.log('Utilisateur mis à jour avec succès', utilisateurMisAJour);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.modifierMdpUtilisateur = async (req, res) => {
    const { id } = req.params;
    const { mdp1, nouveau_mdp } = req.body;

    try {
        const utilisateur = await Utilisateur.findById(id);
        if (!utilisateur) {
            console.log('Utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const estCorrecte = await bcrypt.compare(mdp1, utilisateur.mdp);
        if (!estCorrecte) {
            console.log('Mot de passe incorrect');
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const mdpCrypte = await bcrypt.hash(nouveau_mdp, 10);

        utilisateur.mdp = mdpCrypte;
        await utilisateur.save();

        res.status(200).json({ message: 'Mot de passe modifié avec succès', utilisateur });
        console.log('Mot de passe modifié avec succès', utilisateur);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};



exports.deleteUtilisateur = async (req, res) => {
    const { id, mdp } = req.params;

    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
        console.log('Utilisateur non trouvé');
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (!mdp) {
        console.log('Mot de passe invalide');
        return res.status(401).json({ message: 'Mot de passe invalide' });
    }
    const estCorrecte = await bcrypt.compare(mdp, utilisateur.mdp);
    if (!estCorrecte) {
        console.log('Mot de passe incorrect');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du utilisateur', error: err });
    }
};

exports.deleteAutreUtilisateur = async (req, res) => {
    const { id } = req.params;
    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du utilisateur', error: err });
    }
};

