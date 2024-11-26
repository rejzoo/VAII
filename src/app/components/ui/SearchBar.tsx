type SearchBarProps = {
    isLarge?: boolean; // Boolean to decide the size
  };
  
  export default function SearchBar({ isLarge = true }: SearchBarProps) {
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