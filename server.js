import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mainRouter from './routes/indexRouting.js';
import bodyParser from 'body-parser';
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

const port = process.env.PORT || 10000;
const db_user = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASS;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Admin connected for real-time notifications');

    // You can also emit notifications based on other events (like new support requests)
    socket.on('disconnect', () => {
        console.log('Admin disconnected');
    });
});
export { io, server };
const corsOptions = {
    origin: "*", // Accept requests from any origin
    optionsSuccessStatus: 201,
    credentials: true, // Allow cookies & authentication headers
};
app.get('/', (req, res) => {
    res.send('Socket.IO Server is Running');
});
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use('/', mainRouter);


const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.yiuj0.mongodb.net/${db_name}?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose
    .connect(dbUri)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Node API is running on port http://localhost:${port}`);

        });
    })
    .catch((error) => {
        console.log(error);
    });