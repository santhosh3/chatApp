const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {deleteNonImageFiles} = require('./userController');

async function allMessages(req,res){
    try {
        const messages = await messageModel.find({chat: req.params.chatId}).populate(
            "sender",
            "name pic email"
        ).populate("chat");
        return res.json(messages)
    } catch (error) {
        return res.status(500).send({status:false, message:error.message});
    } 
}

async function sendMessage(req,res){
    try {
        const {content, chatId} = req.body;
        if(!content || !chatId){
            console.log("Invalid data passed into request");
            return res.status(400).send({status:false, message:"Invalid data passed into request"});
        };
        let newMessage = {
            sender: req.user._id,
            content,
            chat : chatId,
        }
        let message = await messageModel.create(newMessage); 
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await userModel.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });
        return res.json(message);
    } catch (error) {
        return res.status(500).send({status:false, message:error.message});
    }
}

async function sendImage(req,res){
    try {
        const copyFile = promisify(fs.copyFile);
        const sourcePath = req.file.path;
        const originalFilename = req.file.originalname;
        const destinationPath = 'uploads/'
        await copyFile(sourcePath, destinationPath + originalFilename);
        await deleteNonImageFiles(destinationPath);
        let imageURL = `http://localhost:5000/uploads/${req.file.originalname}`
        
        const {chatId} = req.body;
        if(!imageURL || !chatId){
            console.log("Invalid data passed into request");
            return res.status(400).send({status:false, message:"Invalid data passed into request"});
        };
        let newMessage = {
            sender : req.user._id,
            content : imageURL,
            chat : chatId,
        }
        let message = await messageModel.create(newMessage); 
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await userModel.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });
        return res.json(message);
    } catch (error) {
        return res.status(500).send({status:false, message:error.message});
    }
}

module.exports = {
    allMessages, 
    sendMessage,
    sendImage
}