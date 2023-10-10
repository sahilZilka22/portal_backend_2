// name
// phoneNumber
// role
// photo 
// isAdmin
// isVerified

const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema({
    name : {
        type : String,
    },
    phoneNumber : {
        type : String,
    },
    role : {
        type : String,
        required : true,
    },
    photo : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    isVerified : {
        type : Boolean,
        default : true
    }
},
{timestamps : true}
);




module.exports = mongoose.model("newUser",userSchema);


