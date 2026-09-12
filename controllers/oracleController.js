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
        const { passengerID, routeID, tripID: providedTripID, amount, paymentMethod, seatNumber } = req.body;
        connection = await oracledb.getConnection();

        let tripID = providedTripID;
        let fare = amount || 15.00;

        // Find the most recent Trip for this route if no tripID is provided
        if (!tripID && routeID) {
            try {
                const tripRes = await connection.execute(
                    `SELECT TripID, NVL(BaseFare, 15) AS BASEFARE FROM (SELECT TripID, BaseFare FROM Trips WHERE RouteID = :routeID ORDER BY TripID DESC) WHERE ROWNUM = 1`,
                    { routeID },
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                if (tripRes.rows.length > 0) {
                    tripID = tripRes.rows[0].TRIPID;
                    if (tripRes.rows[0].BASEFARE) {
                        fare = tripRes.rows[0].BASEFARE;
                    }
                } else {
                    tripID = routeID; // fallback if no trip found
                }
            } catch (e) { 
                tripID = routeID; // fallback on error
            }
        } else if (tripID) {
            // Fetch trip's BaseFare if explicitly provided
            try {
                const fareRes = await connection.execute(
                    `SELECT NVL(BaseFare, 15) AS BASEFARE FROM Trips WHERE TripID = :tripID`,
                    { tripID },
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                if (fareRes.rows.length > 0 && fareRes.rows[0].BASEFARE) {
                    fare = fareRes.rows[0].BASEFARE;
                }
            } catch (e) { /* use default fare */ }
        } else {
            tripID = routeID || 1;
        }

        const assignedSeat = seatNumber || '1A';

        // Map payment method to valid ENUM values ('Card', 'Cash', 'Bank Transfer')
        const validMethod = ['Card', 'Cash', 'Bank Transfer'].includes(paymentMethod) ? paymentMethod : 'Card';

        const result = await connection.execute(`
            INSERT INTO Tickets (TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
            VALUES (:tripID, :passengerID, :assignedSeat, SYSDATE, :fare, 'Booked')
            RETURNING TicketID INTO :outTicketID
        `, { 
            tripID, 
            passengerID, 
            assignedSeat,
            fare,
            outTicketID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }, { autoCommit: false });

        const ticketID = result.outBinds.outTicketID[0];

        await connection.execute(`
            INSERT INTO Payments (TicketID, Amount, PaymentDate, Method, PaymentStatus) 
            VALUES (:ticketID, :fare, SYSDATE, :validMethod, 'Completed')
        `, { ticketID, fare, validMethod }, { autoCommit: true });

        res.status(201).json({ message: 'Ticket booked successfully', fare });
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
                :ret := CalculateTotalRevenue(TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD'));
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
            SELECT r.RouteID AS ROUTEID, 
                   (r.StartLocation || ' to ' || r.EndLocation) AS ROUTENAME, 
                   COUNT(DISTINCT t.TripID) AS TRIPCOUNT,
                   r.DistanceKm AS DISTANCEKM,
                   r.EstimatedDuration AS ESTIMATEDDURATION
            FROM Routes r
            LEFT JOIN Trips t ON r.RouteID = t.RouteID
            GROUP BY r.RouteID, r.StartLocation, r.EndLocation, r.DistanceKm, r.EstimatedDuration
            ORDER BY TRIPCOUNT DESC, r.RouteID ASC
        `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        res.json(result.rows);
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

// --- Payments CRUD ---
const getPayments = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Payments ORDER BY PAYMENTID DESC`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payments' });
    } finally {
        if (connection) await connection.close();
    }
};

const createPayment = async (req, res) => {
    let connection;
    try {
        const { ticketID, method, amount } = req.body;
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO Payments (TICKETID, PAYMENTMETHOD, AMOUNT, PAYMENTDATE) VALUES (:ticketID, :method, :amount, SYSDATE)`,
            { ticketID, method, amount },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Payment created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment' });
    } finally {
        if (connection) await connection.close();
    }
};

const updatePayment = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { method, amount } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `UPDATE Payments SET PAYMENTMETHOD = :method, AMOUNT = :amount WHERE PAYMENTID = :id`,
            { method, amount, id },
            { autoCommit: true }
        );
        res.json({ message: 'Payment updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update payment' });
    } finally {
        if (connection) await connection.close();
    }
};

const deletePayment = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await oracledb.getConnection();
        await connection.execute(`DELETE FROM Payments WHERE PAYMENTID = :id`, { id }, { autoCommit: true });
        res.json({ message: 'Payment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete payment' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- DRIVERS CRUD ---
const getDrivers = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Drivers ORDER BY DriverID DESC`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    } finally {
        if (connection) await connection.close();
    }
};

const createDriver = async (req, res) => {
    let connection;
    try {
        const { firstName, lastName, licenseNumber, phone, hireDate, status } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `INSERT INTO Drivers (FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
             VALUES (:firstName, :lastName, :licenseNumber, :phone, TO_DATE(:hireDate, 'YYYY-MM-DD'), :status)`,
            { firstName, lastName, licenseNumber, phone, hireDate, status },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Driver created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create driver' });
    } finally {
        if (connection) await connection.close();
    }
};

const updateDriver = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { firstName, lastName, licenseNumber, phone, hireDate, status } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `UPDATE Drivers SET FirstName = :firstName, LastName = :lastName, LicenseNumber = :licenseNumber, 
             Phone = :phone, HireDate = TO_DATE(:hireDate, 'YYYY-MM-DD'), Status = :status WHERE DriverID = :id`,
            { firstName, lastName, licenseNumber, phone, hireDate, status, id },
            { autoCommit: true }
        );
        res.json({ message: 'Driver updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update driver' });
    } finally {
        if (connection) await connection.close();
    }
};

