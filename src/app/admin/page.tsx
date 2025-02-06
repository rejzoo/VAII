'use client';

import { useState, useEffect } from 'react';
import '@/app/styles/AdminPage.css';
import { validateText } from '../utils/validators/validators';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageBlog, setMessageBlog] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [lastTankUpdate, setLastTankUpdate] = useState<string | null>(null);
    const [lastTankDelete, setLastTankDelete] = useState<string | null>(null);
    const [lastEquipmentUpdate, setLastEquipmentUpdate] = useState<string | null>(null);
    const [lastEquipmentDelete, setLastEquipmentDelete] = useState<string | null>(null);

    const [blogHeader, setBlogHeader] = useState("");
    const [blogText, setBlogText] = useState("");

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

    const handleBlogSubmit = async () => {

        if (!validateText(blogHeader) || !validateText(blogText)) {
            setMessageBlog("Illegal characters.")
            setMessageColor('text-red-500');
            return;
        }

        setLoading(true);
        setMessageBlog("");

        try {
            const response = await fetch("/api/blogs/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blogHeader, blogText }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessageBlog(result.message);
                setMessageColor("text-green-500");
                setBlogHeader("");
                setBlogText("");
            } else {
                setMessageBlog(result.error);
                setMessageColor("text-red-500");
            }
        } catch (error) {
            setMessageBlog("Unexpected error occurred.");
            setMessageColor("text-red-500");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="section">
                <p className='text-bold'>Update Tank Records in Database from API</p>
                <button className="button" onClick={handleUpdateTanks} disabled={loading}>
                    {loading ? 'Updating...' : 'UPDATE'}
                </button>
                <p className="status-text">Last update: {lastTankUpdate ? lastTankUpdate : 'No updates yet'}</p>
            </div>

            <div className="section">
                <p className='text-bold'>Update Equipment Records in Database from API</p>
                <button className="button" onClick={handleUpdateEquipment} disabled={loading}>
                    {loading ? 'Updating...' : 'UPDATE'}
                </button>
                <p className="status-text">Last update: {lastEquipmentUpdate ? lastEquipmentUpdate : 'No updates yet'}</p>
            </div>

            <div className="section">
                <p className='text-bold'>Delete all tank records from database (tanklist table)</p>
                <button className="button" onClick={handleDeleteTanks} disabled={loading}>
                    {loading ? 'Updating...' : 'DELETE'}
                </button>
                <p className="status-text">Last update: {lastTankDelete ? lastTankDelete : 'No updates yet'}</p>
            </div>

            <div className="section">
                <p className='text-bold'>Delete all equipment records from database (equipmentlist table)</p>
                <button className="button" onClick={handleDeleteEquipment} disabled={loading}>
                    {loading ? 'Updating...' : 'DELETE'}
                </button>
                <p className="status-text">Last update: {lastEquipmentDelete ? lastEquipmentDelete : 'No updates yet'}</p>
            </div>

            <div className="section">
                <p className='text-bold'>Result:</p>
                {message && <p className={`font-bold text-xl ${messageColor}`}>{message}</p>}
            </div>

            <div className="container">
                <h2>Add new blog</h2>
                <input
                    type="text"
                    placeholder="Enter Header"
                    className="input-field"
                    value={blogHeader}
                    onChange={(e) => setBlogHeader(e.target.value)}
                />
                <textarea
                    placeholder="Enter Text"
                    className="textarea-field"
                    value={blogText}
                    onChange={(e) => setBlogText(e.target.value)}
                />
                <button onClick={handleBlogSubmit} className="submit-button" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
                {messageBlog && <p className={`message ${messageColor}`}>{messageBlog}</p>}
            </div>
        </div>
    );
}

