require('dotenv').config();
const { initializeOracle, oracledb } = require('./config/oracle');
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    let res = await c.execute("SELECT argument_name, data_type, in_out FROM all_arguments WHERE object_name = 'GETFREQUENTROUTES'");
    console.log('GETFREQUENTROUTES args:', res.rows);
    await c.close();
    process.exit(0);
}
run().catch(console.error);
