const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../config/middleware');

router.post('/envoie_email',authMiddleware, emailController.sendEmail);

module.exports = router;
