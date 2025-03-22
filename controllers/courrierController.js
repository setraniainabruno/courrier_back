const Courrier = require('../models/courrier');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const { Parser } = require('json2csv');

const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur');


exports.ajouterCourrier = async (req, res) => {
    try {
        const { num_courrier, nom_exp, motif_courrier, date_courrier = '', email_exp = '---', nom_dest = '---' } = req.body;

        if (!num_courrier || !nom_exp || !motif_courrier || !date_courrier) {
            console.log('Veuillez fournir tous les champs obligatoires.');
            return res.status(400).json({ message: 'Veuillez fournir tous les champs obligatoires.' });
        }

        const dateCourrier = moment.tz(date_courrier, 'DD-MM-YYYY', 'GMT+3').toDate();

        console.log(dateCourrier)
        const nouvelCourrier = new Courrier({
            num_courrier,
            nom_exp,
            motif_courrier,
            date_courrier: dateCourrier,
            email_exp,
            nom_dest
        });

        await nouvelCourrier.save();

        console.log('Courrier ajouté avec succès', nouvelCourrier);
        res.status(201).json({ message: 'Courrier ajouté avec succès', courrier: nouvelCourrier });
    } catch (erreur) {
        console.log('Erreur lors de l\'ajout du courrier', erreur);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du courrier', erreur });
    }
};


exports.getCourriers = async (req, res) => {
    try {
        const courriers = await Courrier.find({});
        res.status(200).json(courriers);
    } catch (erreur) {
        res.status(500).json({ message: 'Erreur lors de la récupération des courriers', erreur });
    }
};

exports.getMaxNumCourrier = async (req, res) => {
    try {
        const maxNumCourrier = await Courrier.aggregate([
            { $group: { _id: null, maxNum: { $max: "$num_courrier" } } }
        ]);

        if (maxNumCourrier.length > 0) {
            res.status(200).json({ maxNumCourrier: maxNumCourrier[0].maxNum });
        } else {
            res.status(404).json({ message: 'Aucun courrier trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du maximum', erreur });
    }
};


exports.deleteCourrier = async (req, res) => {
    try {
        const courrier = await Courrier.findByIdAndDelete(req.params.id);
        if (!courrier) {
            return res.status(404).json({ message: 'Courrier non trouvé' });
        }
        res.status(200).json({ message: 'Courrier supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du courrier', error: err });
    }
};


exports.updateCourrier = async (req, res) => {
    try {
        const updatedCourrier = await Courrier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCourrier) {
            return res.status(404).json({ message: 'Courrier non trouvé' });
        }

        res.status(200).json({ message: 'Courrier mis à jour avec succès', data: updatedCourrier });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err });
    }
};





exports.selectCourrierEntreDates = async (req, res) => {
    const { date_debut, date_fin } = req.body;


    try {
        const courriers = await Courrier.find({
            date_courrier: {
                $gte: new Date(moment(date_debut, 'DD-MM-YYYY').startOf('day').toISOString()),
                $lte: new Date(moment(date_fin, 'DD-MM-YYYY').startOf('day').toISOString())
            }
        });

        if (courriers.length === 0) {
            return res.status(404).json({ message: 'Aucun courrier trouvé entre ces dates' });
        }

        res.status(200).json(courriers);
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};



exports.getCourriersDernierMois = async (req, res) => {
    try {
        const debutDuMoisDernier = moment().startOf('month').toDate();
        const finDuMoisDernier = moment().endOf('month').toDate();

        const courriers = await Courrier.find({
            date_courrier: {
                $gte: debutDuMoisDernier,
                $lte: finDuMoisDernier
            }
        });

        res.status(200).json(courriers);
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.getNombreTotalCourriers = async (req, res) => {
    try {
        const count = await Courrier.countDocuments();

        res.status(200).json({ total: count });
    } catch (error) {
        console.error('Erreur lors du comptage des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getNombreCourriersMoisRecent = async (req, res) => {
    try {
        const debutDuMoisRecent = moment().startOf('month').toDate();
        const finDuMoisRecent = moment().endOf('month').toDate();

        const nombreCourriers = await Courrier.countDocuments({
            date_courrier: {
                $gte: debutDuMoisRecent,
                $lte: finDuMoisRecent
            }
        });

        res.status(200).json({ total: nombreCourriers });
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getCourriersRegroupesParDate = async (req, res) => {
    try {
        const courriers = await Courrier.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_courrier" } },
                    count: { $sum: 1 },
                    courriers: { $push: "$$ROOT" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(courriers);
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers regroupés par date:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.rechercherCourrier = async (req, res) => {
    const { cle } = req.params;

    try {
        if (!cle || cle.trim() === "") {
            const courriers = await Courrier.find();
            return res.status(200).json(courriers);
        }

        const isNumber = !isNaN(cle);

        const query = {
            $or: [
                { nom_exp: { $regex: `^${cle}`, $options: 'i' } },
                { motif_courrier: { $regex: `^${cle}`, $options: 'i' } },
                { email_exp: { $regex: `^${cle}`, $options: 'i' } },
                { nom_dest: { $regex: `^${cle}`, $options: 'i' } }
            ]
        };

        if (isNumber) {
            query.$or.push({ num_courrier: parseInt(cle) });
        }

        const courriers = await Courrier.find(query);

        res.status(200).json(courriers);
    } catch (error) {
        console.error('Erreur lors de la recherche des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// EXPORT BD

exports.exportCourriersToCSV = async (req, res) => {


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
        const courriers = await Courrier.find({});

        const formattedCourriers = courriers.map(courrier => ({
            _id: courrier._id,
            num_courrier: courrier.num_courrier,
            nom_exp: courrier.nom_exp,
            motif_courrier: courrier.motif_courrier,
            date_courrier: courrier.date_courrier,
            email_exp: courrier.email_exp,
            nom_dest: courrier.nom_dest,
            __v: courrier.__v
        }));
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formattedCourriers);

        res.header('Content-Type', 'text/csv');
        res.attachment('courriers.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'exportation des courriers', error });
    }
};



