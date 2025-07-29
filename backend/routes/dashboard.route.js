// routes/dashboard.route.js
const express = require("express");
const { getDashboardStats, getChartAndUsersData } = require("../controllers/dashboard.controller");
const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/main-data", getChartAndUsersData); // 👈 यह नया रूट जोड़ें

module.exports = router;