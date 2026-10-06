import React from 'react'
import Sidebar2 from '../components/Sidebar2'
import ChatbotMiddleLayer from '../components/ChatbotMiddleLayer'
import ChatbotRightSidebar from '../components/ChatbotRightSidebar'

const ChatbotPage = () => {
  return (
    <div className='flex h-screen w-full bg-[#151515] text-[#F5F5F5] overflow-hidden'>
      <Sidebar2 />
      <ChatbotMiddleLayer />
      <ChatbotRightSidebar />
    </div>
  )
}

export default ChatbotPage