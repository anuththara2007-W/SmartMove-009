const oracledb = require('oracledb');
require('dotenv').config();

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
        console.log('Successfully connected to Oracle Database!');
    } catch (err) {
        console.error('Oracle Connection Error:', err.message);
    }
}

module.exports = { initializeOracle, oracledb };
