import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setPlatform, setGenre, setCategory, resetFilters } from '../app/features/gameSlice';
import useGenres from '../hooks/useGenres';
import usePlatforms from '../hooks/usePlatforms';
import {
    BsChevronDown,
    BsChevronUp,
} from 'react-icons/bs';
import {
    FaStar,
    FaFire,
    FaFastForward,
    FaTrophy,
    FaChartBar,
    FaCrown,
} from 'react-icons/fa';

// Authentic RAWG Calendar 31 badge icon
const Calendar31Icon = () => (
    <div className='w-4 h-4 border border-current rounded-[3px] flex flex-col items-center justify-center font-bold relative overflow-hidden'>
        <div className='w-full h-[3.5px] bg-current opacity-90'></div>
        <span className='text-[8px] leading-none font-black tracking-tighter mt-[1px]'>31</span>
    </div>
);

// Date calculation helpers
const getLast30DaysRange = () => {
    const today = new Date().toISOString().split('T')[0];
    const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return `${past},${today}`;
};

const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diffMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date().setDate(diffMonday)).toISOString().split('T')[0];
    const sunday = new Date(new Date().setDate(diffMonday + 6)).toISOString().split('T')[0];
    return `${monday},${sunday}`;
};

const getNextWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const diffMonday = now.getDate() - day + (day === 0 ? 1 : 8);
    const nextMonday = new Date(new Date().setDate(diffMonday)).toISOString().split('T')[0];
    const nextSunday = new Date(new Date().setDate(diffMonday + 6)).toISOString().split('T')[0];
    return `${nextMonday},${nextSunday}`;
};

