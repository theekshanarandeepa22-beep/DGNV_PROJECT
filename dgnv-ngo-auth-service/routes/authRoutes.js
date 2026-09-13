const express = require("express");
const router = express.Router();

const {
    registerNgo,
    login
} = require("../controllers/authController");

// NGO Registration
router.post("/register-ngo", registerNgo);

// NGO Login
router.post("/login", login);

module.exports = router;