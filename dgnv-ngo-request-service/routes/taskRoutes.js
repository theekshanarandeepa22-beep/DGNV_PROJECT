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

router.get("/", getAllTasks);

router.put("/:id/accept", acceptTask);

router.put("/:id/start", startTask);

router.put("/:id/arrived", arrivedTask);

router.put("/:id/service-provided", serviceProvidedTask);

router.put("/:id/complete", completeTask);

module.exports = router;