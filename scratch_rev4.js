
require("dotenv").config();
const { initializeOracle, oracledb } = require("./config/oracle");
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    
    console.log("--- TICKETS ---");
    let t = await c.execute("SELECT * FROM Tickets", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(t.rows);

    console.log("--- PAYMENTS ---");
    let p = await c.execute("SELECT * FROM Payments", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(p.rows);

    console.log("--- ROUTES REPORT ---");
    try {
        let r = await c.execute("SELECT r.RouteID AS ROUTEID, (r.StartLocation || ' to ' || r.EndLocation) AS ROUTENAME, COUNT(tk.TicketID) AS TRIPCOUNT, r.DistanceKm AS DISTANCEKM, r.EstimatedDuration AS ESTIMATEDDURATION FROM Routes r LEFT JOIN Trips t ON r.RouteID = t.RouteID LEFT JOIN Tickets tk ON t.TripID = tk.TripID GROUP BY r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKm, r.EstimatedDuration ORDER BY TRIPCOUNT DESC, r.RouteID ASC", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        console.log(r.rows);
    } catch (e) {
        console.error("Error in routes report:", e.message);
    }

    await c.close();
    process.exit(0);
}
run().catch(console.error);

