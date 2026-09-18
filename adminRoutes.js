const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ============================================
// ADMIN LOGIN
// ============================================

router.post("/login", (req, res) => {

    console.log("POST /api/admin/login received");

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {

        const token = jwt.sign(
            {
                email: email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        console.log("Admin login successful");

        return res.status(200).json({
            message: "Admin login successful",
            success: true,
            token: token
        });

    }

    console.log("Admin login failed");

    return res.status(401).json({
        message: "Invalid email or password",
        success: false
    });

});


// ============================================
// VERIFY ADMIN TOKEN
// ============================================

router.get("/verify", (req, res) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "No token provided"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        res.status(200).json({
            success: true,
            message: "Admin authenticated"
        });

    } catch (error) {

        res.status(401).json({
            message: "Invalid or expired token"
        });

    }

});


module.exports = router;