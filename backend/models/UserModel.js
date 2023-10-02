 // name
// email
// password
// photo 
// isAdmin

const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
    },
    password : {
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
},
{timestamps : true}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User",userSchema);


