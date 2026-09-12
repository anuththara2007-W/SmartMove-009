const mongoose = require('mongoose');

const resourceImageSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        enum: ['vehicle', 'route'],
        required: true,
        index: true
    },
    resourceId: {
        type: Number,
        required: true,
        index: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('ResourceImage', resourceImageSchema);
