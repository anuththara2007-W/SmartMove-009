
require("dotenv").config();
const { initializeOracle, oracledb } = require("./config/oracle");
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    
    try {
        const tripRes = await c.execute(
            `SELECT TripID, NVL(BaseFare, 15) AS BASEFARE FROM (SELECT TripID, BaseFare FROM Trips WHERE RouteID = :routeID ORDER BY TripID DESC) WHERE ROWNUM = 1`,
            { routeID: 1 },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        console.log("Success:", tripRes.rows);
    } catch (e) {
        console.error("Error:", e.message);
    }

    await c.close();
    process.exit(0);
}
run().catch(console.error);

