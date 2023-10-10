const asyncHandler = require("express-async-handler");
const { Client, ID, Users, InputFile } = require("node-appwrite");
const newMessageModel = require("../models/newMessageModel");
const sdk = require("node-appwrite");
const dotenv = require(`dotenv`);
const express = require("express");
const router = express.Router();
const usermodel = require("../models/UserModel")
const newusermodel = require("../models/NewUserModel")
const Chat = require("../models/chatModel");
const { protect } = require("../middleware/authMiddleware");
dotenv.config();


// appwrite details

const apikey = process.env.APP_WRITE_API_KEY;
const endpoint = process.env.APPWRITE_ENDPOINT
const projectId = process.env.PORJECT_ID
let client = new Client();
client
.setEndpoint(endpoint) // Your API Endpoint
.setProject(projectId) // Your project ID
.setKey(apikey); // Your secret API key

const storage = new sdk.Storage(client);

const bucketId = process.env.BUCKET_ID;
const fileId = ID.unique();


const sendMessages = asyncHandler(async(req,res)=>{
    const {message,chatId} =  req.body;
    let uploadedFiles,uploadedFilesArray;
    var newMessage;
    let download_url;
    if( !chatId ){
        return res.send({
            status : 400,
            message : "Invalid data passed into the request"
        });
    }
    if(req.files){
        uploadedFiles = Array.isArray(req.files.content) ? req.files.content: [req.files.content];
        uploadedFilesArray = [];
        for (let index = 0; index < uploadedFiles.length; index++) {
            const singleFile = uploadedFiles[index];
            const templfilePath = singleFile.tempFilePath
            try {
                const fileUploaded = await storage.createFile(
                    bucketId,fileId,
                    InputFile.fromPath(templfilePath,singleFile.name)
                )
                download_url = `${endpoint}/storage/buckets/${bucketId}/files/${fileUploaded.$id}/view?project=${projectId}&mode=admin`
                uploadedFilesArray.push({
                    id : fileUploaded.$id,
                    file_type : fileUploaded.mimeType,
                    download_url
                });
            } catch (error) {
                 console.error(`Error uploading file ${index + 1}: ${error}`);
                res.send({
                    status : 403,
                    message :"Error uploading the files",
                    Error : error
                });
            }
            
        }
    }
    if(Array.isArray(uploadedFilesArray) && uploadedFilesArray.length >0){
        newMessage = {
            sender : req.user._id,
            chat : chatId,
            content : uploadedFilesArray,
            message
        }
    }else{
        newMessage = { 
            sender : req.user._id,
            chat : chatId,
            message
        }
    }
    try {
        var messagetoSend = await newMessageModel.create(newMessage);
        messagetoSend = await messagetoSend.populate("sender", "name email");
        messagetoSend = await messagetoSend.populate("chat", "chatName isGroupChat users latestMessage");
        messagetoSend = await newusermodel.populate(messagetoSend,{
            path : "chat.users",
            select : "name email"
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage : messagetoSend});
        res.json(messagetoSend);
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

});
const allMessages = asyncHandler(async(req,res)=>{
    try {
        const messages = await newMessageModel.find({chat : req.params.chatId})
        .populate("sender", "name photo role")
        .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


// routes 
router.route("/").post(protect,sendMessages)
router.route("/getallMessages/:chatId").get(protect,allMessages)

module.exports = {router};

