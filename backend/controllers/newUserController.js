const asyncHandler = require("express-async-handler");
const NewUser = require("../models/NewUserModel");
const generateToken = require("../config/generatetoken");

//@description Get and check the user
//@route   GET /api/v1/check
//@acess public

const checkandSubmitUser = asyncHandler(async (req, res) => {
  try {
    const { name, phoneNumber, photo, role } = req.body;

    if (!name || !phoneNumber || !role) {
      return res.status(400).json({
        status: 400,
        message: "Please enter all the required fields",
      });
    }

    const userExists = await NewUser.findOne({ phoneNumber });

    if (userExists) {
      return res.status(300).json({
        status: 300,
        message: "User already exists",
      });
    }

    const user = await NewUser.create({ name, phoneNumber, photo, role });

    if (user) {
      return res.status(200).json({
        status: 200,
        _id: user._id,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        pic: user.photo,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "User not created/found",
      });
    }
  } catch (error) {
    // Handle any unexpected errors here
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = checkandSubmitUser;

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUserNew = asyncHandler(async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const user = await NewUser.findOne({ phoneNumber });

  if (user) {
    res.send({
      status: 200,
      message: "User logged in successfully",
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      role: user.role,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.send({
      status: 404,
      message: "User not found",
    });
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await NewUser.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { checkandSubmitUser, authUserNew, searchUsers };
