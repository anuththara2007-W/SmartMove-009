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
        required: false,
        default: 999
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual getters for frontend compatibility
reviewSchema.virtual('passengerId').get(function() {
    return this.passengerID;
});
reviewSchema.virtual('routeId').get(function() {
    return this.routeID;
});
reviewSchema.virtual('driverId').get(function() {
    return this.driverID;
});
reviewSchema.virtual('feedbackText').get(function() {
    return this.feedback;
});

// Text index for search functionality
reviewSchema.index({ feedback: 'text' });

module.exports = mongoose.model('Review', reviewSchema);
