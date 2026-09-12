require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("ALTER TABLE TRIPS ADD BaseFare NUMBER(10,2) DEFAULT 15.00");
    console.log('Altered TRIPS table');
    await c.close();
    process.exit(0);
}
run().catch(console.error);
