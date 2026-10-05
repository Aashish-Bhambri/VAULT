import mongoose from "mongoose";

const chatBotSchema = mongoose.Schema({
    input:{
        type:String,
        required:true
    },
    output:{
        type:String,
        require:true
    }
})

const ChatBot = mongoose.model('ChatBot',chatBotSchema);
export default ChatBot;