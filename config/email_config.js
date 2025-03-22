const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.example.com",
    port: 465,
    secure: true,
    auth: {
        // user: 'hobysteeven@gmail.com ',
        // pass: 'qtlvhcgiydaskcrs'
        user: 'driantsirabe@gmail.com',
        pass: 'hwtqlwvdrnkzlsdm'
    }
});

module.exports = transporter;
