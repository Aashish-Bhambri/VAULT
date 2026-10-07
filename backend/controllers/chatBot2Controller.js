export const handleChatBot2 = async (req, res) => {
    try {
        return res.status(200).json({
            reply: "Hi i am you r Chatbot ",
            message: "Hi i am you r Chatbot "
        });
    } catch (error) {
        console.error("Error in chatBot2Controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handleChatBot2;
