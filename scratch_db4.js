require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT object_type FROM all_objects WHERE object_name = 'GETFREQUENTROUTES'");
    console.log('GETFREQUENTROUTES type:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
