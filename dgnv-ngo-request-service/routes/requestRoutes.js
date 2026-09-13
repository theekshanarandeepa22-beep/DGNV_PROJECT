const express = require("express");
const router = express.Router();

const {
    receiveRequest,
    getAllRequests,
    assignVolunteer
} = require("../controllers/requestController");

router.post("/receive", receiveRequest);

router.get("/", getAllRequests);

router.post(
    "/:id/assign-volunteer",
    assignVolunteer
);

module.exports = router;