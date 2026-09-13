const express = require("express");
const router = express.Router();

const {
    receiveRequest,
    getAllRequests,
    assignVolunteer
} = require("../controllers/requestController");
const { requireNgoAuth } = require("../middleware");

// Government integration calls this endpoint, so it remains public to the
// integration service. Category matching happens server-side.
router.post("/receive", receiveRequest);

router.get("/", requireNgoAuth, getAllRequests);
router.post("/:id/assign-volunteer", requireNgoAuth, assignVolunteer);

module.exports = router;
