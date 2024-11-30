'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function FavoriteToggle() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-yellow-50"
      aria-label="Toggle Favorite"
    >
      <FontAwesomeIcon
        icon={faStar}
        className={`w-8 h-8 ${isFavorite ? 'text-yellow-300' : 'text-gray-400'}`}
      />
    </button>
  );
}
