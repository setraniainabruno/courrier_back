const Fichier = require('../models/fichier');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');




exports.ajoutFichier = async (req, res) => {
    try {
        const { num_courrier } = req.body;
        if (!num_courrier) {
            return res.status(400).json({ message: 'Le numéro de courrier est requis' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Aucun fichier sélectionné' });
        }

        const tempDirectory = path.join(__dirname, '../public/fichiers');
        if (!fs.existsSync(tempDirectory)) {
            fs.mkdirSync(tempDirectory, { recursive: true });
        }

        const zipFileName = `Fichier_${num_courrier}.zip`;
        const zipFilePath = path.join(tempDirectory, zipFileName);

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        req.files.forEach((file) => {
            archive.file(file.path, { name: file.originalname });
        });

        await archive.finalize();

        output.on('close', async () => {
            try {
                req.files.forEach((file) => {
                    fs.unlinkSync(file.path);
                });

                const fichierInfo = {
                    nom_fichier: zipFileName,
                    extension: '.zip',
                    num_courrier,
                    path: zipFilePath,
                };

                await Fichier.create(fichierInfo);

                res.status(200).json({
                    message: 'Fichiers compressés et uploadés avec succès',
                    file: fichierInfo,
                });
            } catch (error) {
                console.error("Erreur lors de la suppression des fichiers:", error);
                res.status(500).json({ message: "Erreur lors de la suppression des fichiers", error });
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'upload des fichiers:", error);
        res.status(500).json({ message: "Erreur lors de l'upload", error });
    }
};


exports.selectFichierParNumCourrier = async (req, res) => {
    const num_courrier = req.params.num_courrier;

    try {
        const files = await Fichier.find({ num_courrier: num_courrier });

        if (files.length === 0) {
            return res.status(404).json({ message: 'Aucun fichier trouvé pour ce numéro de courrier' });
        }

        res.status(200).json(files);
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.supprimerFichiers = async (req, res) => {
    const num_courrier = req.params.num_courrier;

    try {
        const fichiersSupprimes = await Fichier.find({ num_courrier: num_courrier });
        const result = await Fichier.deleteMany({ num_courrier: num_courrier });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Aucun fichier trouvé à supprimer' });
        }

        await Promise.all(fichiersSupprimes.map(async (fichier) => {
            const filePath = path.join(__dirname, `../public/fichiers/${fichier.nom_fichier}`);
            try {
                await fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`Fichier ${filePath} supprimé avec succès.`);
                });
            } catch (err) {
                console.error(`Erreur lors de la suppression du fichier ${filePath}:`, err);
            }
        }));
        res.status(200).json({ message: `${result.deletedCount} fichiers supprimés avec succès` });
        console.log(`${result.deletedCount} fichiers supprimés avec succès`);


    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression des fichiers', error: err });
    }
};




exports.telechargerFichier = (req, res) => {
    const fileName = `Fichier_${req.params.num_courrier}.zip`;
    const directoryPath = path.join(__dirname, '../public/fichiers');

    const filePath = path.join(directoryPath, fileName);
    res.download(filePath, (err) => {
        if (err) {
            return res.status(404).send({ message: 'Fichier non trouvé.' });
        }
    });
};



