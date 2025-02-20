import express from "express";
import sql from "mssql";
import { connectToDatabase } from "../database.js";

const router = express.Router();

// ✅ POST - Add new car technical details
router.post("/", async (req, res) => {
    const {
        CarID, Mileage, EngineCapacity, Power, Torque, TopSpeed, Acceleration,
        CO2Emissions, FuelConsumptionCity, FuelConsumptionHighway, FuelConsumptionCombined,
        MassEmpty, MassTotal, TowCapacityBraked, TowCapacityUnbraked, SeatingCapacity,
        DoorCount, SteeringSide, FuelTypeID, DriveTypeID, TransmissionID
    } = req.body;

    if (!CarID || Mileage === undefined || EngineCapacity === undefined || Power === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    

    try {
        const pool = await connectToDatabase();

        await pool.request()
            .input("CarID", sql.Int, CarID)
            .input("Mileage", sql.Int, Mileage)
            .input("EngineCapacity", sql.Int, EngineCapacity)
            .input("Power", sql.Int, Power)
            .input("Torque", sql.Int, Torque)
            .input("TopSpeed", sql.Int, TopSpeed)
            .input("Acceleration", sql.Float, Acceleration)
            .input("CO2Emissions", sql.Int, CO2Emissions)
            .input("FuelConsumptionCity", sql.Float, FuelConsumptionCity)
            .input("FuelConsumptionHighway", sql.Float, FuelConsumptionHighway)
            .input("FuelConsumptionCombined", sql.Float, FuelConsumptionCombined)
            .input("MassEmpty", sql.Int, MassEmpty)
            .input("MassTotal", sql.Int, MassTotal)
            .input("TowCapacityBraked", sql.Int, TowCapacityBraked)
            .input("TowCapacityUnbraked", sql.Int, TowCapacityUnbraked)
            .input("SeatingCapacity", sql.Int, SeatingCapacity)
            .input("DoorCount", sql.Int, DoorCount)
            .input("SteeringSide", sql.NVarChar, SteeringSide)
            .input("FuelTypeID", sql.Int, FuelTypeID)
            .input("DriveTypeID", sql.Int, DriveTypeID)
            .input("TransmissionID", sql.Int, TransmissionID)
            .query(`INSERT INTO CarTechnicalDetails 
                (CarID, Mileage, EngineCapacity, Power, Torque, TopSpeed, Acceleration, 
                CO2Emissions, FuelConsumptionCity, FuelConsumptionHighway, FuelConsumptionCombined, 
                MassEmpty, MassTotal, TowCapacityBraked, TowCapacityUnbraked, SeatingCapacity, 
                DoorCount, SteeringSide, FuelTypeID, DriveTypeID, TransmissionID) 
                VALUES 
                (@CarID, @Mileage, @EngineCapacity, @Power, @Torque, @TopSpeed, @Acceleration, 
                @CO2Emissions, @FuelConsumptionCity, @FuelConsumptionHighway, @FuelConsumptionCombined, 
                @MassEmpty, @MassTotal, @TowCapacityBraked, @TowCapacityUnbraked, @SeatingCapacity, 
                @DoorCount, @SteeringSide, @FuelTypeID, @DriveTypeID, @TransmissionID)`);

        res.status(201).json({ message: "Car technical details added successfully" });
    } catch (error) {
        console.error("Error inserting car technical details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ✅ GET - Retrieve all car technical details
router.get("/", async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query(`
            SELECT * FROM CarTechnicalDetails
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching car technical details:", err);
        res.status(500).send("Server error");
    }
});

export default router;
