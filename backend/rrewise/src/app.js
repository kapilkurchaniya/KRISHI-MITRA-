const express = require('express');
const app = express();
app.use(express.json());

const router = require("../routes/auth.routes");
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use("/api/auth", router)

module.exports = app;