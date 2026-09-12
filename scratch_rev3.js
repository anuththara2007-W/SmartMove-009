require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT * FROM Trips", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('Trips:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
