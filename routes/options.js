import express from "express";
import pool from "../database.js"; // PostgreSQL-yhteys

const router = express.Router();

// Fetch all vehicle makers (brands)
router.get('/makers', async (req, res) => {
    try {
        const result = await pool.query("SELECT makeid, makename FROM makes ORDER BY makename ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching vehicle makers:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch models based on makeid
router.get('/models/:makeid', async (req, res) => {
    try {
        const { makeid } = req.params;
        const result = await pool.query("SELECT modelid, modelname FROM models WHERE makeid = $1 ORDER BY modelname ASC;", [makeid]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all vehicle types
router.get('/vehicletypes', async (req, res) => {
    try {
        const result = await pool.query("SELECT typeid, typename FROM vehicletypes ORDER BY typename ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching vehicle types:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all subtypes
router.get('/subtypes', async (req, res) => {
    try {
        const result = await pool.query("SELECT subtypeid, name FROM subtypes ORDER BY name ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching subtypes:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all color shades
router.get('/colorshades', async (req, res) => {
    try {
        const result = await pool.query("SELECT shadeid, shadename FROM colorshades;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching color shades:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all colors
router.get('/colors', async (req, res) => {
    try {
        const result = await pool.query("SELECT colorid, name FROM colors ORDER BY name ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching colors:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all drive types
router.get('/drivetype', async (req, res) => {
    try {
        const result = await pool.query("SELECT drivetypeid, name FROM drivetypes;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching drive types:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all fuel types
router.get('/fueltype', async (req, res) => {
    try {
        const result = await pool.query("SELECT fueltypeid, name FROM fueltypes;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching fuel type:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all transmissions
router.get('/transmission', async (req, res) => {
    try {
        const result = await pool.query("SELECT transmissionid, name FROM transmissions;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching transmission:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all features
router.get('/features', async (req, res) => {
    try {
        const result = await pool.query("SELECT featureid, name, category FROM features;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching features:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all car technical details
router.get('/cartechnicaldetails', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                carid, 
                mileage,
                enginecapacity,
                power,
                torque,
                topspeed,
                acceleration,
                co2emissions,
                fuelconsumptioncity,
                fuelconsumptionhighway,
                fuelconsumptioncombined,
                massempty,
                masstotal,
                towcapacitybraked,
                towcapacityunbraked,
                seatingcapacity,
                doorcount,
                steeringside,
                fueltypeid,
                drivetypeid,
                transmissionid
            FROM cartechnicaldetails
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching car technical details:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all countries
router.get('/countries', async (req, res) => {
    try {
        const result = await pool.query("SELECT countryid, name FROM countries;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching countries:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all regions
router.get('/regions', async (req, res) => {
    try {
        const result = await pool.query("SELECT regionid, countryid, name FROM regions;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching regions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all cities
router.get('/cities', async (req, res) => {
    try {
        const result = await pool.query("SELECT cityid, regionid, name FROM cities;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Search endpoint
router.get('/search', async (req, res) => {
    try {
        const { make, model, type, year, color, minprice, maxprice } = req.query;

        let query = `
            SELECT 
                c.carid, c.year, c.price, c.description, c.registrationnumber, c.vin,
                m.makename, mo.modelname, vt.typename, col.name AS colorname, cs.shadename
            FROM cars c
            LEFT JOIN makes m ON c.makeid = m.makeid
            LEFT JOIN models mo ON c.modelid = mo.modelid
            LEFT JOIN vehicletypes vt ON c.typeid = vt.typeid
            LEFT JOIN colors col ON c.colorid = col.colorid
            LEFT JOIN colorshades cs ON c.shadeid = cs.shadeid
            WHERE 1=1
        `;
        const queryParams = [];

        if (make) query += ` AND m.makename = $${queryParams.push(make)}`;
        if (model) query += ` AND mo.modelname = $${queryParams.push(model)}`;
        if (type) query += ` AND vt.typename = $${queryParams.push(type)}`;
        if (year) query += ` AND c.year = $${queryParams.push(year)}`;
        if (color) query += ` AND col.name = $${queryParams.push(color)}`;
        if (minprice) query += ` AND c.price >= $${queryParams.push(minprice)}`;
        if (maxprice) query += ` AND c.price <= $${queryParams.push(maxprice)}`;

        const result = await pool.query(query, queryParams);

        res.json(result.rows);
    } catch (err) {
        console.error("Error in search query:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
