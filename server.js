require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const dns = require('dns');
dns.setServers(['1.1.1.1','8.8.8.8']);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("StudentHub API is running...");
});
app.use("/api/auth", authRoutes);

const startServer = async()=>{
    try {
        await connectDB();
        console.log("mongodb connected");
        app.listen(PORT,()=>{
             console.log(`server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();