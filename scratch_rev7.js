
require("dotenv").config();
const { initializeOracle, oracledb } = require("./config/oracle");
async function run() {
    await initializeOracle();
    const c = await oracledb.getConnection();
    
    try {
        const sql = `
CREATE OR REPLACE FUNCTION CalculateTotalRevenue(p_StartDate IN DATE, p_EndDate IN DATE) 
RETURN NUMBER IS
    v_TotalRevenue NUMBER(10,2);
BEGIN
    SELECT NVL(SUM(BaseFare), 0) INTO v_TotalRevenue
    FROM Trips
    WHERE TripStatus = 'Completed' 
    AND DepartureDateTime BETWEEN p_StartDate AND p_EndDate;

    RETURN v_TotalRevenue;
EXCEPTION
    WHEN OTHERS THEN
        RETURN -1;
END;
`;
        await c.execute(sql);
        console.log("CalculateTotalRevenue function updated successfully.");
    } catch (e) {
        console.error("Error:", e.message);
    }

    await c.close();
    process.exit(0);
}
run().catch(console.error);

