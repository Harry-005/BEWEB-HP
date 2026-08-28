const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

require("dotenv").config();

const db = require("./db");
const enquiryRoutes = require("./routes/enquiry");
const adminRoutes = require("./routes/admin");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));


// ===============================
// SESSION
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET || "balaji_secret",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);


// ===============================
// SERVE WEBSITE
// ===============================

app.use(express.static(path.join(__dirname, "..")));


// ===============================
// API ROUTES
// ===============================

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/admin", adminRoutes);


// ===============================
// TEST
// ===============================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Balaji Enterprises Backend is Running 🚀"
    });

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("=================================");

});