const express = require("express");

const router = express.Router();

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

        console.log("Admin login successful");

        return res.status(200).json({
            message: "Admin login successful",
            success: true
        });

    }

    console.log("Admin login failed");

    return res.status(401).json({
        message: "Invalid email or password",
        success: false
    });

});

module.exports = router;