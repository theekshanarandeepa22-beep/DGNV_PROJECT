const volunteerRoutes =
require("./routes/volunteerRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/volunteers", volunteerRoutes);

app.get("/", (req, res) => {
    res.json({
        service: "DGNV Volunteer Service",
        status: "RUNNING"
    });
});

const PORT = process.env.PORT || 9202;

app.listen(PORT, () => {
    console.log(`Volunteer Service running on port ${PORT}`);
});