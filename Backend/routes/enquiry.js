const express = require("express");
const router = express.Router();
const db = require("../db");
router.post("/", (req, res) => {
    const {
        name,
        company,
        phone,
        email,
        product,
        quantity,
        message
    } = req.body;

    const sql = `
        INSERT INTO enquiries
        (name, company, phone, email, product, quantity, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, company, phone, email, product, quantity, message],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully!"
            });
        }
    );
});

module.exports = router;