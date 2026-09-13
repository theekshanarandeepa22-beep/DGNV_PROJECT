const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const { requireNgoAuth } = require("../middleware");

router.get("/summary", requireNgoAuth, getDashboardSummary);

module.exports = router;
