const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.example.com",
    port: 465,
    secure: true,
    auth: {
        // user: 'hobysteeven@gmail.com ',
        // pass: 'qtlvhcgiydaskcrs'
        user: 'brunoharison18@gmail.com',
        pass: 'jkunamshwujrvwfv'
    }
});

module.exports = transporter;
