// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, resetFilters } from '../app/features/gameSlice';
import { logout } from '../app/features/authSlice'; // <--- 1. Import logout

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reduxQuery = useSelector((state) => state.games.selectQuery);

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // 1. Local state for instant typing responsiveness
    const [searchTerm, setSearchTerm] = useState(reduxQuery || '');

    // 2. Debounce: dispatch to Redux only after 400ms of inactivity
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setSearchQuery(searchTerm));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, dispatch]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch(setSearchQuery(searchTerm));
            navigate('/');
        }
    };

    const handleLogoClick = () => {
        setSearchTerm('');
        dispatch(resetFilters());
        navigate('/');
    };

    // 2. Logout handler
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <div className='flex justify-between px-8 py-5 gap-8 items-center z-20 relative'>
            <div
                className='font-black tracking-[4px] text-xl cursor-pointer text-white hover:text-neutral-300 transition-colors select-none'
                onClick={handleLogoClick}
            >
                VAULT
            </div>
            <div className='flex items-center w-full h-12 bg-[hsla(0,0%,100%,.16)] rounded-4xl p-2 px-6 '>
                <BsSearch />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='w-full p-3 rounded-4xl outline-none bg-transparent text-white'
                    placeholder='Search games...'
                />
            </div>
            <div className="flex items-center gap-4 text-white text-sm font-semibold shrink-0">
                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <span className="text-neutral-300">Hi, {user?.username}</span>
                        <button
                            onClick={handleLogout}
                            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hover:underline cursor-pointer"
                        >
                            LOG IN
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="hover:underline cursor-pointer"
                        >
                            SIGN UP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
