const asyncHandler = require('express-async-handler')
const User = require("../models/usermodel.js");
console.log(User);
const generateToken = require('../config/generatetoken');

//@description Get or search all users
//@route   GET /api/user?search=
//@acess public


//@description Register new user
//@route   POST /api/user/
//@acess public
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,photo} = req.body;
    // check the feilds
    if(!name || !email || !password){
        res.send({
            status  : 400,
            message : "Please enter all the required feilds"
        });
        throw new Error("Please Enter all the Feilds");
    }
    // check the user
    const userExists = await User.findOne({email});

    if(userExists){
        res.send({
            status : 400,
            message :  "User already exists"
        });
        throw new Error("User already exists");
    }

    const user = await User.create({name,email,password,photo});
    if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.photo,
      token: generateToken(user._id),
    });
    }else{
        res.send({
            status : 400,
            message : "User not created/found"
        });
        throw new Error("User not created/found")
    }

});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      status : 200,
      message : "User logged in successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// search users /api/v1/users?search= // get request

const searchUsers = asyncHandler(async(req,res)=>{
  
   const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
})

module.exports = {registerUser, authUser,searchUsers};