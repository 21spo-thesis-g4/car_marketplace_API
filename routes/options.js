import express from "express";
import sql from "mssql";
import { connectToDatabase } from "../database.js";

const router = express.Router();

// Fetch all vehicle makers (brands)
router.get('/makers', async (req, res) => {
    try {
        await connectToDatabase();

        // Fetch MakeName from Makes table
        const result = await new sql.Request().query("SELECT MakeName, MakeID FROM Makes ORDER BY MakeName ASC");

        res.json(result.recordset); // Return a clean array
    } catch (err) {
        console.error("Error fetching vehicle makers:", err);
        res.status(500).send("Server error");
    }
});

router.get('/models/:makeID', async (req, res) => {
    try {
        await connectToDatabase();
        const { makeID } = req.params; // Get MakeID from URL

        // Fetch models based on MakeID
        const result = await new sql.Request()
            .input("makeID", sql.Int, makeID)
            .query("SELECT ModelID, ModelName FROM Models WHERE MakeID = @makeID ORDER BY ModelName ASC");

        res.json(result.recordset); // Send list of models
    } catch (err) {
        console.error("Error fetching models:", err);
        res.status(500).send("Server error");
    }
});

// Get all vehicle types
router.get('/vehicletypes', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT TypeID, TypeName FROM VehicleTypes ORDER BY TypeName ASC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching vehicle types:", err);
        res.status(500).send("Server error");
    }
});
// Get all subtypes
router.get('/subtypes', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT SubTypeID, Name from SubTypes ORDER BY Name ASC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching subtypes", err);
        res.status(500).send("Server Error");
    }
});
// Get all color shades
router.get('/colorShades', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT ShadeID, ShadeName from ColorShades");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Color Shades", err);
        res.status(500).send("Server Error");
    }
});
// Get all colors
router.get('/colors', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT ColorID, Name from Colors ORDER BY Name ASC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Colors", err);
        res.status(500).send("Server Error");
    }
});
// Get all drive types
router.get('/driveType', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT DrivetypeID, Name from DriveTypes");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Drive Types", err);
        res.status(500).send("Server Error");
    }
});
// Get all fuel types
router.get('/fuelType', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT FueltypeID, Name from FuelTypes");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Fuel Type", err);
        res.status(500).send("Server Error");
    }
});
// Get all transmissions
router.get('/transmission', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT TransmissionID, Name from Transmissions");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Transmission", err);
        res.status(500).send("Server Error");
    }
});
// Get all features
router.get('/features', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT FeatureID, Name, Category from Features");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Features", err);
        res.status(500).send("Server Error");
    }
});

// Get all car technical details
router.get('/carTechnicalDetails', async (req, res) => {
    try {
        await connectToDatabase();

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

        const result = await new sql.Request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching car technical details:", err);
        res.status(500).send("Server error");
    }
});

// Get all countries
router.get('/countries', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT CountryID, Name from Countries");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Countries", err);
        res.status(500).send("Server Error");
    }
});

// Get all regions
router.get('/regions', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT RegionID, CountryID, Name from Regions");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Regions", err);
        res.status(500).send("Server Error");
    }
});

// Get all cities
router.get('/cities', async (req, res) => {
    try {
        await connectToDatabase();
        const result = await new sql.Request().query("SELECT CityID, RegionID, Name from Cities");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching Cities", err);
        res.status(500).send("Server Error");
    }
});

// Search endpoint
router.get('/search', async (req, res) => {
    try {
        router.get('/search', async (req, res) => {
            try {
                await connectToDatabase();
        
                // Fetch all rows for testing
                const result = await new sql.Request().query("SELECT TOP 10 * FROM Cars");
                res.json(result.recordset);
            } catch (err) {
                console.error(err);
                res.status(500).send("Server error");
            }
        });
        // Extract query parameters
        const { make, model, type, year, color, minPrice, maxPrice } = req.query;

        // Initialize base query
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

        // Append filters dynamically
        if (make) {
            query += " AND m.MakeName = @make";
            queryParams.push({ name: "make", value: make });
        }
        if (model) {
            query += " AND mo.ModelName = @model";
            queryParams.push({ name: "model", value: model });
        }
        if (type) {
            query += " AND vt.TypeName = @type";
            queryParams.push({ name: "type", value: type });
        }
        if (year) {
            query += " AND c.Year = @year";
            queryParams.push({ name: "year", value: year });
        }
        if (color) {
            query += " AND col.Name = @color";
            queryParams.push({ name: "color", value: color });
        }
        if (minPrice) {
            query += " AND c.Price >= @minPrice";
            queryParams.push({ name: "minPrice", value: minPrice });
        }
        if (maxPrice) {
            query += " AND c.Price <= @maxPrice";
            queryParams.push({ name: "maxPrice", value: maxPrice });
        }

        // Execute query with parameters
        const request = new sql.Request();
        queryParams.forEach(param => request.input(param.name, param.value));

        const result = await request.query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;
