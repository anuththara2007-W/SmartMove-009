require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT column_name FROM user_tab_columns WHERE table_name = 'TICKETS'");
    console.log('TICKETS:', res.rows);
    res = await c.execute("SELECT column_name FROM user_tab_columns WHERE table_name = 'PAYMENTS'");
    console.log('PAYMENTS:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
