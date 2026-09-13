const express = require("express");
const router = express.Router();

const {
    getAllTasks,
    acceptTask,
    startTask,
    arrivedTask,
    serviceProvidedTask,
    completeTask
} = require("../controllers/taskController");
const { requireNgoAuth } = require("../middleware");

router.get("/", requireNgoAuth, getAllTasks);
router.put("/:id/accept", requireNgoAuth, acceptTask);
router.put("/:id/start", requireNgoAuth, startTask);
router.put("/:id/arrived", requireNgoAuth, arrivedTask);
router.put("/:id/service-provided", requireNgoAuth, serviceProvidedTask);
router.put("/:id/complete", requireNgoAuth, completeTask);

module.exports = router;
