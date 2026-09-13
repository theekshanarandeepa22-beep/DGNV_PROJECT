const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        service: "DGNV NGO Auth Service",
        status: "RUNNING"
    });
});

const PORT = process.env.PORT || 9201;

app.listen(PORT, () => {
    console.log(`NGO Auth Service running on port ${PORT}`);
});