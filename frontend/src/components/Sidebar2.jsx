import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import backendApi from '../services/backendApi';

const Sidebar2 = () => {
    const [conversations, setConversations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const { chatId } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth?.user);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const params = user?._id ? { userId: user._id } : {};
            const res = await backendApi.get("/api/chatbot/conversations", { params });
            if (res.data?.conversations) {
                setConversations(res.data.conversations);
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();

        // Listen for new chat creation or updates from ChatbotMiddleLayer
        const handleChatUpdate = () => fetchConversations();
        window.addEventListener("vault_chat_updated", handleChatUpdate);
        return () => window.removeEventListener("vault_chat_updated", handleChatUpdate);
    }, [user?._id]);

    const handleNewChat = () => {
        navigate("/chatbot");
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await backendApi.delete(`/api/chatbot/conversations/${id}`);
            setConversations((prev) => prev.filter((c) => c._id !== id));
            if (chatId === id) {
                navigate("/chatbot");
            }
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    };

    const filteredChats = conversations.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flex flex-col px-6 py-6 gap-5 bg-[#1B1B1B] h-screen w-[22%] border-r border-[#303030] select-none'>
            {/* Logo */}
            <div
                onClick={() => navigate("/")}
                className='font-black tracking-[4px] text-xl cursor-pointer text-[#F5F5F5] hover:text-[#19E6C1] transition-colors'>
                VAULT
            </div>

            {/* Actions: New Chat & Search Input */}
            <div className='flex flex-col gap-2'>
                <button
                    onClick={handleNewChat}
                    className='flex items-center justify-center gap-2 bg-[#19E6C1] hover:bg-[#35F2D0] active:scale-[0.98] text-[#151515] font-semibold p-2.5 rounded-xl transition-all cursor-pointer text-sm shadow-sm'
                >
                    <span className='text-lg leading-none font-bold'>+</span> New Chat
                </button>
                <div className='relative'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search conversations...'
                        className='w-full bg-[#202020] focus:bg-[#252525] border border-[#303030] focus:border-[#19E6C1] text-xs text-[#F5F5F5] placeholder-[#737373] p-2.5 rounded-xl transition-colors outline-none'
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className='absolute right-2.5 top-2.5 text-xs text-[#737373] hover:text-[#F5F5F5]'
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Recent Chats List */}
            <div className='flex flex-col flex-1 overflow-hidden'>
                <div className='text-xs font-semibold text-[#737373] uppercase tracking-wider px-2 mb-2 flex items-center justify-between'>
                    <span>Recent chats</span>
                    {conversations.length > 0 && (
                        <span className='text-[10px] text-[#555] font-normal'>{conversations.length}</span>
                    )}
                </div>

                <div className='flex-1 overflow-y-auto space-y-1 no-scrollbar text-sm text-[#A3A3A3]'>
                    {loading && conversations.length === 0 ? (
                        <div className='p-3 text-xs text-[#666] text-center'>Loading chats...</div>
                    ) : filteredChats.length === 0 ? (
                        <div className='p-3 text-xs text-[#666] text-center'>
                            {searchQuery ? "No matching chats" : "No recent chats yet"}
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const isActive = chat._id === chatId;
                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => navigate(`/chatbot/${chat._id}`)}
                                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#252525] text-[#19E6C1] font-medium border border-[#383838]'
                                            : 'hover:bg-[#242424] hover:text-[#F5F5F5]'
                                    }`}
                                >
                                    <span className='truncate text-xs flex-1 pr-2'>{chat.title}</span>
                                    <button
                                        onClick={(e) => handleDelete(e, chat._id)}
                                        title='Delete chat'
                                        className='opacity-0 group-hover:opacity-100 text-[#737373] hover:text-red-400 p-1 text-xs transition-opacity'
                                    >
                                        🗑
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* User Profile Card */}
            <div className='flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] border border-[#303030] hover:bg-[#292929] transition-colors cursor-pointer'>
                <div className='w-8 h-8 rounded-full bg-[#242424] border border-[#303030] flex items-center justify-center text-xs font-bold text-[#19E6C1] uppercase'>
                    {user?.username ? user.username[0] : "U"}
                </div>
                <div className='flex flex-col text-left truncate'>
                    <span className='text-xs font-medium text-[#F5F5F5] truncate'>
                        {user?.username || "Guest User"}
                    </span>
                    <span className='text-[11px] text-[#737373]'>Free Tier</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar2;