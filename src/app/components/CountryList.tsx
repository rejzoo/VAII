'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/initSupabase';

export default function CountryList() {
    type Country = {
        id: number;
        name: string;
    };

    const [countries, setCountries] = useState<Country[]>([]);

    const fetchCountries = async () => {
        const { data: countries } = await supabase
        .from('countries')
        .select('*')
        .order('name', {ascending: true});
        setCountries(countries ?? []);
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <ul>
        {countries.map((country) => (
            <li key={country.id}>{country.name}</li>
        ))}
        </ul>
    );
}