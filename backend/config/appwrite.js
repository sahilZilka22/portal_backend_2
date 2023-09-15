const { Client, ID, InputFile } = require("node-appwrite");
const sdk = require("node-appwrite");
const dotenv = require(`dotenv`);
const express = require("express");
const router = express.Router();
const asynchandler = require("express-async-handler")
dotenv.config();

const apikey = process.env.APP_WRITE_API_KEY;
let client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('64fbff681fc58dbffca3') // Your project ID
    .setKey(apikey); // Your secret API key

const storage = new sdk.Storage(client);

const bucketId = '64fbffae4ddba6825d2c';
const fileId = ID.unique();


const uploadMultiple = asynchandler(async(req,res)=>{
    // check if the user has selected the files or not
    if (!req.files || !req.files.photos || !Array.isArray(req.files.photos)) {
        res.send({
            status : 400,
            message : "Bad request please send files before uploading"
        });
    }
    console.log(req.files);
    // now store the photos into an array
    const uploadedFiles = req.files.photos
    const uploadedFilesId = []; // to store the file ids

    for (let index = 0; index < uploadedFiles.length; index++) {
        const file = uploadedFiles[index];
        const tempFilePath = file.tempFilePath;
        
        try {
            const fileuploaded = await storage.createFile(bucketId,fileId,InputFile.fromPath(tempFilePath,file.name))
            uploadedFilesId.push(fileuploaded.$id);
            console.log(`File ${index + 1} uploaded successfully.`);
        } catch (error) {
            console.error(`Error uploading file ${index + 1}: ${error}`);
            res.send({
                status : 403,
                message :"Error uploading the files",
                Error : error
            });
        }
    }

    res.send({
        status : 200,
        message : "All files uploaded succsessfully",
        uploadedFilesId,
    });
});

router.route("/").post(uploadMultiple);
// router.route("/multiple").post(uploadMultiple);

module.exports = {  router };
