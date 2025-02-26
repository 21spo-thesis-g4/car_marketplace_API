import express from "express";
import pool from "../database.js";

const router = express.Router();

// Add a new car
router.post("/", async (req, res) => {
    const {
        typeid, makeid, modelid, year, colorid, shadeid,
        registrationnumber, vin, price, description,
        firstregistration, inspectiondate, numberofowners,
        userid, countryid, regionid, cityid, subtypeid,
        roadworthy, sold, lastupdated, views
    } = req.body;

    if (!typeid || !makeid || !modelid || !year || !colorid || !shadeid ||
        !registrationnumber || !vin || !price || !userid || !countryid ||
        !regionid || !cityid || !subtypeid || roadworthy === undefined) {
        return res.status(400).json({ message: "All required fields must be filled" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO cars 
                (typeid, makeid, modelid, year, colorid, shadeid, registrationnumber, vin, price, 
                 description, firstregistration, inspectiondate, numberofowners, userid, countryid, 
                 regionid, cityid, subtypeid, roadworthy, sold, lastupdated, views)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 
                 $10, $11, $12, $13, $14, $15, 
                 $16, $17, $18, $19, $20, $21, $22)
            RETURNING carid`,
            [typeid, makeid, modelid, year, colorid, shadeid, registrationnumber, vin, price,
                description || null, firstregistration || null, inspectiondate || null, numberofowners || null, userid, countryid,
                regionid, cityid, subtypeid, roadworthy || false, sold || false, lastupdated || new Date(), views || 0]
        );

        res.status(201).json({ message: "Car added successfully", carid: result.rows[0].carid });
    } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Search cars
router.get("/search", async (req, res) => {
    try {
        const {
            typeid, subtypeid, makeid, modelid,
            minyear, maxyear, minmileage, maxmileage,
            minprice, maxprice
        } = req.query;

        let query = `
        SELECT cars.*, cartechnicaldetails.mileage
        FROM cars
        LEFT JOIN cartechnicaldetails ON cars.carid = cartechnicaldetails.carid
        WHERE 1=1
        `;
        const queryParams = [];

        if (typeid) query += ` AND cars.typeid = $${queryParams.push(typeid)}`;
        if (subtypeid) query += ` AND cars.subtypeid = $${queryParams.push(subtypeid)}`;
        if (makeid) query += ` AND cars.makeid = $${queryParams.push(makeid)}`;
        if (modelid) query += ` AND cars.modelid = $${queryParams.push(modelid)}`;
        if (minyear) query += ` AND cars.year >= $${queryParams.push(minyear)}`;
        if (maxyear) query += ` AND cars.year <= $${queryParams.push(maxyear)}`;
        if (minmileage) query += ` AND cartechnicaldetails.mileage >= $${queryParams.push(minmileage)}`;
        if (maxmileage) query += ` AND cartechnicaldetails.mileage <= $${queryParams.push(maxmileage)}`;
        if (minprice) query += ` AND cars.price >= $${queryParams.push(minprice)}`;
        if (maxprice) query += ` AND cars.price <= $${queryParams.push(maxprice)}`;

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error("Error searching cars:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// Get all cars
router.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cars');
        res.json(result.rows);
    } catch (error) {
        console.error("Error loading cars:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Get car by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM cars WHERE carid = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Car not found." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Delete a car by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const existingCar = await pool.query('SELECT * FROM cars WHERE carid = $1', [id]);

        if (existingCar.rows.length === 0) {
            return res.status(404).json({ message: "Car not found." });
        }

        await pool.query('DELETE FROM cars WHERE carid = $1', [id]);
        res.json({ message: "Car deleted successfully." });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;