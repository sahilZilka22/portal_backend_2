const express = require("express");
const connectDB =  require(`./config/db`)
const morgan = require("morgan")
const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
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
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server =  app.listen(PORT,()=>{
    console.log(`server is running on port http://localhost:${PORT}`);
});
