const express = require("express");
const router = express.Router();
const db = require("../db");


/* =====================================================
   ADMIN LOGIN
===================================================== */

router.post("/login", (req, res) => {

    console.log("LOGIN REQUEST:", req.body.username);

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }

    req.session.adminLoggedIn = true;

    console.log(
        "ADMIN LOGGED IN:",
        req.session.adminLoggedIn
    );

    res.json({
        success: true,
        message: "Login successful"
    });
});


/* =====================================================
   GET ENQUIRIES
===================================================== */

router.get("/enquiries", (req, res) => {

    if (!req.session.adminLoggedIn) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const sql = `
        SELECT *
        FROM enquiries
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "GET ENQUIRIES ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            enquiries: results
        });

    });
});


/* =====================================================
   UPDATE ENQUIRY STATUS
===================================================== */

router.patch("/enquiries/:id/status", (req, res) => {

    if (!req.session.adminLoggedIn) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const enquiryId = req.params.id;

    const status =
        req.body.status || "Contacted";

    const allowedStatuses = [
        "New",
        "Contacted",
        "Closed"
    ];

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });

    }

    const sql = `
        UPDATE enquiries
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, enquiryId],
        (err, result) => {

            if (err) {

                console.error(
                    "STATUS UPDATE ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found"
                });

            }

            console.log(
                `Enquiry ${enquiryId} status changed to ${status}`
            );

            res.json({
                success: true,
                message: "Enquiry status updated",
                status: status
            });

        }
    );

});


/* =====================================================
   DELETE ENQUIRY
===================================================== */

router.delete("/enquiries/:id", (req, res) => {

    if (!req.session.adminLoggedIn) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }

    const enquiryId = req.params.id;

    const sql = `
        DELETE FROM enquiries
        WHERE id = ?
    `;

    db.query(
        sql,
        [enquiryId],
        (err, result) => {

            if (err) {

                console.error(
                    "DELETE ENQUIRY ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Enquiry not found"
                });

            }


            console.log(
                `Enquiry ${enquiryId} deleted`
            );


            res.json({

                success: true,

                message:
                    "Enquiry deleted successfully"

            });

        }
    );

});


/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error(
                "LOGOUT ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });

        }

        res.json({
            success: true,
            message: "Logged out successfully"
        });

    });

});


/* =====================================================
   EXPORT
===================================================== */

module.exports = router;
