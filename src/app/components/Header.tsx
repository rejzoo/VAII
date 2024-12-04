'use client'

import { SearchBarPlayer } from "./ui/SearchBar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LoginPage from "../login/page";
import LogoutButton from "./ui/LogOutButton";
import { isLoggedIn } from "../api/auth/actions/actions";
import { useEffect } from "react";

export default function Header() {
    const pathname = usePathname();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedInAtr, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const status = await isLoggedIn();
                setIsLoggedIn(status);
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <div className="flex items-center justify-between p-4 text-white">
            <h1 className="text-xl font-bold">Header</h1>

        {pathname !== "/" && (
            <div className="flex-1 flex justify-center text-black">
            <SearchBarPlayer isLarge={false}/>
            </div>
        )}

        <div className="w-24 flex items-center justify-end">
        {isLoggedInAtr ? (
        <LogoutButton setIsLoggedIn={(status) => setIsLoggedIn(status)}/>
            ) : (
        <button
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none"
            onClick={() => setIsLoginOpen(true)}
        >
            Login
        </button>
    )}
        </div>
        {isLoginOpen && 
        <LoginPage 
            onClose={() => setIsLoginOpen(false)} 
            setIsLoggedIn={(status) => setIsLoggedIn(status)} 
        />}
    </div>
    );
}