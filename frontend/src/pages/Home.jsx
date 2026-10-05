// src/pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import useGames from '../hooks/useGames';
import GameCard from '../components/GameCard';
import Filter from '../components/Filter';
import { useSelector } from 'react-redux';
import ChatBot from '../components/ChatBot';

const Home = () => {
  const { games, error, isLoading, hasMore, loadMore } = useGames();
  const group = useSelector((state) => state.display.isGroup);
  const categoryTitle = useSelector((state) => state.games.categoryTitle);
  const bottomRef = useRef(null);

  // IntersectionObserver detects when user scrolls to bottomRef
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the bottom div is visible on screen, load more
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (error) {
    return <div className="p-6 text-red-400">Error: {error}</div>;
  }

  return (
    <>
      <div className="px-2 flex flex-col w-full">
        <div className="font-bold text-7xl mb-4 tracking-tight">{categoryTitle || 'New and trending'}</div>
        <Filter />

        <div className="w-full flex items-center flex-col">
          {group ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex items-center w-[50%]">
              <div className="grid grid-cols-1 gap-6 w-full">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sentinel element to trigger next page load */}
        <div ref={bottomRef} className="h-20 flex justify-center items-center my-6">
          {isLoading && (
            <div className="text-zinc-400 text-lg animate-pulse">
              Loading more games...
            </div>
          )}
          {!hasMore && games.length > 0 && (
            <div className="text-zinc-500 text-sm">
              You have reached the end of the list.
            </div>
          )}
        </div>

      </div>
      

    </>
  );
};

export default Home;
