const express = require('express');
const router = express.Router();
const oracleController = require('../controllers/oracleController');
const mongoController = require('../controllers/mongoController');

// --- Oracle Endpoints ---
router.get('/routes', oracleController.getRoutes);
router.post('/tickets', oracleController.bookTicket);
router.get('/reports/revenue', oracleController.getRevenue);
router.get('/reports/routes', oracleController.getFrequentRoutes);

// --- MongoDB Endpoints ---
router.post('/reviews', mongoController.submitReview);
router.get('/reviews/route/:id', mongoController.getReviewsByRoute);
router.get('/vehicles/top-rated', mongoController.getTopRatedVehicles);
router.get('/reviews/search', mongoController.searchReviews);
router.get('/announcements', mongoController.getAnnouncements);
router.get('/vehicles/documents', mongoController.getVehicleDocuments);

module.exports = router;
