const router = require("express").Router();

const multer = require('multer');
const path = require('path');

const upload = multer({
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Images only!');
      }
    }
});


const {allUsers,accessChat,fetchChats,createGroupChat,remaneGroup,removeFromGroup,addToGroup} = require("../controller/chatController");
const { registerUser, loginUser, showImage } = require("../controller/userController");
const {sendMessage, allMessages, sendImage} = require("../controller/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post('/post',upload.single('image'),registerUser)
router.post('/login', loginUser)
router.get('/users',protect,allUsers)
router.get('/uploads/:filename', showImage)

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.put('/rename', protect, remaneGroup);
router.post('/groupremove', protect, removeFromGroup);
router.put('/groupadd', protect, addToGroup);

router.post('/sendMessage', protect, sendMessage);
router.post('/sendImage', upload.single('image'), protect, sendImage);
router.get('/:chatId', protect, allMessages);

module.exports = router
