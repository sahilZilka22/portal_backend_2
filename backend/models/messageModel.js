// name of the sender
//message content
//chat ref to chat maodel
// read by
// time stamp
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    message : {
        type : String,
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

module.exports = mongoose.model("Message",messageSchema);