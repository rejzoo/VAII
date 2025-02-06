'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingComponent from "./LoadingComponent";

interface TopEquipmentProps {
  tankID: number;
}

export default function TopEquipment({ tankID }: TopEquipmentProps) {
  const [topEquipment, setTopEquipment] = useState<{ name: string; image: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEquipment = async () => {
      try {
        
        const response = await fetch(`/api/equipment/mostUsed/${tankID}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setTopEquipment(result.data);
        } else {
          console.error("Error fetching top equipment:", result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEquipment();
  }, []);

  if (loading) {
    return <LoadingComponent message="Loading top equipment..." />;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md mt-6">
    <h2 className="text-lg font-bold mb-4">Top 3 Most Used Equipment</h2>
    <div className="flex justify-center space-x-2">
      {[0, 1, 2].map((index) => {
        const equipment = topEquipment[index];

        return (
          <div key={index} className="flex flex-col items-center">
            {equipment ? (
              <>
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <p className="mt-2">{equipment.name}</p>
              </>
            ) : (
              <div className=" w-20 h-20 flex items-center justify-center bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-xs">N/A</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
  );
}
