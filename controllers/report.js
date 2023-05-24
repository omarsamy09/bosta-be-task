const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { getReport, getReports } = require("../services/report");

router.get("/", isAuthenticated, getReports);
router.get("/:reportId", isAuthenticated, getReport);

module.exports = router;
