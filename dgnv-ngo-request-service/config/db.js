const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to ngo_request_db");

    // Safe migration for existing databases. The application keeps using
    // the existing tables; only the NGO ownership column/index is added.
    connection.query(
        `ALTER TABLE ngo_requests ADD COLUMN ngo_id BIGINT NULL`,
        (alterErr) => {
            if (alterErr && alterErr.code !== "ER_DUP_FIELDNAME") {
                console.error("ngo_requests ngo_id migration failed:", alterErr.message);
            }

            connection.query(
                `CREATE INDEX idx_ngo_requests_ngo_id ON ngo_requests (ngo_id)`,
                (indexErr) => {
                    if (indexErr && indexErr.code !== "ER_DUP_KEYNAME") {
                        console.error("ngo_requests ngo_id index migration failed:", indexErr.message);
                    }
                }
            );
        }
    );
});

module.exports = connection;
