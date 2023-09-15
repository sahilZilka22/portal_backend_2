 const mongoose = require("mongoose");
 
 const newMessageModel = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    content : [{
        id : {
            type : String
        },
        file_type : {
            type : String
        },
        download_url:{
            type : String
        }
    }],
    message : {
        type : String
    },
    read_by : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat",
    },
 },
 {timestamps : true}
 );
 module.exports = mongoose.model("new messages",newMessageModel);