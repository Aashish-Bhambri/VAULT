import React from 'react'

const Sidebar2 = () => {
    return (
        <div className='flex flex-col  px-8 py-7 gap-6 bg-[#1B1B1B]  h-screen w-[20%]  border-r-2 border-solid border-[#303030] select-none'>
            <div
                className='font-black tracking-[4px] text-xl cursor-pointer text-[#F5F5F5]  '>
                VAULT
            </div>
            <div className='flex flex-col gap-2 '>
                <span className='flex items-center justify-center gap-2 bg-[#19E6C1] hover:bg-[#35F2D0] text-[#151515] font-semibold p-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-sm'>New Chat</span>
                <span className='flex items-center gap-2 bg-[#202020] hover:bg-[#292929] border border-[#303030] text-[#A3A3A3] hover:text-[#F5F5F5] p-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left'>Search conversations</span>
            </div>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <div className='text-xs font-semibold text-[#737373] uppercase tracking-wider px-2 mb-2'>
                    Recent chats
                </div>
                <div className='flex-1 overflow-y-auto space-y-1 no-scrollbar text-sm text-[#A3A3A3]'>
                    <div className='p-2.5 rounded-xl hover:bg-[#292929] hover:text-[#F5F5F5] transition-colors cursor-pointer truncate'>
                        Best RPG builds 2026
                    </div>
                    <div className='p-2.5 rounded-xl hover:bg-[#292929] hover:text-[#F5F5F5] transition-colors cursor-pointer truncate'>
                        Upcoming Soulslike releases
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] border border-[#303030] hover:bg-[#292929] transition-colors cursor-pointer'>
                <div className='w-8 h-8 rounded-full bg-[#242424] border border-[#303030] flex items-center justify-center text-xs font-bold text-[#19E6C1]'>
                    U
                </div>
                <div className='flex flex-col text-left'>
                    <span className='text-xs font-medium text-[#F5F5F5]'>User Profile</span>
                    <span className='text-[11px] text-[#737373]'>Free Tier</span>
                </div>
            </div>


        </div>
    )
}

export default Sidebar2