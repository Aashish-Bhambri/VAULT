import React from 'react'

const ChatbotRightSidebar = () => {
  return (
    <aside className='flex flex-col h-screen w-[20%] bg-[#1B1B1B] border-l border-[#303030] p-4 gap-4 text-[#F5F5F5] select-none'>
      <div className='text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider px-1'>
        Intel & Context
      </div>
      <div className='p-3.5 bg-[#202020] border border-[#303030] rounded-xl text-xs text-[#737373]'>
        Select a game, guide, or prompt to inspect detailed specs, ratings, and stats.
      </div>
    </aside>
  )
}

export default ChatbotRightSidebar