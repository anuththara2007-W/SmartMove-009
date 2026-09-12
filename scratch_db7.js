require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT column_name FROM user_tab_columns WHERE table_name = 'TRIPS'");
    console.log('TRIPS columns:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
