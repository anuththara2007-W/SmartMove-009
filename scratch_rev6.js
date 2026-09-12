
require("dotenv").config();
const { initializeOracle, oracledb } = require("./config/oracle");
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    
    try {
        let res = await c.execute("SELECT text FROM user_source WHERE name = 'CALCULATETOTALREVENUE' ORDER BY line");
        console.log("Function CalculateTotalRevenue:");
        res.rows.forEach(r => console.log(r[0]));
    } catch (e) {
        console.error("Error:", e.message);
    }

    await c.close();
    process.exit(0);
}
run().catch(console.error);

