const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    passengerID: {
        type: Number,
        required: true
    },
    routeID: {
        type: Number,
        required: true,
        index: true
    },
    driverID: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Text index for search functionality
reviewSchema.index({ feedback: 'text' });

module.exports = mongoose.model('Review', reviewSchema);
