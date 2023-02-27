const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

  const deleteNonImageFiles = async (dirPath) => {

    const readdir = promisify(fs.readdir);
    const unlink = promisify(fs.unlink);

    const files = await readdir(dirPath);
    const deletePromises = files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const isImage = /\.(jpe?g|png)$/i.test(file);
      if (!isImage) {
        await unlink(filePath);
      }
    });
    await Promise.all(deletePromises);
  };

 async function showImage(req,res) {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname,'..', '..','uploads', filename);
        res.sendFile(filePath);
    } catch (error) {
        return res.status(500).send(error.message)
    }
 }

function generateToken(id){
    return jwt.sign({id}, "socket", {expiresIn: "30d"})
}

async function registerUser(req,res){
    try {
        const {name, email, password,image} = req.body;
          if(!name || !email || !password){
            return res.status(400).send({status:false,message:"Please Enter all the fields"});
          }
        const userExist = await userModel.findOne({email});
          if(userExist){
            return res.status(400).send({status:false,message:"User already exists"});
          }
          
        const copyFile = promisify(fs.copyFile);
        const sourcePath = req.file.path;
        const originalFilename = req.file.originalname;
        const destinationPath = 'uploads/'
        await copyFile(sourcePath, destinationPath + originalFilename);
        await deleteNonImageFiles(destinationPath);
        var imageURL = `http://localhost:5000/uploads/${req.file.originalname}`
        
        const body = {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            pic : (imageURL)? imageURL : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        }
        
        const user = await userModel.create(body)
        if(user){
        res.status(201).json({
            _id: user._id, name: user.name,
            email: user.email, password: user.password,
            pic: user.pic,token: generateToken(user._id)
        })
       }else{
        return res.status(400).send({status:false,message:"Failed to create a user"})
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
}

async function loginUser(req,res){
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(user && (await user.matchPassword(password))){
            return res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                pic : user.pic,
                token : generateToken(user._id)
            })
        }else{
            return res.status(401).send({status:false, message: "Invalid email or password"})
        }
    } catch (error) {
            return res.status(500).send({status:false, message: error.message})
    }
}

module.exports = {
    registerUser,loginUser,showImage
}