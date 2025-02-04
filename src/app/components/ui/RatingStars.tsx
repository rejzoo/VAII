'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';

interface RatingStarsProps {
    tankID: number;
    readOnly?: boolean;
}

export default function RatingStars({ tankID, readOnly = false }: RatingStarsProps) {
    const { isLoggedIn } = useAuth();
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(`../../api/tanks/rating/${tankID}`, { method: 'GET' });
                const result = await response.json();

                if (result.success) {
                    setRating(readOnly ? Math.round(result.avgRating) : result.userRating || 0);
                } else {
                    console.error('Error fetching rating:', result.error);
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [tankID, readOnly, isLoggedIn]);

    const getStarColor = () => {
        return ['text-red-500', 'text-yellow-400', 'text-green-400', 'text-blue-400', 'text-purple-400'][rating - 1] || 'text-gray-400';
    };

    const handleRating = async (newRating: number) => {
        if (readOnly) return;
        if (!isLoggedIn) return alert('You need to be logged in to rate!');

        setRating(newRating);
        console.log(newRating);
        let rating = newRating;
        try {
            const response = await fetch(`/api/tanks/rating/${tankID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tankID, rating }),
            });

            const result = await response.json();
            if (!result.success) {
                console.error('Error saving rating:', result.error);
            }

        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleDelete = async () => {
        if (!isLoggedIn) return alert('You need to be logged in to delete your rating!');

        try {
            const response = await fetch(`/api/tanks/rating/${tankID}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                setRating(0);
            } else {
                console.error('Error deleting rating:', result.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className="flex items-center space-x-1">
            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : (
                <>
                    {!readOnly && rating > 0 && (
                        <button
                            onClick={handleDelete}
                            className="ml-3 text-red-500 hover:text-red-700 transition mr-3"
                            title="Delete Rating"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}

                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <FontAwesomeIcon
                                icon={faStar}
                                key={index}
                                className={`cursor-pointer transition ${starValue <= rating ? getStarColor() : 'text-gray-400'} ${
                                    readOnly ? 'cursor-default' : 'cursor-pointer'
                                }`}
                                onClick={() => !readOnly && handleRating(starValue)}
                                onMouseEnter={() => !readOnly && setHover(starValue)}
                                onMouseLeave={() => !readOnly && setHover(null)}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}
