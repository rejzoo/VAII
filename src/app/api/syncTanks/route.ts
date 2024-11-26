import { NextResponse } from 'next/server';

export async function GET() {
    const url = `https://api.worldoftanks.eu/wot/encyclopedia/vehicles/?application_id=${process.env.WARGAMING_API_KEY}`
    console.log("GET");

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error('Failed to fetch data from Wargaming API');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching tanks:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}