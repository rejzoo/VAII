'use client'
import { SearchBarPlayer } from "./ui/SearchBar";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-between p-4 text-white">
            <h1 className="text-xl font-bold">Header</h1>

        {pathname !== "/" && (
            <div className="flex-1 flex justify-center text-black">
            <SearchBarPlayer isLarge={false}/>
            </div>
        )}

        <div className="w-24 flex items-center justify-end">
            <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none">
                Login
            </button>
        </div>
    </div>
    );
}