const getCurrentYearRange = () => {
    const year = new Date().getFullYear();
    return `${year}-01-01,${year}-12-31`;
};

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedPlatform = useSelector((state) => state.games.selectedPlatform);
    const selectedGenre = useSelector((state) => state.games.selectedGenre);
    const activeNavItem = useSelector((state) => state.games.activeNavItem || 'home');

    const [genres] = useGenres();
    const [platforms] = usePlatforms();

    const [genreExpanded, setGenreExpanded] = useState(false);
    const [platformExpanded, setPlatformExpanded] = useState(false);

    const handleHomeClick = () => {
        dispatch(resetFilters());
        navigate('/');
    };

    const handleReviewsClick = () => {
        dispatch(
            setCategory({
                title: 'Top Rated Games',
                ordering: '-rating',
                navItem: 'reviews',
            })
        );
        navigate('/');
    };

    const handleAllGamesClick = () => {
        dispatch(
            setCategory({
                title: 'All Games',
                ordering: '',
                dates: null,
                navItem: 'all-games',
            })
        );
        navigate('/');
    };

    const handlePlatformClick = (platform) => {
        const idStr = String(platform.id);
        if (selectedPlatform === idStr) {
            dispatch(setPlatform(null));
        } else {
            dispatch(
                setCategory({
                    title: `${platform.name} Games`,
                    platform: idStr,
                    navItem: `platform-${idStr}`,
                })
            );
        }
        navigate('/');
    };

    const handleGenreClick = (genre) => {
        if (selectedGenre === genre.slug) {
            dispatch(setGenre(null));
        } else {
            dispatch(
                setCategory({
                    title: `${genre.name} Games`,
                    genre: genre.slug,
                    navItem: `genre-${genre.slug}`,
                })
            );
        }
        navigate('/');
    };

    // RAWG new releases definitions
    const newReleases = [
        {
            id: 'last-30-days',
            label: 'Last 30 days',
            icon: FaStar,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'Last 30 days',
                        dates: getLast30DaysRange(),
                        ordering: '-released',
                        navItem: 'last-30-days',
                    })
                );
                navigate('/');
            },
        },
        {
            id: 'this-week',
            label: 'This week',
            icon: FaFire,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'This week',
                        dates: getThisWeekRange(),
                        ordering: '-released',
                        navItem: 'this-week',
                    })
                );
                navigate('/');
            },
        },
        {
            id: 'next-week',
            label: 'Next week',
            icon: FaFastForward,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'Next week',
                        dates: getNextWeekRange(),
                        ordering: '-released',
                        navItem: 'next-week',
                    })
                );
                navigate('/');
            },
        },
        {
            id: 'release-calendar',
            label: 'Release calendar',
            icon: Calendar31Icon,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'Release calendar',
                        dates: getCurrentYearRange(),
                        ordering: '-released',
                        navItem: 'release-calendar',
                    })
                );
                navigate('/');
            },
        },
    ];

    // RAWG top items definitions
    const topItems = [
        {
            id: 'best-of-year',
            label: 'Best of the year',
            icon: FaTrophy,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'Best of the year',
                        dates: getCurrentYearRange(),
                        ordering: '-rating',
                        navItem: 'best-of-year',
                    })
                );
                navigate('/');
            },
        },
        {
            id: 'popular-2025',
            label: 'Popular in 2025',
            icon: FaChartBar,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'Popular in 2025',
                        dates: '2025-01-01,2025-12-31',
                        ordering: '-added',
                        navItem: 'popular-2025',
                    })
                );
                navigate('/');
            },
        },
        {
            id: 'all-time-top-250',
            label: 'All time top 250',
            icon: FaCrown,
            onClick: () => {
                dispatch(
                    setCategory({
                        title: 'All time top 250',
                        ordering: '-rating',
                        navItem: 'all-time-top-250',
                    })
                );
                navigate('/');
            },
        },
    ];

    return (
        <aside
            className='sticky top-4 max-h-[calc(100vh-2rem)] w-60 shrink-0 self-start overflow-y-auto no-scrollbar text-white pr-4 pl-8 py-2 select-none'
        >
            <div className='flex flex-col gap-6'>
                {/* 1. Primary Headers */}
                <div className='flex flex-col gap-2.5'>
                    <h2
                        onClick={handleHomeClick}
                        className={`text-2xl font-bold tracking-tight cursor-pointer transition-colors ${
                            activeNavItem === 'home'
                                ? 'text-white font-extrabold'
                                : 'text-neutral-200 hover:text-neutral-400'
                        }`}
                    >
                        Home
                    </h2>
                    <h2
                        onClick={handleReviewsClick}
                        className={`text-2xl font-bold tracking-tight cursor-pointer transition-colors ${
                            activeNavItem === 'reviews'
                                ? 'text-white font-extrabold'
                                : 'text-neutral-200 hover:text-neutral-400'
                        }`}
                    >
                        Reviews
                    </h2>
                </div>

                {/* 2. New Releases Section */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-2xl font-bold tracking-tight text-white hover:text-neutral-400 transition-colors cursor-pointer'>
                        New Releases
                    </h3>
                    <ul className='flex flex-col gap-1 mt-1'>
                        {newReleases.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeNavItem === item.id;
                            return (
                                <li
                                    key={item.id}
                                    onClick={item.onClick}
                                    className={`flex items-center gap-3 py-1 px-1 rounded-lg cursor-pointer transition-all duration-150 group ${
                                        isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
                                    }`}
                                >
                                    {/* RAWG Signature Box: white on hover/active, dark grey default */}
                                    <span
                                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all duration-150 ${
                                            isActive
                                                ? 'bg-white text-black font-bold shadow-sm'
                                                : 'bg-[#202020] text-neutral-300 group-hover:bg-white group-hover:text-black'
                                        }`}
                                    >
                                        <Icon />
                                    </span>
                                    <span
                                        className={`text-[15px] font-normal leading-snug transition-colors ${
                                            isActive
                                                ? 'text-white font-semibold underline'
                                                : 'text-neutral-300 group-hover:text-white group-hover:underline'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* 3. Top Section */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-2xl font-bold tracking-tight text-white hover:text-neutral-400 transition-colors cursor-pointer'>
                        Top
                    </h3>
                    <ul className='flex flex-col gap-1 mt-1'>
                        {topItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeNavItem === item.id;
                            return (
                                <li
                                    key={item.id}
                                    onClick={item.onClick}
                                    className={`flex items-center gap-3 py-1 px-1 rounded-lg cursor-pointer transition-all duration-150 group ${
                                        isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
                                    }`}
                                >
                                    {/* RAWG Signature Box: white on hover/active, dark grey default */}
                                    <span
                                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all duration-150 ${
                                            isActive
                                                ? 'bg-white text-black font-bold shadow-sm'
                                                : 'bg-[#202020] text-neutral-300 group-hover:bg-white group-hover:text-black'
                                        }`}
                                    >
                                        <Icon />
                                    </span>
                                    <span
                                        className={`text-[15px] font-normal leading-snug transition-colors ${
                                            isActive
                                                ? 'text-white font-semibold underline'
                                                : 'text-neutral-300 group-hover:text-white group-hover:underline'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* 4. All Games Header */}
                <h2
                    onClick={handleAllGamesClick}
                    className={`text-2xl font-bold tracking-tight cursor-pointer transition-colors ${
                        activeNavItem === 'all-games'
                            ? 'text-white font-extrabold'
                            : 'text-neutral-200 hover:text-neutral-400'
                    }`}
                >
                    All Games
                </h2>

                {/* 5. Platforms Section */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-2xl font-bold tracking-tight text-white hover:text-neutral-400 transition-colors cursor-pointer'>
                        Platforms
                    </h3>
                    <ul className='flex flex-col gap-1.5 mt-1'>
                        {platforms.slice(0, platformExpanded ? 10 : 4).map((platform) => {
                            const isSelected = selectedPlatform === String(platform.id);
                            return (
                                <li
                                    key={platform.id}
                                    onClick={() => handlePlatformClick(platform)}
                                    className={`flex items-center gap-3 py-1 px-1 rounded-lg cursor-pointer transition-all group ${
                                        isSelected
                                            ? 'bg-white/10 text-white font-bold'
                                            : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <img
                                        src={platform.image_background}
                                        alt={platform.name}
                                        className={`w-8 h-8 rounded-md object-cover overflow-hidden bg-neutral-800 transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                                            isSelected ? 'ring-2 ring-white/60 brightness-110' : 'brightness-90 group-hover:brightness-110'
                                        }`}
                                    />
                                    <span
                                        className={`text-[15px] font-normal transition-colors ${
                                            isSelected ? 'underline font-semibold text-white' : 'group-hover:underline text-neutral-300 group-hover:text-white'
                                        }`}
                                    >
                                        {platform.name}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Show all / Hide toggle with arrow button */}
                    <button
                        type='button'
                        onClick={() => setPlatformExpanded(!platformExpanded)}
                        className='flex items-center gap-2.5 py-1 px-1 text-xs text-neutral-400 hover:text-white cursor-pointer transition-colors group mt-0.5'
                    >
                        <span className='w-7 h-7 rounded-md bg-[#202020] group-hover:bg-[#303030] flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors shadow-sm'>
                            {platformExpanded ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
                        </span>
                        <span className='font-semibold text-[13px]'>
                            {platformExpanded ? 'Hide' : 'Show all'}
                        </span>
                    </button>
                </div>

                {/* 6. Genres Section */}
                <div className='flex flex-col gap-2'>
                    <h3 className='text-2xl font-bold tracking-tight text-white hover:text-neutral-400 transition-colors cursor-pointer'>
                        Genres
                    </h3>
                    <ul className='flex flex-col gap-1.5 mt-1'>
                        {genres.slice(0, genreExpanded ? 12 : 4).map((genre) => {
                            const isSelected = selectedGenre === genre.slug;
                            return (
                                <li
                                    key={genre.id}
                                    onClick={() => handleGenreClick(genre)}
                                    className={`flex items-center gap-3 py-1 px-1 rounded-lg cursor-pointer transition-all group ${
                                        isSelected
                                            ? 'bg-white/10 text-white font-bold'
                                            : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <img
                                        src={genre.image_background}
                                        alt={genre.name}
                                        className={`w-8 h-8 rounded-md object-cover overflow-hidden bg-neutral-800 transition-transform duration-200 group-hover:scale-105 shadow-sm ${
                                            isSelected ? 'ring-2 ring-white/60 brightness-110' : 'brightness-90 group-hover:brightness-110'
                                        }`}
                                    />
                                    <span
                                        className={`text-[15px] font-normal transition-colors ${
                                            isSelected ? 'underline font-semibold text-white' : 'group-hover:underline text-neutral-300 group-hover:text-white'
                                        }`}
                                    >
                                        {genre.name}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Show all / Hide toggle with arrow button */}
                    <button
                        type='button'
                        onClick={() => setGenreExpanded(!genreExpanded)}
                        className='flex items-center gap-2.5 py-1 px-1 text-xs text-neutral-400 hover:text-white cursor-pointer transition-colors group mt-0.5'
                    >
                        <span className='w-7 h-7 rounded-md bg-[#202020] group-hover:bg-[#303030] flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors shadow-sm'>
                            {genreExpanded ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
                        </span>
                        <span className='font-semibold text-[13px]'>
                            {genreExpanded ? 'Hide' : 'Show all'}
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

