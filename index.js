const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http")
require("dotenv").config();
const router = require("./router")

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// app.use(cors({
//     origin : "*",
//     methods: ["GET", "POST"]
// }));

//Routes
app.use(router)

let users = [];

const addUser = (userId, socketId) => {
   !users.some(user => user.userId === userId) &&
       users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("a user connected");
    console.log("users", users);

    //Connect
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    });

    //Get & Send Message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId);

        console.log("user", user)
        io.emit("getMessage", {
            senderId,
            text
        })
    })

    //Disconnect
    socket.on("disconnect", ()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users)
    })
})

const PORT = process.env.PORT;
server.listen( PORT,() => console.log(`Server started on ${PORT}`));
