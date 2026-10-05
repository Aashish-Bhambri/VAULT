// src/components/GameCard.jsx
import React from 'react';
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid
} from 'react-icons/fa';
import { MdPhoneIphone } from 'react-icons/md';
import { BsGlobe, BsNintendoSwitch } from 'react-icons/bs';
import ImageSlider from './ImageSlider';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setGameId } from '../app/features/gameDetailSlice';

// Helper to map platform slugs to react-icons
const platformIconMap = {
  pc: FaWindows,
  playstation: FaPlaystation,
  xbox: FaXbox,
  nintendo: BsNintendoSwitch,
  mac: FaApple,
  linux: FaLinux,
  android: FaAndroid,
  ios: MdPhoneIphone,
  web: BsGlobe,
};

const GameCard = ({ game }) => {
  const navigation =useNavigate();
  const group = useSelector(state => state.display.isGroup);
  const gameDetail= useSelector(state=>state.display.gameID);
  const dispatch =useDispatch();
  const single= useSelector(state=>state.display.isSingle)
  const handleNavigation = () => {
    navigation(`/games/${game.slug}`, {
      state: { game },
    });
  };
  const handleGameId = () => {
    dispatch(setGameId(game.id));
    handleNavigation();
  };


  const getScoreBadgeColor = (score) => {
    if (!score) return 'bg-zinc-800 text-zinc-400';
    if (score > 75) return 'border-emerald-500 text-emerald-400 bg-emerald-950/40';
    if (score > 60) return 'border-yellow-500 text-yellow-400 bg-yellow-950/40';
    return 'border-zinc-600 text-zinc-400 bg-zinc-800';
  };

  return (
    /* 1. Kept the parent container as 'group' and fixed invalid/unnecessary transitional syntax here */
    <div className="group relative z-10 hover:z-30">

      {/* 2. Main Card Body */}
      <div className="bg-[#202020] rounded-xl shadow-lg transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-2xl relative group-hover:rounded-b-none flex flex-col">


        
        {/* Game Image */}

        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-zinc-800">
          <ImageSlider
            screenshots={game.short_screenshots}
            defaultImage={game.background_image}
            alt={game.name}
          />
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-3">
          {/* Platforms & Metascore */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-zinc-400 text-sm">
              {game.parent_platforms?.map(({ platform }) => {
                const Icon = platformIconMap[platform.slug];
                return Icon ? <Icon key={platform.id} title={platform.name} /> : null;
              })}
            </div>

            {game.metacritic && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${getScoreBadgeColor(
                  game.metacritic
                )}`}
              >
                {game.metacritic}
              </span>
            )}
          </div>

          {/* Game Title */}
          <h2 className="text-xl font-bold text-white tracking-wide hover:text-zinc-300 transition-colors line-clamp-2"
            onClick={handleGameId}
          >
            {game.name}
          </h2>
        </div>


        {
          group ?
            <>
              {/* 3. Smoothly Transitioned Floating Details Panel */}
              <div className="absolute top-full left-0 w-full p-4 pt-2 flex flex-col gap-2 bg-[#202020] rounded-b-xl shadow-2xl border-t border-zinc-700/40 text-xs text-zinc-400 pointer-events-none transition-all duration-300 ease-out opacity-0 translate-y-[-10px] invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:pointer-events-auto">
                {game.released && (
                  <div className="flex justify-between items-center">
                    <span>Release date:</span>
                    <span className="text-zinc-200">{game.released}</span>
                  </div>
                )}
                {game.genres && game.genres.length > 0 && (
                  <div className="flex justify-between items-center gap-2">
                    <span>Genres:</span>
                    <span className="text-zinc-200 text-right truncate">
                      {game.genres.map((g) => g.name).join(', ')}
                    </span>
                  </div>
                )}
                {game.rating ? (
                  <div className="flex justify-between items-center">
                    <span>Rating:</span>
                    <span className="text-zinc-200">★ {game.rating}</span>
                  </div>
                ) : null}
              </div>
            </>
            : ''
        }

      </div>
    </div>
  );
};

export default GameCard;
