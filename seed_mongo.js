require('dotenv').config();
const mongoose = require('mongoose');
const ResourceImage = require('./models/ResourceImage');
const VehicleDocument = require('./models/VehicleDocument');
const Review = require('./models/Review');
const Announcement = require('./models/Announcement');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartmove';

const routeImages = [
    {
        resourceType: 'route',
        resourceId: 1,
        caption: 'Colombo to Kandy - Express Highway & Lake View',
        imageUrl: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 2,
        caption: 'Colombo to Galle - Southern Coastal Expressway',
        imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 3,
        caption: 'Kandy to Nuwara Eliya - Misty Tea Country Mountain Pass',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 4,
        caption: 'Colombo to Jaffna - Northern Intercity Express Corridor',
        imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 5,
        caption: 'Galle to Matara - Scenic Southern Ocean Boulevard',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 6,
        caption: 'Colombo to Negombo - Lagoon Coastal Gateway',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 7,
        caption: 'Kandy to Dambulla - Cultural Triangle Scenic Highway',
        imageUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 8,
        caption: 'Colombo to Trincomalee - Eastern Coastline Express',
        imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 9,
        caption: 'Matara to Hambantota - Highway to Southern Port',
        imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'route',
        resourceId: 10,
        caption: 'Colombo to Ratnapura - Sabaragamuwa Foothills Route',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    }
];

const vehicleImages = [
    {
        resourceType: 'vehicle',
        resourceId: 1,
        caption: 'WP NA-1024 - 45-Seater Luxury Highway Express Coach',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 2,
        caption: 'SP ND-4589 - 14-Seater Air-Conditioned Commuter Van',
        imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 3,
        caption: 'WP NC-7731 - 4-Seater Premium Executive Hybrid Sedan',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 4,
        caption: 'CP PB-2315 - 52-Seater Long-Distance Intercity Cruiser',
        imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 5,
        caption: 'WP ND-9021 - 12-Seater VIP Executive Touring Van',
        imageUrl: 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 6,
        caption: 'NW NB-6642 - 4-Seater Eco City Transit Hybrid Car',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 7,
        caption: 'SG PC-3388 - 40-Seater Super-Luxury Climate Controlled Coach',
        imageUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 8,
        caption: 'WP NA-8890 - 15-Seater High-Roof Tourism Van',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 9,
        caption: 'SP NC-5421 - 4-Seater Southern Airport Chauffeur Sedan',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    },
    {
        resourceType: 'vehicle',
        resourceId: 10,
        caption: 'WP NE-1290 - 48-Seater Semi-Sleeper Double-Axle Highway Bus',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    }
];

const vehicleDocuments = [
    {
        vehicleID: 1,
        imageUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/WP-NA-1024-revenue-license.pdf', '/docs/fitness/WP-NA-1024-certificate.pdf']
    },
    {
        vehicleID: 2,
        imageUrls: ['https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/SP-ND-4589-revenue-license.pdf', '/docs/insurance/SP-ND-4589-comprehensive.pdf']
    },
    {
        vehicleID: 3,
        imageUrls: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/WP-NC-7731-revenue-license.pdf']
    },
    {
        vehicleID: 4,
        imageUrls: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/CP-PB-2315-revenue-license.pdf', '/docs/maintenance/CP-PB-2315-inspection.pdf']
    },
    {
        vehicleID: 5,
        imageUrls: ['https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/WP-ND-9021-revenue-license.pdf']
    },
    {
        vehicleID: 6,
        imageUrls: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/NW-NB-6642-revenue-license.pdf', '/docs/emission/NW-NB-6642-green-test.pdf']
    },
    {
        vehicleID: 7,
        imageUrls: ['https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/SG-PC-3388-revenue-license.pdf']
    },
    {
        vehicleID: 8,
        imageUrls: ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/WP-NA-8890-revenue-license.pdf', '/docs/insurance/WP-NA-8890-policy.pdf']
    },
    {
        vehicleID: 9,
        imageUrls: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/SP-NC-5421-revenue-license.pdf']
    },
    {
        vehicleID: 10,
        imageUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'],
        pdfDocumentPaths: ['/docs/licenses/WP-NE-1290-revenue-license.pdf', '/docs/fitness/WP-NE-1290-certificate.pdf']
    }
];

