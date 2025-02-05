'use client';

import { useState, useEffect } from 'react';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [lastTankUpdate, setLastTankUpdate] = useState<string | null>(null);
    const [lastTankDelete, setLastTankDelete] = useState<string | null>(null);
    const [lastEquipmentUpdate, setLastEquipmentUpdate] = useState<string | null>(null);
    const [lastEquipmentDelete, setLastEquipmentDelete] = useState<string | null>(null);

    const fetchLastUpdates = async () => {
        try {
            const tankResponse = await fetch('../api/data/getLastTankSync');
            const tankResult = await tankResponse.json();
            if (tankResponse.ok && tankResult.success) {
                setLastTankUpdate(tankResult.lastUpdate);
                setLastTankDelete(tankResult.lastDelete);
            } else {
                setLastTankUpdate(null);
                setLastTankDelete(null);
            }

            const equipmentResponse = await fetch('../api/data/getLastEquipmentSync');
            const equipmentResult = await equipmentResponse.json();
            if (equipmentResponse.ok && equipmentResult.success) {
                setLastEquipmentUpdate(equipmentResult.lastUpdate);
                setLastEquipmentDelete(equipmentResult.lastDelete);
            } else {
                setLastEquipmentUpdate(null);
                setLastEquipmentDelete(null);
            }
        } catch (error) {
            console.error('Failed to fetch last updates:', error);
            setLastTankUpdate(null);
            setLastEquipmentUpdate(null);
            setLastTankDelete(null);
            setLastEquipmentDelete(null);
        }
    };

    useEffect(() => {
        fetchLastUpdates();
    }, []);

    const handleUpdateTanks = async () => {
        await handleUpdate('../api/data/syncTanks', 'Tank data updated successfully!');
    };

    const handleUpdateEquipment = async () => {
        await handleUpdate('../api/data/syncEquipment', 'Equipment data updated successfully!');
    };

    const handleUpdate = async (apiUrl: string, successMessage: string) => {
        setLoading(true);
        setMessage('');
        setMessageColor('');

        try {
            const response = await fetch(apiUrl, { method: 'POST' });
            const result = await response.json();

            if (response.ok && result.success) {
                setMessage(successMessage);
                setMessageColor('text-green-500');

                await fetchLastUpdates();
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

    const handleDeleteTanks = async () => {
        await handleDelete('../api/data/syncTanks', 'Tank data deleted successfully!');
    };

    const handleDeleteEquipment = async () => {
        await handleDelete('../api/data/syncEquipment', 'Equipment data deleted successfully!');
    };

    const handleDelete = async (apiUrl: string, successMessage: string) => {
        setLoading(true);
        setMessage('');
        setMessageColor('');

        try {
            const response = await fetch(apiUrl, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok && result.success) {
                setMessage(successMessage);
                setMessageColor('text-green-500');

                await fetchLastUpdates();
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
                <p className="font-bold text-xl text-white">Update Tank Records in Database from API</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={handleUpdateTanks}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'UPDATE'}
                </button>
                <p className="text-gray-200">Last update: {lastTankUpdate ? lastTankUpdate : 'No updates yet'}</p>
            </div>

            <div className="flex flex-row space-x-4 items-center ml-10 mt-5">
                <p className="font-bold text-xl text-white">Update Equipment Records in Database from API</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={handleUpdateEquipment}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'UPDATE'}
                </button>
                <p className="text-gray-200">Last update: {lastEquipmentUpdate ? lastEquipmentUpdate : 'No updates yet'}</p>
            </div>

            <div className="flex flex-row space-x-4 items-center ml-10 mt-5">
                <p className="font-bold text-xl text-white">Delete all tank records from database (tanklist table)</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={handleDeleteTanks}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'DELETE'}
                </button>
                <p className="text-gray-200">Last update: {lastTankDelete ? lastTankDelete : 'No updates yet'}</p>
            </div>

            <div className="flex flex-row space-x-4 items-center ml-10 mt-5">
                <p className="font-bold text-xl text-white">Delete all equipment records from database (equipmentlist table)</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={handleDeleteEquipment}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'DELETE'}
                </button>
                <p className="text-gray-200">Last update: {lastEquipmentDelete ? lastEquipmentDelete : 'No updates yet'}</p>
            </div>

            <div className="flex flex-row space-x-4 items-center ml-10 mt-5">
                <p className="font-bold text-xl text-white">Result: </p>
                {message && <p className={`font-bold text-xl ${messageColor}`}>{message}</p>}
            </div>
        </div>
    );
}
