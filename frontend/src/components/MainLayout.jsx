import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useGames from '../hooks/useGames';
import { useSelector } from 'react-redux';
import ChatBot from './ChatBot';

const MainLayout = () => {
    const { slug } = useParams();
    const location = useLocation();
    const gameDetail = useSelector((state) => state.display.gameID);
    const { games } = useGames();

    // 1. Find active game from location state, redux ID, or URL slug
    const activeGame =
        location.state?.game ||
        games?.find((g) => g.id === gameDetail || g.slug === slug);

    return (
        <div className='relative min-h-screen bg-[#151515] text-white overflow-x-hidden'>
            {/* 2. RAWG Background Image Layer with dual gradient overlay */}
            {activeGame?.background_image && (
                <div
                    className='absolute top-0 left-0 w-full h-[550px] bg-cover bg-top bg-no-repeat pointer-events-none z-0'
                    style={{
                        backgroundImage: `
                            linear-gradient(to bottom, rgba(21, 21, 21, 0.4) 0%, rgba(21, 21, 21, 0.7) 60%, #151515 100%),
                            linear-gradient(to right, rgba(21, 21, 21, 0.85) 0%, rgba(21, 21, 21, 0.2) 50%, rgba(21, 21, 21, 0.7) 100%),
                            url(${activeGame.background_image})
                        `,
                    }}
                />
            )}

            {/* 3. Content sitting on top in normal flow */}
            <div className='relative z-10'>
                <Navbar />
                <div className='flex items-start'>
                    <Sidebar />
                    <Outlet />
                    <div className='fixed z-50 bottom-2 right-2 '>
                        <ChatBot/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainLayout;