const reviews = [
    {
        passengerID: 1,
        routeID: 1,
        driverID: 1,
        rating: 5,
        feedback: 'Exceptionally smooth ride on the Kandy express! AC was comfortable and arrived 15 mins ahead of schedule.'
    },
    {
        passengerID: 2,
        routeID: 2,
        driverID: 2,
        rating: 5,
        feedback: 'The Southern Expressway service was top notch. Driver Bandula was very professional and courteous.'
    },
    {
        passengerID: 3,
        routeID: 3,
        driverID: 3,
        rating: 5,
        feedback: 'Scenic ride up the hill country to Nuwara Eliya. The vehicle took the mountain bends very smoothly.'
    },
    {
        passengerID: 4,
        routeID: 4,
        driverID: 4,
        rating: 4,
        feedback: 'Long distance trip to Jaffna was very pleasant with reclining seats and onboard USB charging ports.'
    },
    {
        passengerID: 5,
        routeID: 5,
        driverID: 5,
        rating: 5,
        feedback: 'Quick, reliable connection between Galle and Matara. Highly recommended for daily business commuters.'
    },
    {
        passengerID: 6,
        routeID: 6,
        driverID: 6,
        rating: 4,
        feedback: 'Good reliable ride to Negombo with prompt departure from Colombo terminal.'
    },
    {
        passengerID: 7,
        routeID: 7,
        driverID: 7,
        rating: 5,
        feedback: 'Great bus condition, super clean interior, and driver handled traffic around Kurunegala flawlessly.'
    },
    {
        passengerID: 8,
        routeID: 8,
        driverID: 8,
        rating: 5,
        feedback: 'Smooth overnight journey to Trincomalee. Very secure and comfortable for solo travelers.'
    },
    {
        passengerID: 9,
        routeID: 9,
        driverID: 9,
        rating: 4,
        feedback: 'Expressway link between Matara and Hambantota is fast and clean. Easy booking online.'
    },
    {
        passengerID: 10,
        routeID: 10,
        driverID: 10,
        rating: 5,
        feedback: 'Comfortable air-conditioned coach to Ratnapura. Luggage was handled carefully by the crew.'
    }
];

const announcements = [
    {
        title: 'Southern Expressway E01 Maintenance Advisory',
        message: 'Routine resurfacing scheduled between Dodangoda and Kurundugahahetekma interchanges from 10 PM to 4 AM. Expect minor delays.',
        type: 'warning',
        active: true
    },
    {
        title: 'Sinhala & Tamil New Year Special Express Fleet',
        message: 'Additional intercity express buses added for Colombo-Kandy and Colombo-Jaffna routes for holiday travelers. Advance booking open.',
        type: 'info',
        active: true
    },
    {
        title: 'Complimentary High-Speed WiFi on Luxury Coaches',
        message: 'All Colombo-Kandy and Colombo-Galle highway coaches now feature free 5G onboard WiFi for passengers.',
        type: 'info',
        active: true
    },
    {
        title: 'Weather Warning: Central Hills Rain Advisory',
        message: 'Heavy evening rainfall expected along the Kandy - Nuwara Eliya mountain route. Drivers briefed for reduced speeds.',
        type: 'warning',
        active: true
    },
    {
        title: 'Instant Online Card & Bank Transfer Payments Live',
        message: 'Book your tickets seamlessly with Visa, Mastercard, and Sri Lankan local bank direct transfers on our portal.',
        type: 'info',
        active: true
    },
    {
        title: 'Poson Full-Moon Pilgrimage Special Services',
        message: 'Direct luxury express services to Anuradhapura and Dambulla will operate around the clock during Poson week.',
        type: 'info',
        active: true
    },
    {
        title: 'Bandaranaike International Airport (BIA) Express Shuttle',
        message: 'New hourly express shuttles running directly between Colombo Fort Multimodal Center and Katunayake BIA Airport.',
        type: 'info',
        active: true
    },
    {
        title: 'Kandy Esala Perahera Festival Night Express',
        message: 'Night coach reservations are now open for the historic Kandy Esala Perahera season starting next month.',
        type: 'info',
        active: true
    },
    {
        title: 'Eco-Friendly Electric Hybrid Fleet Expansion',
        message: 'SmartMove welcomes 5 new eco-hybrid vehicles to reduce urban carbon emissions across short-haul routes.',
        type: 'info',
        active: true
    },
    {
        title: '24/7 SmartMove Passenger Care & Roadside Helpline',
        message: 'Need help with your travel or lost baggage? Contact our 24/7 customer care team via phone or system portal chat.',
        type: 'info',
        active: true
    }
];

async function seedMongo() {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');

        // 1. Seed Resource Images
        await ResourceImage.deleteMany({});
        const insertedImages = await ResourceImage.insertMany([...routeImages, ...vehicleImages]);
        console.log(`Inserted ${insertedImages.length} Resource Images (10 Routes + 10 Vehicles)`);

        // 2. Seed Vehicle Documents
        await VehicleDocument.deleteMany({});
        const insertedDocs = await VehicleDocument.insertMany(vehicleDocuments);
        console.log(`Inserted ${insertedDocs.length} Vehicle Documents`);

        // 3. Seed Reviews
        await Review.deleteMany({});
        const insertedReviews = await Review.insertMany(reviews);
        console.log(`Inserted ${insertedReviews.length} Sri Lankan Passenger Reviews`);

        // 4. Seed Announcements
        await Announcement.deleteMany({});
        const insertedAnnouncements = await Announcement.insertMany(announcements);
        console.log(`Inserted ${insertedAnnouncements.length} System Announcements`);

        console.log('\n>>> MONGODB SEEDING COMPLETED SUCCESSFULLY! <<<');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedMongo();