const deleteDriver = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await oracledb.getConnection();
        await connection.execute(`DELETE FROM Drivers WHERE DriverID = :id`, { id }, { autoCommit: true });
        res.json({ message: 'Driver deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete driver (May be referenced by trips)' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- PASSENGERS CRUD ---
const getPassengers = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Passengers ORDER BY PassengerID DESC`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch passengers' });
    } finally {
        if (connection) await connection.close();
    }
};

const createPassenger = async (req, res) => {
    let connection;
    try {
        const { firstName, lastName, email, phone } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `INSERT INTO Passengers (FirstName, LastName, Email, Phone, RegisteredDate) 
             VALUES (:firstName, :lastName, :email, :phone, SYSDATE)`,
            { firstName, lastName, email, phone },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Passenger created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create passenger' });
    } finally {
        if (connection) await connection.close();
    }
};

const updatePassenger = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `UPDATE Passengers SET FirstName = :firstName, LastName = :lastName, Email = :email, Phone = :phone WHERE PassengerID = :id`,
            { firstName, lastName, email, phone, id },
            { autoCommit: true }
        );
        res.json({ message: 'Passenger updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update passenger' });
    } finally {
        if (connection) await connection.close();
    }
};

const deletePassenger = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await oracledb.getConnection();
        await connection.execute(`DELETE FROM Passengers WHERE PassengerID = :id`, { id }, { autoCommit: true });
        res.json({ message: 'Passenger deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete passenger' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- ROUTES CRUD (CREATE, UPDATE, DELETE) ---
const createRoute = async (req, res) => {
    let connection;
    try {
        const { startLocation, endLocation, distanceKm, estimatedDuration } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `INSERT INTO Routes (StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
             VALUES (:startLocation, :endLocation, :distanceKm, :estimatedDuration)`,
            { startLocation, endLocation, distanceKm, estimatedDuration },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Route created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create route' });
    } finally {
        if (connection) await connection.close();
    }
};

const updateRoute = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { startLocation, endLocation, distanceKm, estimatedDuration } = req.body;
        connection = await oracledb.getConnection();
        await connection.execute(
            `UPDATE Routes SET StartLocation = :startLocation, EndLocation = :endLocation, DistanceKm = :distanceKm, EstimatedDuration = :estimatedDuration WHERE RouteID = :id`,
            { startLocation, endLocation, distanceKm, estimatedDuration, id },
            { autoCommit: true }
        );
        res.json({ message: 'Route updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update route' });
    } finally {
        if (connection) await connection.close();
    }
};

const deleteRoute = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await oracledb.getConnection();
        await connection.execute(`DELETE FROM Routes WHERE RouteID = :id`, { id }, { autoCommit: true });
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete route' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- VEHICLES READ ---
const getVehicles = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(`SELECT * FROM Vehicles ORDER BY VehicleID DESC`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- TRIPS CRUD ---
const getTrips = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        // Join with Routes, Vehicles, Drivers to get meaningful info
        const query = `
            SELECT t.TripID, t.RouteID, t.VehicleID, t.DriverID, 
                   t.DepartureDateTime, t.ArrivalDateTime, t.TripStatus, t.BaseFare,
                   r.StartLocation, r.EndLocation,
                   v.RegNumber, v.VehicleType, v.Capacity,
                   d.FirstName as DriverFirstName, d.LastName as DriverLastName
            FROM Trips t
            JOIN Routes r ON t.RouteID = r.RouteID
            JOIN Vehicles v ON t.VehicleID = v.VehicleID
            JOIN Drivers d ON t.DriverID = d.DriverID
            ORDER BY t.DepartureDateTime DESC
        `;
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trips' });
    } finally {
        if (connection) await connection.close();
    }
};

const createTrip = async (req, res) => {
    let connection;
    try {
        const { routeID, vehicleID, driverID, departureDateTime, arrivalDateTime, tripStatus, baseFare } = req.body;
        connection = await oracledb.getConnection();
        
        // Ensure baseFare has a default value if not provided
        const fare = baseFare || 15.00;
        
        // Simple conflict check: 
        // 1. Is driver already assigned to a trip that overlaps?
        // 2. Is vehicle already assigned?
        // (For simplicity in this coursework, we might just trust the frontend, but the prompt says:
        // "Prefer backend validation because concurrency means frontend-only checks are insufficient.")
        
        const conflictQuery = `
            SELECT TripID FROM Trips 
            WHERE (DriverID = :driverID OR VehicleID = :vehicleID)
            AND TripStatus NOT IN ('Completed', 'Cancelled')
            AND (
                (TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI') BETWEEN DepartureDateTime AND ArrivalDateTime) OR
                (TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI') BETWEEN DepartureDateTime AND ArrivalDateTime) OR
                (DepartureDateTime BETWEEN TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI') AND TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI'))
            )
        `;
        const conflicts = await connection.execute(conflictQuery, { driverID, vehicleID, departureDateTime, arrivalDateTime }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (conflicts.rows.length > 0) {
            return res.status(409).json({ error: 'Scheduling conflict: Driver or Vehicle is already booked during this time.' });
        }

        await connection.execute(
            `INSERT INTO Trips (RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus, BaseFare) 
             VALUES (:routeID, :vehicleID, :driverID, TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI'), TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI'), :tripStatus, :fare)`,
            { routeID, vehicleID, driverID, departureDateTime, arrivalDateTime, tripStatus, fare },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Trip created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create trip' });
    } finally {
        if (connection) await connection.close();
    }
};

const updateTrip = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { routeID, vehicleID, driverID, departureDateTime, arrivalDateTime, tripStatus, baseFare } = req.body;
        connection = await oracledb.getConnection();
        
        const fare = baseFare || 15.00;
        
        // Similar conflict check, excluding the current trip ID
        const conflictQuery = `
            SELECT TripID FROM Trips 
            WHERE (DriverID = :driverID OR VehicleID = :vehicleID)
            AND TripID != :id
            AND TripStatus NOT IN ('Completed', 'Cancelled')
            AND (
                (TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI') BETWEEN DepartureDateTime AND ArrivalDateTime) OR
                (TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI') BETWEEN DepartureDateTime AND ArrivalDateTime) OR
                (DepartureDateTime BETWEEN TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI') AND TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI'))
            )
        `;
        const conflicts = await connection.execute(conflictQuery, { driverID, vehicleID, id, departureDateTime, arrivalDateTime }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (conflicts.rows.length > 0) {
            return res.status(409).json({ error: 'Scheduling conflict: Driver or Vehicle is already booked during this time.' });
        }

        await connection.execute(
            `UPDATE Trips SET RouteID = :routeID, VehicleID = :vehicleID, DriverID = :driverID, 
             DepartureDateTime = TO_TIMESTAMP(:departureDateTime, 'YYYY-MM-DD"T"HH24:MI'), 
             ArrivalDateTime = TO_TIMESTAMP(:arrivalDateTime, 'YYYY-MM-DD"T"HH24:MI'), 
             TripStatus = :tripStatus, BaseFare = :fare 
             WHERE TripID = :id`,
            { routeID, vehicleID, driverID, departureDateTime, arrivalDateTime, tripStatus, fare, id },
            { autoCommit: true }
        );
        res.json({ message: 'Trip updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update trip' });
    } finally {
        if (connection) await connection.close();
    }
};

const deleteTrip = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await oracledb.getConnection();
        await connection.execute(`DELETE FROM Trips WHERE TripID = :id`, { id }, { autoCommit: true });
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete trip (Tickets might be associated)' });
    } finally {
        if (connection) await connection.close();
    }
};

// --- TICKETS READ ---
const getTickets = async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        // Join Tickets with Trips and Passengers
        const query = `
            SELECT tk.TicketID, tk.TripID, tk.PassengerID, tk.SeatNumber, tk.FareAmount, tk.TicketStatus,
                   p.FirstName, p.LastName,
                   t.DepartureDateTime,
                   r.StartLocation, r.EndLocation
            FROM Tickets tk
            JOIN Passengers p ON tk.PassengerID = p.PassengerID
            JOIN Trips t ON tk.TripID = t.TripID
            JOIN Routes r ON t.RouteID = r.RouteID
            ORDER BY tk.TicketID DESC
        `;
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    bookTicket,
    getRevenue,
    getFrequentRoutes,
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    getPassengers,
    createPassenger,
    updatePassenger,
    deletePassenger,
    getVehicles,
    getTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTickets
};
