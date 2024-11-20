import SearchBar from "./components/ui/SearchBar";

export default function Main() {
    return (
      <div className="flex flex-col items-center justify-start h-full pt-[8%]">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Sealclubber
        </h1>
  
        <div className="flex justify-center w-full">
            <SearchBar />
        </div>
      </div>
    );
  }
  