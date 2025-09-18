const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Home page
router.get('/', (req, res) => {
    res.render('pages/index');
});

// Handle contact form submission
router.post('/contact', mainController.handleContactForm);

module.exports = router;