import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router';
import useGameDetails from '../hooks/useGameDetails';
import GameCard from '../components/GameCard';
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
  FaPlus
} from 'react-icons/fa';
import { MdPhoneIphone } from 'react-icons/md';
import { BsGlobe, BsNintendoSwitch, BsGift, BsFolder } from 'react-icons/bs';

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

const GameDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const stateGame = location.state?.game || {};

  const { details, screenshots, series, isLoading, error } = useGameDetails(
    stateGame.id || slug
  );

  const [showMore, setShowMore] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);

  // Consolidated game data with fallback to stateGame
  const game = details || stateGame;
  const gameName = game.name || slug?.toUpperCase().replace(/-/g, ' ');

  // Screenshots array
  const allScreenshots =
    screenshots.length > 0
      ? screenshots.map((s) => s.image)
      : stateGame.short_screenshots?.map((s) => s.image) ||
        (game.background_image ? [game.background_image] : []);

  const featuredImage = activeMedia || allScreenshots[0] || game.background_image;

  // Format release date (e.g. "Nov 17, 2026")
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Metacritic score color
  const getMetacriticColor = (score) => {
    if (!score) return 'border-zinc-700 text-zinc-400 bg-zinc-800';
    if (score >= 75) return 'border-emerald-500 text-emerald-400 bg-emerald-950/40';
    if (score >= 50) return 'border-yellow-500 text-yellow-400 bg-yellow-950/40';
    return 'border-rose-500 text-rose-400 bg-rose-950/40';
  };

  // Top Rating label
  const getRatingSummary = () => {
    const top = game.ratings?.[0]?.title;
    if (top === 'exceptional') return { label: 'Exceptional', emoji: '🎯' };
    if (top === 'recommended' || (game.rating && game.rating >= 4))
      return { label: 'Recommended', emoji: '👍' };
    if (top === 'meh') return { label: 'Meh', emoji: '😐' };
    if (top === 'skip') return { label: 'Skip', emoji: '⛔' };
    return { label: 'Recommended', emoji: '👍' };
  };

  if (isLoading && !game.name) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-4 w-48 bg-zinc-800 rounded"></div>
        <div className="h-14 w-3/4 bg-zinc-800 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-28 bg-zinc-800 rounded-xl"></div>
            <div className="h-48 bg-zinc-800 rounded-xl"></div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-video bg-zinc-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !game.name) {
    return (
      <div className="p-8 text-center text-red-400">
        <p className="text-xl">Failed to load game details</p>
        <p className="text-sm text-zinc-500 mt-2">{error}</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700">
          Back to Home
        </Link>
      </div>
    );
  }

  const ratingSummary = getRatingSummary();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-4">
        <Link to="/" className="hover:text-white transition-colors">
          HOME
        </Link>
        <span>/</span>
        <Link to="/" className="hover:text-white transition-colors">
          GAMES
        </Link>
        <span>/</span>
        <span className="text-zinc-200 truncate max-w-xs sm:max-w-md">
          {gameName}
        </span>
      </nav>

      {/* 2. Top Header Metadata: Date & Platforms */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        {game.released && (
          <span className="bg-white text-black font-bold text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
            {formatDate(game.released)}
          </span>
        )}

        <div className="flex items-center gap-2.5 text-white text-base">
          {game.parent_platforms?.map(({ platform }) => {
            const Icon = platformIconMap[platform.slug];
            return Icon ? (
              <Icon key={platform.id} title={platform.name} className="opacity-90 hover:opacity-100" />
            ) : null;
          })}
        </div>

        {game.playtime ? (
          <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
            AVERAGE PLAYTIME: {game.playtime} HOURS
          </span>
        ) : null}
      </div>

      {/* 3. Main Game Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
        {gameName}
      </h1>

      {/* 4. Action Buttons Bar (Add to games, Wishlist, Collection) */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          className="bg-white hover:bg-zinc-200 text-black font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-lg transition-colors cursor-pointer"
        >
          <span>Add to</span>
          <span className="font-extrabold">My games</span>
          <span className="text-zinc-500 font-semibold">{game.added || ''}</span>
          <span className="bg-emerald-500 text-white rounded p-0.5 ml-1">
            <FaPlus size={10} />
          </span>
        </button>

        <button
          type="button"
          className="bg-[hsla(0,0%,100%,.1)] hover:bg-[hsla(0,0%,100%,.18)] text-white border border-white/10 font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <BsGift className="text-zinc-300" />
          <span>Add to</span>
          <span className="font-semibold text-zinc-300">Wishlist</span>
        </button>

        <button
          type="button"
          className="bg-[hsla(0,0%,100%,.1)] hover:bg-[hsla(0,0%,100%,.18)] text-white border border-white/10 font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <BsFolder className="text-zinc-300" />
          <span>Save to</span>
          <span className="font-semibold text-zinc-300">Collection</span>
        </button>
      </div>

      {/* 5. Rating Headline & Segmented Rating Bar */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            {ratingSummary.label} <span className="text-2xl">{ratingSummary.emoji}</span>
          </span>
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider underline cursor-pointer hover:text-white">
            {game.ratings_count || game.reviews_count || 0} RATINGS
          </span>
        </div>

        {/* RAWG Segmented Color Bar */}
        {game.ratings && game.ratings.length > 0 ? (
          <div>
            <div className="w-full h-8 flex rounded-md overflow-hidden shadow-inner my-2">
              {game.ratings.map((r) => {
                const colorMap = {
                  exceptional: 'bg-emerald-500 hover:brightness-110',
                  recommended: 'bg-blue-500 hover:brightness-110',
                  meh: 'bg-amber-500 hover:brightness-110',
                  skip: 'bg-rose-500 hover:brightness-110',
                };
                return (
                  <div
                    key={r.id}
                    style={{ width: `${r.percent}%` }}
                    className={`${colorMap[r.title] || 'bg-zinc-600'} transition-all`}
                    title={`${r.title.toUpperCase()}: ${r.count} (${r.percent}%)`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold mt-2.5">
              {game.ratings.map((r) => {
                const dotMap = {
                  exceptional: 'bg-emerald-500',
                  recommended: 'bg-blue-500',
                  meh: 'bg-amber-500',
                  skip: 'bg-rose-500',
                };
                return (
                  <div key={r.id} className="flex items-center gap-1.5 capitalize text-zinc-300">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotMap[r.title] || 'bg-zinc-400'}`}></span>
                    <span>{r.title}</span>
                    <span className="text-zinc-500">{r.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* 6. Two-Column Layout: Left (Info & About) + Right (Media Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: About & Info Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">About</h2>
            <div
              className={`text-zinc-300 text-sm leading-relaxed prose prose-invert max-w-none transition-all ${
                !showMore ? 'line-clamp-6' : ''
              }`}
              dangerouslySetInnerHTML={{
                __html: details?.description || game.description || 'No description available for this game.',
              }}
            />
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="mt-3 inline-block bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors"
            >
              {showMore ? 'Show less' : 'Read more'}
            </button>
          </div>

          {/* 2-Column Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-6 border-t border-zinc-800/80">
            {/* Platforms */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Platforms</h3>
              <p className="text-sm text-zinc-200">
                {game.platforms?.map((p) => p.platform.name).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Metascore */}
            {game.metacritic ? (
              <div>
                <h3 className="text-xs text-zinc-500 font-semibold mb-1">Metascore</h3>
                <span
                  className={`inline-block font-bold text-xs px-2 py-0.5 rounded border ${getMetacriticColor(
                    game.metacritic
                  )}`}
                >
                  {game.metacritic}
                </span>
              </div>
            ) : null}

            {/* Genre */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Genre</h3>
              <p className="text-sm text-zinc-200">
                {game.genres?.map((g) => g.name).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Release Date */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Release date</h3>
              <p className="text-sm text-zinc-200">{formatDate(game.released)}</p>
            </div>

            {/* Developer */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Developer</h3>
              <p className="text-sm text-zinc-200">
                {game.developers?.map((d) => d.name).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Publisher */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Publisher</h3>
              <p className="text-sm text-zinc-200">
                {game.publishers?.map((pub) => pub.name).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Age Rating */}
            <div>
              <h3 className="text-xs text-zinc-500 font-semibold mb-1">Age rating</h3>
              <p className="text-sm text-zinc-200">{game.esrb_rating?.name || 'Not rated'}</p>
            </div>

            {/* Website */}
            {game.website && (
              <div>
                <h3 className="text-xs text-zinc-500 font-semibold mb-1">Website</h3>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-200 underline hover:text-white truncate block"
                >
                  {game.website}
                </a>
              </div>
            )}
          </div>

          {/* Tags Cloud */}
          {game.tags && game.tags.length > 0 && (
            <div className="pt-6 border-t border-zinc-800/80">
              <h3 className="text-xs text-zinc-500 font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.slice(0, 15).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs text-zinc-300 border border-zinc-700/60 bg-zinc-800/40 hover:bg-zinc-700/60 hover:text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Media Showcase Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-4">
          {/* Main Featured Showcase Image */}
          {featuredImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl">
              <img
                src={featuredImage}
                alt={gameName}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
          )}

          {/* Secondary Screenshots Grid */}
          {allScreenshots.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {allScreenshots.slice(0, 6).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveMedia(imgUrl)}
                  className={`aspect-video overflow-hidden rounded-xl bg-zinc-800 border cursor-pointer transition-all duration-200 hover:scale-102 ${
                    featuredImage === imgUrl
                      ? 'border-white ring-2 ring-white/50'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 7. Franchise / Games in the Series Section */}
      {series && series.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-800/80">
          <h2 className="text-3xl font-extrabold text-white mb-6 tracking-wide">
            Games in the series
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {series.map((seriesGame) => (
              <GameCard key={seriesGame.id} game={seriesGame} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;