const express = require("express");
const router = express.Router();

const Report = require("../models/Report");

// ============================================
// POST - Submit a new report
// ============================================

router.post("/", async (req, res) => {

    console.log("POST /api/reports received");
    console.log("Report data:", req.body);

    try {

        const newReport = new Report({
            name: req.body.name,
            email: req.body.email,
            issueType: req.body.issueType,
            location: req.body.location,
            description: req.body.description,
            image: req.body.image || ""
        });

        const savedReport = await newReport.save();

        console.log("Report saved:", savedReport._id);

        res.status(201).json({
            message: "Report submitted successfully",
            referenceId: savedReport._id,
            report: savedReport
        });

    } catch (error) {

        console.error("Error saving report:", error);

        res.status(500).json({
            message: "Failed to submit report",
            error: error.message
        });

    }

});


// ============================================
// GET - Get all reports
// ============================================

router.get("/", async (req, res) => {

    console.log("GET /api/reports received");

    try {

        const reports = await Report
            .find()
            .sort({ createdAt: -1 });

        console.log("Reports found:", reports.length);

        res.status(200).json(reports);

    } catch (error) {

        console.error("Error fetching reports:", error);

        res.status(500).json({
            message: "Failed to fetch reports",
            error: error.message
        });

    }

});


// ============================================
// GET - Get one report by ID
// ============================================

router.get("/:id", async (req, res) => {

    console.log(
        "GET /api/reports/:id received:",
        req.params.id
    );

    try {

        const report = await Report.findById(
            req.params.id
        );

        if (!report) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        res.status(200).json(report);

    } catch (error) {

        console.error(
            "Error fetching report:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch report",
            error: error.message
        });

    }

});


// ============================================
// PATCH - Update report status
// ============================================

router.patch("/:id/status", async (req, res) => {

    console.log(
        "PATCH /api/reports/:id/status received"
    );

    try {

        const status = req.body.status;

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid status"
            });

        }

        const updatedReport =
            await Report.findByIdAndUpdate(
                req.params.id,
                { status: status },
                {
                    returnDocument: "after"
                }
            );

        if (!updatedReport) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        console.log(
            "Report status updated:",
            updatedReport._id,
            status
        );

        res.status(200).json({
            message: "Status updated successfully",
            report: updatedReport
        });

    } catch (error) {

        console.error(
            "Error updating status:",
            error
        );

        res.status(500).json({
            message: "Failed to update status",
            error: error.message
        });

    }

});


module.exports = router;