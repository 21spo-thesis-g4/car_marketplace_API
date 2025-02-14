import express from "express";
import sql from "mssql";
import { connectToDatabase } from "../database.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const {
        TypeID, MakeID, ModelID, Year, ColorID, ShadeID,
        RegistrationNumber, VIN, Price, Description,
        FirstRegistration, InspectionDate, NumberOfOwners,
        UserID, CountryID, RegionID, CityID, SubTypeID,
        Roadworthy, Sold, LastUpdated, Views
    } = req.body;

    // Validate required fields
    if (!TypeID || !MakeID || !ModelID || !Year || !ColorID || !ShadeID ||
        !RegistrationNumber || !VIN || !Price || !UserID || !CountryID || 
        !RegionID || !CityID || !SubTypeID || Roadworthy === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await connectToDatabase(); // Connect to database
        await pool.request()
            .input("TypeID", sql.Int, TypeID)
            .input("MakeID", sql.Int, MakeID)
            .input("ModelID", sql.Int, ModelID)
            .input("Year", sql.Int, Year)
            .input("ColorID", sql.Int, ColorID)
            .input("ShadeID", sql.Int, ShadeID)
            .input("RegistrationNumber", sql.NVarChar, RegistrationNumber)
            .input("VIN", sql.NVarChar, VIN)
            .input("Price", sql.Decimal(10, 2), Price)
            .input("Description", sql.NVarChar, Description || null)
            .input("FirstRegistration", sql.Date, FirstRegistration || null)
            .input("InspectionDate", sql.Date, InspectionDate || null)
            .input("NumberOfOwners", sql.Int, NumberOfOwners || null)
            .input("UserID", sql.Int, UserID)
            .input("CountryID", sql.Int, CountryID)
            .input("RegionID", sql.Int, RegionID)
            .input("CityID", sql.Int, CityID)
            .input("SubTypeID", sql.Int, SubTypeID)
            .input("Roadworthy", sql.Bit, Roadworthy)
            .input("Sold", sql.Bit, Sold || 0) // Default: not sold
            .input("LastUpdated", sql.DateTime, LastUpdated || new Date()) // Default: current time
            .input("Views", sql.Int, Views || 0) // Default: 0 views
            .query(`INSERT INTO Cars 
                (TypeID, MakeID, ModelID, Year, ColorID, ShadeID, RegistrationNumber, VIN, Price, 
                 Description, FirstRegistration, InspectionDate, NumberOfOwners, UserID, CountryID, 
                 RegionID, CityID, SubTypeID, Roadworthy, Sold, LastUpdated, Views)
                VALUES 
                (@TypeID, @MakeID, @ModelID, @Year, @ColorID, @ShadeID, @RegistrationNumber, @VIN, @Price, 
                 @Description, @FirstRegistration, @InspectionDate, @NumberOfOwners, @UserID, @CountryID, 
                 @RegionID, @CityID, @SubTypeID, @Roadworthy, @Sold, @LastUpdated, @Views)`);
        res.status(201).json({ message: "Car added successfully" });
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/", async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM Cars');
        res.json(result.recordset);
    } catch (error) {
        console.error("Error loading cars:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input("CarID", sql.Int, id)
            .query('SELECT * FROM Cars WHERE CarID = @CarID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Car not found." });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await connectToDatabase();
        const existingCar = await pool.request()
            .input("CarID", sql.Int, id)
            .query('SELECT * FROM Cars WHERE CarID = @CarID');

        if (existingCar.recordset.length === 0) {
            return res.status(404).json({ message: "Car not found." });
        }

        await pool.request()
            .input("CarID", sql.Int, id)
            .query('DELETE FROM Cars WHERE CarID = @CarID');

        res.json({ message: "Car deleted successfully." });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;