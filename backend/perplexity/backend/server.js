import dotenv from "dotenv";
dotenv.config();
import app from './src/app.js';
import connectDB from './src/config/database.js';
import http from 'http';
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

await connectDB();

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
