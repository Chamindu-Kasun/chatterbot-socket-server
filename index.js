const io = require("socket.io")(8900, {
    cors : {
        origin : ["https://mobios-chatter-app-frontend.web.app:3000" , "https://mobios-chatter-app-backend.herokuapp.com:5000"]
    }
});

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
        io.to(user.socketId).emit("getMessage", {
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
