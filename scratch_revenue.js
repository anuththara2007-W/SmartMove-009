require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT text FROM all_source WHERE name = 'CALCULATETOTALREVENUE' ORDER BY line");
    res.rows.forEach(r => console.log(r[0]));
    await c.close();
    process.exit(0);
}
run().catch(console.error);
