const { oracledb } = require('../config/oracle');

// GET /api/routes
const getRoutes = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Routes`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch routes' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

// POST /api/tickets
const bookTicket = async (req, res) => {
    let connection;
    try {
        const { passengerID, routeID, amount, paymentMethod } = req.body;
        connection = await oracledb.getConnection();
        
        // Example logic for inserting into Tickets and Payments. 
        // We will assume some simple auto-increment or sequence-based IDs.
        await connection.execute(`
            INSERT INTO Tickets (PassengerID, RouteID, Status) 
            VALUES (:passengerID, :routeID, 'BOOKED')
        `, { passengerID, routeID }, { autoCommit: false });

        // A better approach would be to get the ticket ID using RETURNING INTO, but assuming basic structure here.
        await connection.execute(`
            INSERT INTO Payments (PassengerID, Amount, PaymentMethod, Status) 
            VALUES (:passengerID, :amount, :paymentMethod, 'COMPLETED')
        `, { passengerID, amount, paymentMethod }, { autoCommit: true });

        res.status(201).json({ message: 'Ticket booked successfully' });
    } catch (err) {
        console.error(err);
        if (connection) {
            await connection.rollback();
        }
        res.status(500).json({ error: 'Failed to book ticket' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

// GET /api/reports/revenue
const getRevenue = async (req, res) => {
    let connection;
    try {
        const { startDate, endDate } = req.query;
        connection = await oracledb.getConnection();
        const result = await connection.execute(`
            BEGIN
                :ret := CalculateTotalRevenue(:startDate, :endDate);
            END;
        `, {
            startDate: startDate,
            endDate: endDate,
            ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        });
        res.json({ totalRevenue: result.outBinds.ret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to calculate revenue' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

// GET /api/reports/routes
const getFrequentRoutes = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`
            BEGIN
                GetFrequentRoutes(:cursor);
            END;
        `, {
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        });
        
        const resultSet = result.outBinds.cursor;
        const rows = [];
        let row;
        while ((row = await resultSet.getRow())) {
            rows.push(row);
        }
        await resultSet.close();

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch frequent routes' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

module.exports = {
    getRoutes,
    bookTicket,
    getRevenue,
    getFrequentRoutes
};
