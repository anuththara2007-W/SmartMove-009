require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT column_name FROM user_tab_columns WHERE table_name = 'PAYMENTS'");
    console.log('PAYMENTS cols:', res.rows);
    let res2 = await c.execute("SELECT * FROM Payments", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('PAYMENTS data:', JSON.stringify(res2.rows, null, 2));
    let res3 = await c.execute("SELECT * FROM Tickets", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('TICKETS data:', JSON.stringify(res3.rows, null, 2));
    await c.close();
    process.exit(0);
}
run().catch(console.error);
