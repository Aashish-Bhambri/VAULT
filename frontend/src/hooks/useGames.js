// src/hooks/useGames.js
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const useGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { selectedPlatform, selectedGenre, selectQuery, ordering, selectedDates } = useSelector(
    (state) => state.games
  );

  // 1. Reset page to 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
    setGames([]);
    setHasMore(true);
  }, [selectedPlatform, selectedGenre, selectQuery, ordering, selectedDates]);

  // 2. Fetch games (fresh fetch on page 1, append when page > 1)
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      const fetchGames = async () => {
        setIsLoading(true);
        setError('');
        try {
          const response = await api.get('/games', {
            signal: controller.signal,
            params: {
              page: page,
              page_size: 20,
              search: selectQuery?.trim() || undefined,
              parent_platforms: selectedPlatform || undefined,
              genres: selectedGenre || undefined,
              ordering: ordering || undefined,
              dates: selectedDates || undefined,
            },
          });

          const newGames = response.data.results || [];
          
          // Append if page > 1, replace if page === 1
          setGames((prev) => (page === 1 ? newGames : [...prev, ...newGames]));
          
          // Check if RAWG has another page
          setHasMore(Boolean(response.data.next));
        } catch (err) {
          if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
            setError(err.message || 'Failed to fetch games');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchGames();
    }, page === 1 && selectQuery ? 300 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, selectedPlatform, selectedGenre, selectQuery, ordering, selectedDates]);

  // Helper to load next page
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { games, error, isLoading, hasMore, loadMore };
};

export default useGames;
