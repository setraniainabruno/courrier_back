const transporter = require('../config/email_config');
const Email = require('../models/email');

exports.sendEmail = async (req, res) => {
    try {
        const { dest, objet, contenue } = req.body;

        const email = new Email(dest, objet, contenue);

        const mailOptions = {
            from: "driantsirabe@gmail.com",
            to: email.dest,
            subject: email.objet,
            text: email.contenue
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email envoyé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Échec de l\'envoi de l\'email', error });
        console.log('Échec de l\'envoi de l\'email', error);
    }
};
