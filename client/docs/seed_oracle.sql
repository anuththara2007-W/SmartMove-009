-- =================================================================
-- SMARTMOVE - ORACLE DATABASE SEED SCRIPT (SRI LANKAN SAMPLE DATA)
-- 10 Rows Per Table (Core, Reference & Transactional Tables)
-- =================================================================

SET DEFINE OFF;

-- Step 1: Automatic Cleanup of Existing Records (Foreign-key safe order)
-- Ensures the script can be executed multiple times without duplicate key (ORA-00001) errors:
DELETE FROM Payments;
DELETE FROM Tickets;
DELETE FROM Maintenance;
DELETE FROM Trips;
DELETE FROM Vehicles;
DELETE FROM Drivers;
DELETE FROM Routes;
DELETE FROM Passengers;
COMMIT;

-- =================================================================
-- 1. PASSENGERS (10 Sri Lankan Registered Passengers)
-- =================================================================
INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (1, 'Kasun', 'Perera', 'kasun.perera@gmail.com', '0771234567', TO_DATE('2026-01-15', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (2, 'Dilani', 'Jayasinghe', 'dilani.j@yahoo.com', '0712345678', TO_DATE('2026-01-20', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (3, 'Roshan', 'Silva', 'roshan.silva@outlook.com', '0763456789', TO_DATE('2026-02-02', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (4, 'Anoma', 'Fernando', 'anoma.fernando@gmail.com', '0784567890', TO_DATE('2026-02-14', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (5, 'Chaminda', 'Bandara', 'chaminda.b@gmail.com', '0705678901', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (6, 'Niluka', 'Dissanayake', 'niluka.diss@yahoo.com', '0726789012', TO_DATE('2026-03-05', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (7, 'Dinesh', 'Senanayake', 'dinesh.sena@gmail.com', '0757890123', TO_DATE('2026-03-12', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (8, 'Sanduni', 'Wickramasinghe', 'sanduni.w@gmail.com', '0778901234', TO_DATE('2026-03-18', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (9, 'Nuwan', 'Gunawardena', 'nuwan.guna@hotmail.com', '0719012345', TO_DATE('2026-03-25', 'YYYY-MM-DD'));

INSERT INTO Passengers (PassengerID, FirstName, LastName, Email, Phone, RegisteredDate) 
VALUES (10, 'Tharushi', 'Rajapaksha', 'tharushi.raj@gmail.com', '0760123456', TO_DATE('2026-04-01', 'YYYY-MM-DD'));

-- =================================================================
-- 2. DRIVERS (10 Sri Lankan Licensed Professional Drivers)
-- =================================================================
INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (1, 'Sunil', 'Fernando', 'LIC-WP-89101', '0772233445', TO_DATE('2021-03-15', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (2, 'Bandula', 'Warnapura', 'LIC-SP-11223', '0713344556', TO_DATE('2020-07-20', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (3, 'Ranjan', 'Ramanayake', 'LIC-CP-33445', '0764455667', TO_DATE('2022-01-10', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (4, 'Kamal', 'Gunaratne', 'LIC-WP-55667', '0785566778', TO_DATE('2019-11-05', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (5, 'Gamini', 'Fonseka', 'LIC-NW-77889', '0706677889', TO_DATE('2021-09-18', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (6, 'Sanath', 'Jayasuriya', 'LIC-SP-99001', '0727788990', TO_DATE('2018-05-12', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (7, 'Aravinda', 'De Silva', 'LIC-WP-22334', '0758899001', TO_DATE('2020-02-28', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (8, 'Mahela', 'Jayawardene', 'LIC-CP-44556', '0779900112', TO_DATE('2021-11-14', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (9, 'Kumar', 'Sangakkara', 'LIC-CP-66778', '0710011223', TO_DATE('2022-04-01', 'YYYY-MM-DD'), 'Active');

INSERT INTO Drivers (DriverID, FirstName, LastName, LicenseNumber, Phone, HireDate, Status) 
VALUES (10, 'Lasith', 'Malinga', 'LIC-SP-88990', '0761122334', TO_DATE('2023-01-15', 'YYYY-MM-DD'), 'Active');

-- =================================================================
-- 3. VEHICLES (10 Vehicles with Diverse Types: Bus, Van, Car)
-- =================================================================
INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (1, 'WP NA-1024', 'Bus', 45, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (2, 'SP ND-4589', 'Van', 14, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (3, 'WP NC-7731', 'Car', 4, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (4, 'CP PB-2315', 'Bus', 52, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (5, 'WP ND-9021', 'Van', 12, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (6, 'NW NB-6642', 'Car', 4, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (7, 'SG PC-3388', 'Bus', 40, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (8, 'WP NA-8890', 'Van', 15, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (9, 'SP NC-5421', 'Car', 4, 'Active');

INSERT INTO Vehicles (VehicleID, RegNumber, VehicleType, Capacity, Status) 
VALUES (10, 'WP NE-1290', 'Bus', 48, 'Active');

-- =================================================================
-- 4. ROUTES (10 Major Sri Lankan Intercity Routes)
-- =================================================================
INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (1, 'Colombo', 'Kandy', 115.50, '3.5 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (2, 'Colombo', 'Galle', 126.00, '2.0 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (3, 'Kandy', 'Nuwara Eliya', 76.80, '2.5 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (4, 'Colombo', 'Jaffna', 395.00, '7.5 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (5, 'Galle', 'Matara', 44.20, '1.0 Hour');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (6, 'Colombo', 'Negombo', 38.00, '1.0 Hour');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (7, 'Kandy', 'Dambulla', 72.50, '2.2 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (8, 'Colombo', 'Trincomalee', 260.00, '5.5 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (9, 'Matara', 'Hambantota', 78.00, '1.5 Hours');

INSERT INTO Routes (RouteID, StartLocation, EndLocation, DistanceKm, EstimatedDuration) 
VALUES (10, 'Colombo', 'Ratnapura', 86.00, '2.2 Hours');

-- =================================================================
-- 5. MAINTENANCE (10 Realistic Vehicle Servicing Records)
-- =================================================================
INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (1, 1, 'Full engine oil and filter change', 25000.00, TO_DATE('2026-02-10', 'YYYY-MM-DD'), TO_DATE('2026-05-10', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (2, 2, 'Front and rear brake pad replacement', 18500.00, TO_DATE('2026-02-15', 'YYYY-MM-DD'), TO_DATE('2026-06-15', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (3, 3, 'Hybrid system health check and inverter cooling', 32000.00, TO_DATE('2026-02-20', 'YYYY-MM-DD'), TO_DATE('2026-08-20', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (4, 4, 'Air suspension inspection and calibration', 45000.00, TO_DATE('2026-02-25', 'YYYY-MM-DD'), TO_DATE('2026-05-25', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (5, 5, 'Dual AC condenser cleaning and refrigerant refill', 16000.00, TO_DATE('2026-03-01', 'YYYY-MM-DD'), TO_DATE('2026-09-01', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (6, 6, '4-wheel alignment and tire rotation', 8500.00, TO_DATE('2026-03-05', 'YYYY-MM-DD'), TO_DATE('2026-06-05', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (7, 7, 'Transmission fluid flush and diagnostics', 28000.00, TO_DATE('2026-03-10', 'YYYY-MM-DD'), TO_DATE('2026-07-10', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (8, 8, 'Battery replacement and alternator check', 35000.00, TO_DATE('2026-03-15', 'YYYY-MM-DD'), TO_DATE('2026-09-15', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (9, 9, 'Standard 10,000km periodic service', 14500.00, TO_DATE('2026-03-20', 'YYYY-MM-DD'), TO_DATE('2026-07-20', 'YYYY-MM-DD'));

INSERT INTO Maintenance (MaintenanceID, VehicleID, Description, Cost, MaintenanceDate, NextDueDate) 
VALUES (10, 10, 'Full chassis wash and underbody anti-rust coating', 22000.00, TO_DATE('2026-03-25', 'YYYY-MM-DD'), TO_DATE('2026-09-25', 'YYYY-MM-DD'));

-- =================================================================
-- 6. TRIPS (10 Trips: Completed, In Progress, Scheduled, Cancelled)
-- =================================================================
INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (1, 1, 1, 1, TO_TIMESTAMP('2026-03-20 06:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-20 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (2, 2, 2, 2, TO_TIMESTAMP('2026-03-21 07:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-21 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (3, 3, 3, 3, TO_TIMESTAMP('2026-03-22 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-22 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (4, 4, 4, 4, TO_TIMESTAMP('2026-03-23 05:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-23 12:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (5, 5, 5, 5, TO_TIMESTAMP('2026-03-24 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-24 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (6, 6, 6, 6, TO_TIMESTAMP('2026-03-25 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-03-25 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Cancelled');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (7, 7, 7, 7, TO_TIMESTAMP('2026-04-10 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-04-10 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Completed');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (8, 8, 8, 8, TO_TIMESTAMP('2026-10-15 06:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-15 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Scheduled');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (9, 9, 9, 9, TO_TIMESTAMP('2026-10-16 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-16 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Scheduled');

INSERT INTO Trips (TripID, RouteID, VehicleID, DriverID, DepartureDateTime, ArrivalDateTime, TripStatus) 
VALUES (10, 10, 10, 10, TO_TIMESTAMP('2026-10-17 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-10-17 17:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'Scheduled');

-- =================================================================
-- 7. TICKETS (10 Issued Travel Tickets)
-- =================================================================
INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (1, 1, 1, 'A1', TO_DATE('2026-03-18', 'YYYY-MM-DD'), 1200.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (2, 2, 2, 'B3', TO_DATE('2026-03-19', 'YYYY-MM-DD'), 1500.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (3, 3, 3, 'C2', TO_DATE('2026-03-20', 'YYYY-MM-DD'), 1800.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (4, 4, 4, 'A4', TO_DATE('2026-03-21', 'YYYY-MM-DD'), 3500.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (5, 5, 5, 'D1', TO_DATE('2026-03-22', 'YYYY-MM-DD'), 600.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (6, 6, 6, 'B2', TO_DATE('2026-03-23', 'YYYY-MM-DD'), 500.00, 'Cancelled');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (7, 7, 7, 'C5', TO_DATE('2026-04-05', 'YYYY-MM-DD'), 1400.00, 'Completed');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (8, 8, 8, 'A2', TO_DATE('2026-10-10', 'YYYY-MM-DD'), 2800.00, 'Booked');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (9, 9, 9, 'B1', TO_DATE('2026-10-10', 'YYYY-MM-DD'), 950.00, 'Booked');

INSERT INTO Tickets (TicketID, TripID, PassengerID, SeatNumber, BookingDate, FareAmount, TicketStatus) 
VALUES (10, 10, 10, 'A3', TO_DATE('2026-10-11', 'YYYY-MM-DD'), 1100.00, 'Booked');

-- =================================================================
-- 8. PAYMENTS (10 Processed Payments Across Methods)
-- =================================================================
INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (1, 1, 1200.00, TO_DATE('2026-03-18', 'YYYY-MM-DD'), 'Card', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (2, 2, 1500.00, TO_DATE('2026-03-19', 'YYYY-MM-DD'), 'Card', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (3, 3, 1800.00, TO_DATE('2026-03-20', 'YYYY-MM-DD'), 'Cash', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (4, 4, 3500.00, TO_DATE('2026-03-21', 'YYYY-MM-DD'), 'Bank Transfer', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (5, 5, 600.00, TO_DATE('2026-03-22', 'YYYY-MM-DD'), 'Cash', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (6, 6, 500.00, TO_DATE('2026-03-23', 'YYYY-MM-DD'), 'Card', 'Refunded');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (7, 7, 1400.00, TO_DATE('2026-04-05', 'YYYY-MM-DD'), 'Card', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (8, 8, 2800.00, TO_DATE('2026-10-10', 'YYYY-MM-DD'), 'Card', 'Completed');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (9, 9, 950.00, TO_DATE('2026-10-10', 'YYYY-MM-DD'), 'Cash', 'Pending');

INSERT INTO Payments (PaymentID, TicketID, Amount, PaymentDate, Method, PaymentStatus) 
VALUES (10, 10, 1100.00, TO_DATE('2026-10-11', 'YYYY-MM-DD'), 'Card', 'Completed');

COMMIT;
