const Review = require('../models/Review');
const VehicleDocument = require('../models/VehicleDocument');
const Announcement = require('../models/Announcement');

// POST /api/reviews
const submitReview = async (req, res) => {
    try {
        const { passengerID, routeID, driverID, rating, feedback } = req.body;
        const newReview = new Review({ passengerID, routeID, driverID, rating, feedback });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

// GET /api/reviews/route/:id
const getReviewsByRoute = async (req, res) => {
    try {
        const routeID = req.params.id;
        const reviews = await Review.find({ routeID }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// GET /api/vehicles/top-rated
const getTopRatedVehicles = async (req, res) => {
    try {
        // Aggregate reviews to find highest rated drivers (assuming driver is mapped to vehicle on frontend or another API)
        const topRated = await Review.aggregate([
            {
                $group: {
                    _id: '$driverID',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            },
            { $sort: { averageRating: -1, reviewCount: -1 } },
            { $limit: 10 }
        ]);
        res.json(topRated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to aggregate top rated vehicles' });
    }
};

// GET /api/reviews/search
const searchReviews = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const results = await Review.find({ $text: { $search: keyword } });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to search reviews' });
    }
};

// GET /api/announcements (Helper route for frontend dashboard)
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

// GET /api/vehicles/documents (Helper route for frontend dashboard)
const getVehicleDocuments = async (req, res) => {
    try {
        const documents = await VehicleDocument.find();
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vehicle documents' });
    }
};

module.exports = {
    submitReview,
    getReviewsByRoute,
    getTopRatedVehicles,
    searchReviews,
    getAnnouncements,
    getVehicleDocuments
};
