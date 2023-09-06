const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/usermodel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async(req,res)=>{
    const {content,chatID} = req.body;
    
    if(!content || !chatID){
        return res.send({
            status : 400,
            message : "Invalid data passed into request"
        });
    }

    var newMessage = {
        sender : req.user._id,
        message : content,
        chat: chatID
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender","name photo email");
        message = await message.populate("chat","chatName isGroupChat users latestMessage");
        message = await User.populate(message,{
            path : "chat.users",
            select : "name photo email"
        });

        await Chat.findByIdAndUpdate(req.body.chatID,{latestMessage : message});
        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {allMessages, sendMessage};