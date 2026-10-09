import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["user", "bot"],
        required: true,
    },
    text: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const conversationSchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default:null
    },
    title:{
        type:String,
        default:"New Chat"
    },
    messages:[messageSchema],
}, { timestamps: true })

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;