require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT search_condition FROM user_constraints WHERE table_name = 'TICKETS' AND constraint_type = 'C'");
    console.log('TICKETS constraints:', res.rows);
    res = await c.execute("SELECT search_condition FROM user_constraints WHERE table_name = 'PAYMENTS' AND constraint_type = 'C'");
    console.log('PAYMENTS constraints:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
