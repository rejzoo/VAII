type SearchBarProps = {
    isLarge?: boolean;
  };
  
export function SearchBarPlayer({ isLarge = true }: SearchBarProps) {
  return (
      <input
          type="text"
          placeholder="Search players..."
          className={`w-full ${isLarge ? "max-w-2xl p-3" : "max-w-md p-2"} 
          bg-gray-700 rounded-lg text-white 
          placeholder-gray-500 focus:outline-none`}
      />
  );
}

export function SearchBarTanks({ value, onChange }: {value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;}) {
  return (
    <input 
      type="text"
      placeholder="Search tanks..."
      onChange={ onChange }
      value={ value }
      className="rounded-lg p-1 bg-gray-600 text-white placeholder-white focus:outline-none px-3" 
    />
  )
}