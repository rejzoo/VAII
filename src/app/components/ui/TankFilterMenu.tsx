'use client';

import Image from 'next/image';

interface TankFiltersProps {
  selectedTiers: number[];
  setSelectedTiers: (tiers: number[]) => void;
  selectedNations: string[];
  setSelectedNations: (nations: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  uniqueNations: string[];
  uniqueTypes: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSelection: (setSelectedList: any, value: any) => void;
  resetFilters: () => void;
  numberOfTanks: number;
}

export default function TankFilters({
  selectedTiers,
  setSelectedTiers,
  selectedNations,
  setSelectedNations,
  selectedTypes,
  setSelectedTypes,
  uniqueNations,
  uniqueTypes,
  searchQuery,
  setSearchQuery,
  toggleSelection,
  resetFilters,
  numberOfTanks
}: TankFiltersProps) {
  return (
    <div className="m-5 bg-gray-700 rounded-lg p-5 mx-auto">
      <div className="flex flex-wrap gap-2 mt-4">
        <h3 className="text-white font-bold w-full">Tier</h3>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((tier) => (
          <button
            key={tier}
            className={`px-3 py-2 rounded-lg w-10 h-10 ${
              selectedTiers.includes(tier) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
            }`}
            onClick={() => toggleSelection(setSelectedTiers, tier)}
          >
            {tier}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <h3 className="text-white font-bold w-full">Nation</h3>
        {uniqueNations.map((nation) => (
          <button
            key={nation}
            className={`px-3 py-2 rounded-lg ${
              selectedNations.includes(nation) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
            }`}
            onClick={() => toggleSelection(setSelectedNations, nation)}
          >
            <Image
              src={`/nation/icon-${nation}.png`}
              alt={nation}
              width={30}
              height={30}
              className="object-contain"
            />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <h3 className="text-white font-bold w-full">Type</h3>
        {uniqueTypes.map((type) => (
          <button
            key={type}
            className={`px-3 py-2 rounded-lg ${
              selectedTypes.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-200'
            }`}
            onClick={() => toggleSelection(setSelectedTypes, type)}
          >
            <Image
              src={`/type/${type}.png`}
              alt={type}
              width={18}
              height={18}
              className="object-contain"
            />
          </button>
        ))}
      </div>

      <div className='mt-6 flex flex-row justify-between'>
        <div className='flex flex-row'>
            <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-lg bg-gray-600 text-white w-max-2xl"
            />
            <p className='mt-2 ml-5 text-white'>Found: {numberOfTanks} tanks</p>
        </div>

        <button
          className="w-40 h-10 flex items-center justify-center rounded-lg text-lg font-bold bg-red-600 text-white hover:bg-red-800 ml-4"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
