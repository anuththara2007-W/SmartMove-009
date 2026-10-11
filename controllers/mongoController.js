const Review = require('../models/Review');
const VehicleDocument = require('../models/VehicleDocument');
const Announcement = require('../models/Announcement');
const ResourceImage = require('../models/ResourceImage');

// POST /api/reviews
const submitReview = async (req, res) => {
    try {
        const pId = req.body.passengerID ?? req.body.passengerId;
        const rId = req.body.routeID ?? req.body.routeId;
        const dId = req.body.driverID ?? req.body.driverId ?? 999;
        const rating = Number(req.body.rating);
        const feedback = req.body.feedback ?? req.body.feedbackText;

        if (pId === undefined || rId === undefined || !feedback || isNaN(rating)) {
            return res.status(400).json({ error: 'Missing required review fields: passenger, route, rating, and feedback' });
        }

        const newReview = new Review({
            passengerID: Number(pId),
            routeID: Number(rId),
            driverID: Number(dId),
            rating: Number(rating),
            feedback: String(feedback).trim()
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error('Failed to submit review to MongoDB:', err);
        res.status(500).json({ error: err.message || 'Failed to submit review' });
    }
};

// GET /api/reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// GET /api/reviews/route/:id
const getReviewsByRoute = async (req, res) => {
    try {
        const routeId = Number(req.params.id);
        const reviews = await Review.find({ $or: [{ routeID: routeId }, { routeId: routeId }] }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// GET /api/vehicles/top-rated
const getTopRatedVehicles = async (req, res) => {
    try {
        const topRated = await Review.aggregate([
            {
                $group: {
                    _id: { $ifNull: ['$driverID', '$driverId'] },
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

const postVehicleDocument = async (req, res) => {
    try {
        const { vehicleID, imageUrl } = req.body;
        let doc = await VehicleDocument.findOne({ vehicleID });
        
        if (!doc) {
            doc = new VehicleDocument({ vehicleID, imageUrls: [], pdfDocumentPaths: [] });
        }
        if (imageUrl) {
            doc.imageUrls.push(imageUrl);
        }
        await doc.save();
        res.status(201).json({ message: 'Document added successfully', doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add vehicle document' });
    }
};

// POST /api/announcements
const postAnnouncement = async (req, res) => {
    try {
        const { title, type, message } = req.body;
        const newAnn = new Announcement({ title, type, message, active: true });
        await newAnn.save();
        res.status(201).json(newAnn);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to post announcement' });
    }
};

// --- Resource Images ---
// GET /api/images?type=vehicle&id=1
const getImages = async (req, res) => {
    try {
        const { type, id } = req.query;
        const query = {};
        if (type) query.resourceType = type;
        if (id !== undefined && id !== '') query.resourceId = parseInt(id, 10);
        const images = await ResourceImage.find(query).sort({ createdAt: -1 });
        res.json(images);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
};

// POST /api/images
const addImage = async (req, res) => {
    try {
        const { resourceType, resourceId, imageUrl, caption } = req.body;
        if (!resourceType || resourceId === undefined || resourceId === null || resourceId === '' || !imageUrl) {
            return res.status(400).json({ error: 'resourceType, resourceId and imageUrl are required' });
        }
        const img = new ResourceImage({ resourceType, resourceId: parseInt(resourceId, 10), imageUrl, caption: caption || '' });
        await img.save();
        res.status(201).json(img);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add image' });
    }
};

// DELETE /api/images/:id
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        await ResourceImage.findByIdAndDelete(id);
        res.json({ message: 'Image deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete image' });
    }
};

module.exports = {
    submitReview,
    getAllReviews,
    getReviewsByRoute,
    getTopRatedVehicles,
    searchReviews,
    getAnnouncements,
    getVehicleDocuments,
    postVehicleDocument,
    postAnnouncement,
    getImages,
    addImage,
    deleteImage
};
