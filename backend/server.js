const fs = require("fs");
const express = require("express");
const connectDB = require(`./config/db`);
const morgan = require("morgan");
const userRoutes = require("../backend/routes/userRoutes");
const newUserRoutes = require("../backend/routes/newUserRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require("../backend/routes/messageRoute");
const appwriteRoute = require("../backend/config/appwrite");
const fileUpload = require("express-fileupload");
const dotenv = require(`dotenv`);
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();
const cors = require("cors");
const  newMessagerouter = require("./controllers/newMessageController");

const frontend = "https://dooper-frontend.onrender.com"
const localfrontend = "http://localhost:3000"

const corsOptions = {
  origin: localfrontend,
  credentials: true,
  optionSuccessStatus: 200,
};

const approute = appwriteRoute.router;
const nmr = newMessagerouter.router;
const tempFileDir = "./temp/";

if (!fs.existsSync(tempFileDir)) {
  fs.mkdirSync(tempFileDir);
}


app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json()); // for server to accept json data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: tempFileDir,
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/newuser", newUserRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/file", approute);
app.use("/api/v1/newMessage", nmr);

app.get("/home",(req,res)=>{
  console.log("reached home");
  res.send("Reached home");
})
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001; //PORT = 5001

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server,{
    pingTimeout :6000,
    cors : {
        origin : localfrontend// frontend to connect with socket
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
            if(user._id !== newMessageRecieved.sender._id) {

              socket.in(user._id).emit("message recieved", newMessageRecieved);  
            }
        })
    });

    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })

})
// added a comment

