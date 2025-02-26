import express from "express";
import pool from "../database.js";

const router = express.Router();

// ✅ POST - Add new car technical details
router.post("/", async (req, res) => {
    const {
        carid, mileage, enginecapacity, power, torque, topspeed, acceleration,
        co2emissions, fuelconsumptioncity, fuelconsumptionhighway, fuelconsumptioncombined,
        massempty, masstotal, towcapacitybraked, towcapacityunbraked, seatingcapacity,
        doorcount, steeringside, fueltypeid, drivetypeid, transmissionid
    } = req.body;

    if (!carid || mileage === undefined || enginecapacity === undefined || power === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        await pool.query(
            `INSERT INTO cartechnicaldetails 
                (carid, mileage, enginecapacity, power, torque, topspeed, acceleration, 
                co2emissions, fuelconsumptioncity, fuelconsumptionhighway, fuelconsumptioncombined, 
                massempty, masstotal, towcapacitybraked, towcapacityunbraked, seatingcapacity, 
                doorcount, steeringside, fueltypeid, drivetypeid, transmissionid) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 
                $10, $11, $12, $13, $14, $15, 
                $16, $17, $18, $19, $20)`,
            [
                carid, mileage, enginecapacity, power, torque, topspeed, acceleration,
                co2emissions, fuelconsumptioncity, fuelconsumptionhighway, fuelconsumptioncombined,
                massempty, masstotal, towcapacitybraked, towcapacityunbraked, seatingcapacity,
                doorcount, steeringside, fueltypeid, drivetypeid, transmissionid
            ]
        );

        res.status(201).json({ message: "Car technical details added successfully" });
    } catch (error) {
        console.error("Error inserting car technical details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ✅ GET - Retrieve all car technical details
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM cartechnicaldetails`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching car technical details:", err);
        res.status(500).send("Server error");
    }
});

export default router;
