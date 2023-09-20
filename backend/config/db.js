const mongoose = require(`mongoose`)

const connectDB = async()=>{
    try {
        console.log(process.env.MONGO_URI);
        const connection =  await mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology : true  });
            console.log(`Database Connected ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }
};
module.exports = connectDB;
