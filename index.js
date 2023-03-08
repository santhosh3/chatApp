const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const Routes = require("./src/router/routes")
const app = express();

app.use(cors());
app.use(bodyParser.json());

async function connectDB(){
   try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb+srv://santhosh:12345@backend.sx1ylzc.mongodb.net/socket',{ useNewUrlParser:true,useUnifiedTopology:true});
    console.log("DB is connected successfully")
   } catch (error) {
    console.log(error);
    process.exit();
   }
}
connectDB()

app.use("/", Routes);


const PORT = 5000
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined room" + room);
    });
    
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});