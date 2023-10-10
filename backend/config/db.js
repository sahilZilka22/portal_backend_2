const mongoose = require(`mongoose`)

//uri 1  MONGO_URI=mongodb+srv://sahil:0OcyqTX9uUVBOcW9@dooperportal.cxv08ny.mongodb.net/
// uri 2 mongodb+srv://sahilzilka:OBzU26mj0jqsTreN@doopercluster.tfpphb1.mongodb.net/
const connectDB = async()=>{
    try {
        const connection =  await mongoose.connect(process.env.MONGO_URI_2,{useUnifiedTopology : true  });
            console.log(`Database Connected ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }
};
module.exports = connectDB;
