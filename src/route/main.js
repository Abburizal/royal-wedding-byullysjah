const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { requireAuth, requireGuest, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// Home page
router.get('/', (req, res) => {
    res.render('pages/index');
});

// Test route
router.get('/test', (req, res) => {
    res.send('Test route working!');
});

// Handle contact form submission
router.post('/contact', mainController.handleContactForm);

// Handle inquiry form submission
router.post('/inquiry', mainController.handleInquiryForm);

// Authentication routes
router.get('/admin/login', authController.showLogin);
router.post('/admin/login', requireGuest, authController.login);
router.post('/admin/logout', authController.logout);
router.get('/admin/register', requireAuth, requireSuperAdmin, authController.showRegister);
router.post('/admin/register', requireAuth, requireSuperAdmin, authController.register);

// Protected Admin routes
router.get('/admin', requireAuth, requireAdmin, adminController.adminDashboard);
router.get('/admin/inquiries', requireAuth, requireAdmin, adminController.adminInquiries);
router.post('/admin/update-status', requireAuth, requireAdmin, adminController.updateContactStatus);
router.post('/admin/update-inquiry-status', requireAuth, requireAdmin, adminController.updateInquiryStatus);
router.get('/admin/contact/:id', requireAuth, requireAdmin, adminController.getContactDetails);
router.get('/admin/inquiry/:id', requireAuth, requireAdmin, adminController.getInquiryDetails);
router.delete('/admin/contact/:id', requireAuth, requireAdmin, adminController.deleteContact);
router.delete('/admin/inquiry/:id', requireAuth, requireAdmin, adminController.deleteInquiry);

module.exports = router;