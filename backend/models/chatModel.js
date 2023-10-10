// import mongoose
// define model schema
const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "newUser",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "new messages",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newUser",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat",chatSchema);
// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin
