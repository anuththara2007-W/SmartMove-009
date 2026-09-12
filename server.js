const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Oracle Database Configuration
const oracleDbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONN_STRING
};

// Initialize Oracle Connection Pool
async function initializeOracle() {
    try {
        await oracledb.createPool({
            ...oracleDbConfig,
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 1
        });
        console.log('Successfully connected to Oracle Database (xe)!');
    } catch (err) {
        console.error('Oracle Connection Error:', err.message);
    }
}

// Basic API Route
app.get('/', (req, res) => {
    res.send('SmartMove API is running');
});

// Start Server
app.listen(port, async () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    await initializeOracle();
});