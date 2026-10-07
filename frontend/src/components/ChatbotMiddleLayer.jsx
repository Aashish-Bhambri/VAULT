import React, { useState } from 'react'
import FoldText from './FoldText';
import backendApi from '../services/backendApi';

const ChatbotMiddleLayer = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const suggetions = [
        {
            name: "Find Games",
            description: "Discover your next favorite game"
        },
        {
            name: "Build Games",
            description: "Get optimized builds & loadouts"
        },
        {
            name: "Game Reviews",
            description: "Honest analysis & ratings"
        },
        {
            name: "release Tracker",
            description: "What's new & what's coming"
        },
        {
            name: "Personalised Picks",
            description: "Based on your taste & history"
        },
    ]

    const handleSubmit = async(textToSend) => {
        const query= (textToSend||input).trim();
        if(!query.trim()) return;
        const newMessages = [...messages,{sender:"user", text:query}];
        setMessages(newMessages);
        setInput("");
        console.log(messages);

        try{
            const res =await backendApi.post("/api/chatbot/",{
                message: query
            });
            const reply = res.data?.reply || "I didnt receive a response.";
            setMessages((prev)=>[...prev,{sender:"bot",text:reply}])
        }catch(error){
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, I couldn't reach the server. Please ensure the backend is running.",
                },
            ]);
        } 
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    const handleSuggestions = (item) => {
        const text = typeof item === 'object' ? item.name : item;
        handleSubmit(text);
    }

    return (
        <main className='relative flex flex-col justify-between w-[60%] h-screen bg-[#151515] p-6 overflow-hidden'>
            {messages.length === 0 ?
                <div className='flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto text-center gap-4'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B1B1B] border border-[#303030] text-[#19E6C1] text-xs font-semibold tracking-wider uppercase'>
                        <span className='w-1.5 h-1.5 rounded-full bg-[#19E6C1] animate-pulse'></span>
                        VAULT AI / GAMING ASSISTANT
                    </div>
                    <FoldText
                        text="Your Gaming Intelligence, evolved"
                        splitBy="char"
                        hinge="top"
                        trigger="mount"
                        duration={0.65}
                        stagger={0.045}
                        ease="power3.out"
                        perspective={700}
                        creaseShading={0.55}
                        fontSize={80}
                        fontWeight={800}
                        color="#f7f2e8"
                    />

                    <p className='text-sm md:text-base text-[#A3A3A3] max-w-lg'>
                        Discover games, get personalized recommendations, explore builds,<br /> and stay updated — all powered by advanced AI.
                    </p>

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-4 text-left'>
                        {suggetions.map((items, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className='p-4 bg-[#202020] hover:bg-[#292929] border border-[#303030] hover:border-[#19E6C1]/50 rounded-2xl cursor-pointer transition-all duration-200 group'
                                    onClick={() => handleSuggestions(items)}
                                >
                                    <div className='text-sm font-semibold text-[#F5F5F5] group-hover:text-[#19E6C1] transition-colors'>
                                        {items.name}
                                    </div>
                                    <div className='text-xs text-[#737373] mt-1'>
                                        {items.description}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                :
                <div className='flex-1 overflow-y-auto space-y-4 p-4 pb-28 no-scrollbar'>
                    {messages.map((msg, idx) => {
                        const isUser = typeof msg === 'object' ? msg.sender === 'user' : false;
                        const text = typeof msg === 'object' ? msg.text : msg;
                        return (
                            <div
                                key={idx}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                        isUser
                                            ? 'bg-[#19E6C1] text-[#151515] font-semibold rounded-br-sm shadow-sm'
                                            : 'bg-[#202020] border border-[#303030] text-[#F5F5F5] rounded-bl-sm shadow-sm'
                                    }`}
                                >
                                    {text}
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <div className='absolute bottom-1 w-full max-w-3xl mx-auto pb-2'>
                <div className='flex items-center gap-2 bg-[#242424] border border-[#303030] focus-within:border-[#19E6C1] rounded-2xl p-2 px-4 shadow-lg transition-colors'>
                    <input
                        type='text'
                        placeholder='Ask VAULT anything about games, builds, or releases...'
                        className='w-full bg-transparent text-[#F5F5F5] placeholder-[#737373] text-sm focus:outline-none'
                        onChange={(e) => (setInput(e.target.value))}
                        value={input}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={() => handleSubmit()}

                        className='bg-[#19E6C1] hover:bg-[#35F2D0] active:bg-[#0D9F88] text-[#151515] font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer'>
                        Send
                    </button>
                </div>
                <div className='text-[11px] text-[#737373] text-center mt-2'>
                    VAULT AI can make mistakes. Verify important game intel.
                </div>
            </div>
        </main>
    )
}

export default ChatbotMiddleLayer