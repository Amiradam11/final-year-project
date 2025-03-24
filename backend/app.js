const path = require("path");
require("dotenv").config();
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");

const connectDB = require("./config/db");
connectDB();

const app = express();

const allowedOrigins = ["http://127.0.0.1:5500", 'file:///C:/Users/USHAKA%20ALICE%20ALO/Desktop/AILearningAssitance/frontend/', process.env.LIVE_CLIENT_URL];

app.use(
    cors({
        origin: allowedOrigins,
        methods: 'GET, POST, PUT, PATCH, DELETE, UPDATE, FETCH',
        credentials: true,
    })
);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});