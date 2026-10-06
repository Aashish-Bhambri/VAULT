import React, { useState, useRef, useEffect } from "react";
import backendApi from "../services/backendApi";
import { FaRegWindowMinimize } from "react-icons/fa";
import { BsSearch, BsFillSendFill, BsCircleFill } from "react-icons/bs";
import { IoReloadOutline } from "react-icons/io5";

const BOT_AVATAR =
    "https://media.istockphoto.com/id/1333838449/vector/chatbot-icon-support-bot-cute-smiling-robot-with-headset-the-symbol-of-an-instant-response.jpg?s=612x612&w=0&k=20&c=sJ_uGp9wJ5SRsFYKPwb-dWQqkskfs7Fz5vCs2w5w950=";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const recommendations = [
        { name: "Recommended Games" },
        { name: "Games Like Cyberpunk 2077" },
        { name: "Best co-op games" },
        { name: "Find games under 10 hours" },
    ];

    const arr = [
        { name: "Genres" },
        { name: "Platforms" },
        { name: "Ratings" },
        { name: "Release dates" },
    ];

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSendMessage = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query || loading) return;

        // 1. Add user's message to chat UI
        const newMessages = [...messages, { sender: "user", text: query }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            // 2. Call backend controller API
            const response = await backendApi.post("/api/chatbot/message", {
                message: query,
            });

            // 3. Add bot reply to UI
            const reply = response.data?.reply || "I didn't receive a response.";
            setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, I couldn't reach the server. Please ensure the backend is running.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleResetChat = () => {
        setMessages([]);
        setInput("");
    };

    return (
        <div>
            {/* Floating Trigger Button */}
            <div
                className="cursor-pointer fixed bottom-6 right-6 z-40 transition-transform hover:scale-105"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    className="rounded-full h-16 w-16 shadow-lg border border-zinc-700 object-cover"
                    src={BOT_AVATAR}
                    alt="Chatbot trigger"
                />
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 rounded-2xl border border-[#34363D] bg-[#18191D] h-screen w-screen shadow-2xl z-50 flex flex-col overflow-hidden text-zinc-200">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-[#2d2f36] bg-[#1d1f24]">
                        <div className="flex gap-2 items-center">
                            <img
                                className="rounded-full h-10 w-10 object-cover"
                                src={BOT_AVATAR}
                                alt="Bot Avatar"
                            />
                            <div>
                                <span className="font-semibold text-[15px] block leading-tight">
                                    Game Assistant
                                </span>
                                <span className="flex gap-1 items-center text-[12px] text-green-500 font-medium">
                                    <BsCircleFill className="text-[8px]" /> Online
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400">
                            {messages.length > 0 && (
                                <button
                                    title="Clear chat"
                                    onClick={handleResetChat}
                                    className="hover:text-zinc-200 transition-colors"
                                >
                                    <IoReloadOutline className="text-lg" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:text-zinc-200 transition-colors"
                            >
                                <FaRegWindowMinimize className="text-sm mb-1" />
                            </button>
                        </div>
                    </div>

                    {/* Conversation Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                        {messages.length === 0 ? (
                            // Welcome / Suggested Prompts Screen
                            <div className="space-y-4">
                                <div className="p-1">
                                    <h3 className="text-lg font-semibold text-zinc-100">
                                        What are you looking for?
                                    </h3>
                                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                                        I can help you find games based on your preferences, recommend titles,
                                        and check genres, ratings, and release dates.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400 mb-2 font-medium">Popular Prompts:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {recommendations.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(item.name)}
                                                className="bg-[#222328] hover:bg-[#2d2f36] border border-[#34363D] rounded-full px-3 py-1.5 text-xs text-zinc-300 text-left transition-colors"
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400 mb-2 font-medium">Try asking about:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {arr.map((a, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(`Tell me about top games in ${a.name}`)}
                                                className="bg-[#222328] hover:bg-[#2d2f36] border border-[#34363D] rounded-full px-3 py-1.5 text-xs text-zinc-300 transition-colors"
                                            >
                                                {a.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Message Bubbles
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-sm whitespace-pre-wrap ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-xs"
                                            : "bg-[#222328] border border-[#34363D] text-zinc-200 rounded-bl-xs"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Thinking / Loading Indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#222328] border border-[#34363D] text-zinc-400 rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs flex items-center gap-1.5">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse delay-150"></span>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse delay-300"></span>
                                    <span className="ml-1">Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="p-3 border-t border-[#2d2f36] bg-[#18191D]">
                        <div className="flex items-center gap-2 bg-[#222328] border border-[#34363D] px-3 py-2 rounded-xl focus-within:border-zinc-500 transition-colors">
                            <BsSearch className="text-zinc-500 text-sm shrink-0" />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask for game recommendations..."
                                disabled={loading}
                                className="w-full bg-transparent outline-none text-zinc-200 text-sm placeholder-zinc-500 disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => handleSendMessage()}
                                disabled={loading || !input.trim()}
                                className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
                            >
                                <BsFillSendFill className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
