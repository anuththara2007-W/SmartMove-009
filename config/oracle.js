//Import the oracleDB Node.js driver.
const oracledb = require('oracledb');
//Import envirinmnt varibles form .env file
require('dotenv').config();

const oracleDbConfig = {
    user: process.env.ORACLE_USER || 'system',
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONN_STRING || 'localhost:1521/XE' //default listner port.
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
