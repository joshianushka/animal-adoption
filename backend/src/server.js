require("dotenv").config();
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Animal Adoption API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});