const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./routes/auth.routes');
const cors = require('cors');
const routerSong = require('./routes/song.routes');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router); 
app.use('/api/song', routerSong);

module.exports = app;
