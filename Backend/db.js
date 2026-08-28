const mysql = require("mysql2");

console.log("db.js loaded");

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("✅ Connected to MySQL Database");
});

module.exports = connection;