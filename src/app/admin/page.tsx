'use client'

import { useState, useEffect } from 'react';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch('../api/getLastTankSync');
                const result = await response.json();

                if (response.ok && result.success) {
                    setLastUpdate(result.lastUpdate);
                } else {
                    setLastUpdate(null);
                }
            } catch (error) {
                console.error('Failed to fetch last update:', error);
                setLastUpdate(null);
            }
        };

        fetchLastUpdate();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        setMessage('');
        setMessageColor('');

        try {
            const response = await fetch('../api/syncTanks', {
                method: 'POST',
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessage('Data updated successfully!');
                setMessageColor('text-green-500');
            } else {
                setMessage(`Error updating data: ${result.error}`);
                setMessageColor('text-red-500');
            }
        } catch (error) {
            setMessage(`Unexpected error: ${(error as Error).message}`);
            setMessageColor('text-red-500');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-row space-x-4 items-center ml-10 mt-10">
                <p className="font-bold text-xl text-white">Update tanks records in database from API</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'UPDATE'}
                </button>
                <p className="text-gray-200">Last update: {lastUpdate ? lastUpdate : 'No updates yet'}</p>
            </div>

            <div className="flex flex-row space-x-4 items-center ml-10 mt-5">
                <p className="font-bold text-xl text-white">Result: </p>
                {message && <p className={`font-bold text-xl ${messageColor}`}>{message}</p>}
            </div>
        </div>
    )
}