'use client'

import { Tank, TankImages } from "@/types/tank";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import FavoriteToggle from "@/app/components/ui/FavButton";

export default function TankPage( { params }: { params: Promise<{tankID: number}> } ) {
    const { tankID } = use<{tankID: number}>(params);
    const [tankData, setTankData] = useState<Tank>();
    const [tankDataImages, setTankDataImages] = useState<TankImages>();
    const [error, setError] = useState<string | null>();


    useEffect(() => {
        async function fetchTankData() {
          try {
            const responseData = await fetch(`/api/tanks/${tankID}`);
            const result = await responseData.json();
            
            console.log('API Response:', result);
            if (responseData.ok) {
              setTankData(result.tankDataToReturn.tankData);
              setTankDataImages(result.tankDataToReturn.tankImagesData);
              console.log('Tank data:', tankData);
              console.log('Images data:', tankDataImages);
            } else {
              setError(result.error || 'Failed to fetch tank data');
            }
          } catch (err) {
            setError((err as Error).message || 'Unexpected error occurred');
          }
        }
    
        fetchTankData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tankID]);

      useEffect(() => {
        console.log('Tank data updated:', tankData);
    }, [tankData]);
    
    useEffect(() => {
        console.log('Tank images updated:', tankDataImages);
    }, [tankDataImages]);
    
      if (error) {
        return <p>Error: {error}</p>;
      }
    
      if (!tankData) {
        return <p>Loading tank data...</p>;
      }

      if (!tankDataImages) {
        return <p>Loading images...</p>;
      }

    return (
      <>
      <div className="ml-3">
        <FavoriteToggle />
      </div>
    
      <div className="text-white p-4 flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
        <div>
          <div className="flex flex-col items-center lg:items-start">
            <h1 className="text-2xl lg:text-3xl font-bold text-center lg:text-left">{tankData.name}</h1>
            <div className="flex items-center space-x-2 mt-4 lg:mt-6">
              <Image
                src={`/nation/icon-${tankData.nation}.png`}
                alt={tankData.nation}
                width={32}
                height={20}
                className="w-8 h-5 object-contain"
              />
              <Image
                src={`/type/${tankData.type}.png`}
                alt={tankData.type}
                width={18}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <p className="text-lg lg:text-xl font-bold">{tankData.tier}</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Image
            src={tankDataImages.images.big_icon}
            alt="Tank Icon"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
    
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm md:text-base lg:text-lg text-gray-200">
            {tankData.description}
          </p>
        </div>
      </div>
    </>
    
    )
}