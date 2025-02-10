import express from "express";
import sql from "mssql";
import { connectToDatabase } from "../database.js";

const router = express.Router();

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
