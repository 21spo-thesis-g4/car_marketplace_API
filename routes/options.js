import express from "express";
import pool from "../database.js"; // PostgreSQL-yhteys

const router = express.Router();

// Fetch all vehicle makers (brands)
router.get('/makers', async (req, res) => {
    try {
        const result = await pool.query("SELECT MakeID, MakeName FROM Makes ORDER BY MakeName ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching vehicle makers:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch models based on MakeID
router.get('/models/:makeID', async (req, res) => {
    try {
        const { makeID } = req.params;
        const result = await pool.query("SELECT ModelID, ModelName FROM Models WHERE MakeID = $1 ORDER BY ModelName ASC;", [makeID]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all vehicle types
router.get('/vehicletypes', async (req, res) => {
    try {
        const result = await pool.query("SELECT TypeID, TypeName FROM VehicleTypes ORDER BY TypeName ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching vehicle types:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all subtypes
router.get('/subtypes', async (req, res) => {
    try {
        const result = await pool.query("SELECT SubTypeID, Name FROM SubTypes ORDER BY Name ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching subtypes:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all color shades
router.get('/colorShades', async (req, res) => {
    try {
        const result = await pool.query("SELECT ShadeID, ShadeName FROM ColorShades;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Color Shades:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all colors
router.get('/colors', async (req, res) => {
    try {
        const result = await pool.query("SELECT ColorID, Name FROM Colors ORDER BY Name ASC;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Colors:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all drive types
router.get('/driveType', async (req, res) => {
    try {
        const result = await pool.query("SELECT DriveTypeID, Name FROM DriveTypes;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Drive Types:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all fuel types
router.get('/fuelType', async (req, res) => {
    try {
        const result = await pool.query("SELECT FuelTypeID, Name FROM FuelTypes;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Fuel Type:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all transmissions
router.get('/transmission', async (req, res) => {
    try {
        const result = await pool.query("SELECT TransmissionID, Name FROM Transmissions;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Transmission:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all features
router.get('/features', async (req, res) => {
    try {
        const result = await pool.query("SELECT FeatureID, Name, Category FROM Features;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Features:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all car technical details
router.get('/carTechnicalDetails', async (req, res) => {
    try {
        const query = `
            SELECT 
                CarID, 
                Mileage,
                EngineCapacity,
                Power,
                Torque,
                TopSpeed,
                Acceleration,
                CO2Emissions,
                FuelConsumptionCity,
                FuelConsumptionHighway,
                FuelConsumptionCombined,
                MassEmpty,
                MassTotal,
                TowCapacityBraked,
                TowCapacityUnbraked,
                SeatingCapacity,
                DoorCount,
                SteeringSide,
                FuelTypeID,
                DriveTypeID,
                TransmissionID
            FROM CarTechnicalDetails
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching car technical details:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// Get all countries
router.get('/countries', async (req, res) => {
    try {
        const result = await pool.query("SELECT CountryID, Name FROM Countries;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Countries:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all regions
router.get('/regions', async (req, res) => {
    try {
        const result = await pool.query("SELECT RegionID, CountryID, Name FROM Regions;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Regions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all cities
router.get('/cities', async (req, res) => {
    try {
        const result = await pool.query("SELECT CityID, RegionID, Name FROM Cities;");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching Cities:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Search endpoint
router.get('/search', async (req, res) => {
    try {
        const { make, model, type, year, color, minPrice, maxPrice } = req.query;

        let query = `
            SELECT 
                c.CarID, c.Year, c.Price, c.Description, c.RegistrationNumber, c.VIN,
                m.MakeName, mo.ModelName, vt.TypeName, col.Name AS ColorName, cs.ShadeName
            FROM Cars c
            LEFT JOIN Makes m ON c.MakeID = m.MakeID
            LEFT JOIN Models mo ON c.ModelID = mo.ModelID
            LEFT JOIN VehicleTypes vt ON c.TypeID = vt.TypeID
            LEFT JOIN Colors col ON c.ColorID = col.ColorID
            LEFT JOIN ColorShades cs ON c.ShadeID = cs.ShadeID
            WHERE 1=1
        `;
        const queryParams = [];

        if (make) queryParams.push(make) && (query += " AND m.MakeName = $" + queryParams.length);
        if (model) queryParams.push(model) && (query += " AND mo.ModelName = $" + queryParams.length);
        if (type) queryParams.push(type) && (query += " AND vt.TypeName = $" + queryParams.length);
        if (year) queryParams.push(year) && (query += " AND c.Year = $" + queryParams.length);
        if (color) queryParams.push(color) && (query += " AND col.Name = $" + queryParams.length);
        if (minPrice) queryParams.push(minPrice) && (query += " AND c.Price >= $" + queryParams.length);
        if (maxPrice) queryParams.push(maxPrice) && (query += " AND c.Price <= $" + queryParams.length);

        const result = await pool.query(query, queryParams);

        res.json(result.rows);
    } catch (err) {
        console.error("Error in search query:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
