const express = require("express");
const connectDB = require("../config/database");
const router = require("../routes/auth.route");
const cookieParser = require("cookie-parser");
const postrouter = require("../routes/post.route");
const userrouter = require("../routes/user.route");
const cors = require("cors");


const app = express();
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
)) 
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",router);
app.use("/api/post",postrouter);
app.use("/api/user",userrouter);


connectDB();

module.exports = app;