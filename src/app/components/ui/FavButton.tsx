'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface FavoriteTankToggleProps {
  tankId: number;
}

export default function FavoriteTankToggle({ tankId }: FavoriteTankToggleProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch('/api/data/favouriteTank/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tankId }),
        });
        const { isFavorite } = await response.json();
        setIsFavorite(isFavorite);
      } catch (error) {
        console.error('Error fetching favorite tank status:', error);
      }
    };
    fetchFavoriteStatus();
  }, [tankId]);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const action = isFavorite ? 'remove' : 'add';
      const response = await fetch(`/api/data/favouriteTank/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tankId }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to toggle favorite');
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite tank:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center justify-center w-10 h-10 rounded-full ${
        loading ? 'cursor-wait' : 'hover:bg-yellow-50'
      }`}
      aria-label="Toggle Favorite Tank"
      disabled={loading}
    >
      <FontAwesomeIcon
        icon={faStar}
        className={`w-8 h-8 ${isFavorite ? 'text-yellow-300' : 'text-gray-400'}`}
      />
    </button>
  );
}
