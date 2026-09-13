const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const requestRoutes =
require("./routes/requestRoutes");
const taskRoutes =
require("./routes/taskRoutes");
const dashboardRoutes =
require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/requests", requestRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        service: "DGNV NGO Request Service",
        status: "RUNNING"
    });
});

const PORT = process.env.PORT || 9203;

app.listen(PORT, () => {
    console.log(
        `NGO Request Service running on port ${PORT}`
    );
});
app.use("/api/tasks", taskRoutes);
