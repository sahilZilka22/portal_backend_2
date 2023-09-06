const express = require("express");
const connectDB =  require(`./config/db`)
const morgan = require("morgan")
const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require("../backend/routes/messageRoute");
const dotenv = require(`dotenv`);
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();
const cors = require('cors');
app.use(morgan("tiny"));
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json()); // for server to accept json data

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/message",messageRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server =  app.listen(PORT,()=>{
    console.log(`server is running on port http://localhost:${PORT}`);
});

const io = require("socket.io")(server,{
    pingTimeout :6000,
    cors : {
        origin : `http://localhost:3000`
    } 
});


io.on("connection",(socket)=>{
    console.log("Connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected")
    });

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("User joined Room : " + room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat
        
        if(!chat.users) return console.log(`Chat users not defined ${chat.users}`);
        chat.users.forEach((user)=>{
            // this logic defines that if we want to send messages to all the other users in the room 
            // other than the user who sent this message
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    });
    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })

})