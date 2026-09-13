const express = require("express");
const router = express.Router();

const {
    addVolunteer,
    getAllVolunteers,
    getAvailableVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer
} = require("../controllers/volunteerController");

router.post("/", addVolunteer);

router.get("/", getAllVolunteers);

router.get("/available", getAvailableVolunteers);

router.get("/:id", getVolunteerById);

router.put("/:id", updateVolunteer);

router.delete("/:id", deleteVolunteer);

module.exports = router;
