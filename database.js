//import sql from "mssql";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

export default pool;

/*const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true, enableArithAbort: true },
};
// Function to connect to Azure SQL Database
export async function connectToDatabase() {
  try {
    let pool = await sql.connect(config);
    console.log(" Connected to Azure SQL Database!");
    return pool;
  } catch (err) {
    console.error(" Database connection failed!", err);
  }
}*/
