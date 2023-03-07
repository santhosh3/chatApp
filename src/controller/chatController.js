const userModel = require('../models/userModel');
const chatModel = require('../models/chatModel');
const Message = require('../models/messageModel');
const message = require('../models/messageModel');

async function allUsers(req,res){
    try {
        const keyword = req.query.search
            ? {
                $or : [
                    {name : {$regex: req.query.search, $options: "i"}},
                    {email : {$regex: req.query.search, $options: "i"}},
                ],
              } : {}
        const users = await userModel.find(keyword).find({_id : {$ne : req.user._id}});
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}

async function accessChat(req,res){
    try {
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({status:false, message:"userId param not send with request"});
        }
        let isChat = await chatModel.find({
            isGroupChat: false,
            $and: [
              { users: { $elemMatch: { $eq: req.user._id } } },
              { users: { $elemMatch: { $eq: userId } } },
            ],
          })
          .populate("users", "-password")
          .populate("latestMessage");

            isChat = await userModel.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
          });

        if(isChat.length > 0){
           return res.status(200).send(isChat[0]);
        }else{
            let chatData = {
                chatName : "sender",
                isGroupChat : false,
                users : [req.user._id, userId],
            };
            try {
                const createdChat = await chatModel.create(chatData);
                const fullChat = await chatModel.findOne({_id: createdChat._id}).populate(
                    "users","-password"
                );
                return res.status(200).json(fullChat)
            } catch (error) {
                return res.status(500).json({status:false,error:error.message})
            }
        }
    } catch (error) {        
        return res.status(500).json({status:false,error:error.message})
    }
}

async function fetchChats(req,res){
    try {
        let findChat = await chatModel.find({users:{$elemMatch:{$eq: req.user._id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt:-1})
        
        findChat = await userModel.populate(findChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        return res.status(200).json(findChat);
    } catch (error) {
        return res.status(500).json({status:false, message: error.message})
    }
}

async function createGroupChat(req,res){
 try {
    if(!req.body.users || !req.body.name){
        return res.status(400).json({message:"Please fill all the fields"})
    }
    let users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res.status(400).send({status:false,message:"More then 2 users are required to form a group chat"})
    }
    users.push(req.user);
    try {
        const groupChat = await chatModel.create({
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.user
        });
        const fullGroupChat = await chatModel.findOne({_id: groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password")

        return res.status(200).json(fullGroupChat);
    } catch (error) {
        
    }
 } catch (error) {
    return res.status(500).json({status:false, message: error.message})
  }
}

async function remaneGroup(req,res){
    try {
        const { chatId, chatName } = req.body;
        const updatedChat = await chatModel.findByIdAndUpdate(chatId,{chatName},{new: true})
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404).json({status:false,message:"Chat Not Found"});
          } else {
            res.status(200).json(updatedChat);
          }
    } catch (error) {
        return res.status(500).json({status:false, message: error.message})
    }
}


async function addToGroup(req,res){
    const { chatId, userId } = req.body;

    const added = await chatModel.findByIdAndUpdate(chatId,{$push: { users: userId }},{new: true,})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404).json({status:false,message:"Chat Not Found"});
      } else {
        res.status(200).json(added);
      }
}

async function removeFromGroup(req,res){
    const { chatId, userId } = req.body;

    const removed = await chatModel.findByIdAndUpdate(chatId,{$pull: { users: userId }},{new: true,})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404).json({status:false,message:"Chat Not Found"});
      } else {
        res.status(200).json(removed);
      }
}

module.exports = {
    allUsers,accessChat,fetchChats,createGroupChat,remaneGroup,removeFromGroup,addToGroup
}