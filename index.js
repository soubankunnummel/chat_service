import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import {createServer} from "http";
import cors from "cors";
import { Server } from "socket.io";
import connection from "./config/db.js";
import cron from 'node-cron'
import chatRoute from './Routes/chatRoute.js'
const app = express();
connection()

const server = createServer(app);
app.use(cors()); 
app.use(express.json())
// const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://talkflow.vercel.app/chat",
        // methods:"GET,POST" 
      }, 
      transports: ["websocket", "polling"],
});

app.use(chatRoute)

cron.schedule('* * * * *', () => {
  console.log('Running a task every minute');
});

io.on("connection", async (socket) => {
  console.log(`User connected :${socket.id}`); 

  socket.on("join_room", (data) => {    
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room : ${data}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  }); 
 
  socket.on("disconnect", () => {  
    console.log(`user disconnected`, socket.id); 
  });
});

server.listen(5000, () => {
  console.log(`server running..5000`);
});
