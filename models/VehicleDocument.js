const mongoose = require('mongoose');

const vehicleDocumentSchema = new mongoose.Schema({
    vehicleID: {
        type: Number,
        required: true,
        index: true
    },
    imageUrls: [{
        type: String
    }],
    pdfDocumentPaths: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('VehicleDocument', vehicleDocumentSchema);
