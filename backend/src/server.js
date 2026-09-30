require("dotenv").config();
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = require("./config/db");
const animalRoutes = require("./routes/animalRoutes");

const express = require("express");
const cors = require("cors");

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/adopters", require("./routes/adopterRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));

app.use("/api/animals", animalRoutes);
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