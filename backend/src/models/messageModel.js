const mongoose = require('mongoose');

const MessageModel = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content : {
        type : String, trim : true
    },
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    },

} , { timestamps: true })

const message = mongoose.model("Message", MessageModel);

module.exports = message

// const mongoose = require("mongoose");

// const messageSchema = mongoose.Schema(
//   {
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     content: { type: String, trim: true },
//     chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);
// module.exports = Message;