'use client'

import TankTableItem from "../components/TankTableItem";
import { useEffect, useState } from 'react';

interface Tank {
  tank_id: number;
  name: string;
  short_name: string;
  nation: string;
  type: string;
  tier: number;
  is_premium: boolean;
  description: string;
  images: {
      small_icon: string;
      contour_icon: string;
      big_icon: string;
  };
  default_profile: {
      hp: number;
      speed_forward: number;
      speed_backward: number;
      weight: number;
      armor: {
          turret: {
              front: number;
              sides: number;
              rear: number;
          };
          hull: {
              front: number;
              sides: number;
              rear: number;
          };
      };
      gun: {
          name: string;
          reload_time: number;
          caliber: number;
          aim_time: number;
          dispersion: number;
          fire_rate: number;
      };
      turret: {
          name: string;
          view_range: number;
          traverse_speed: number;
      };
  };
}

interface ApiResponse {
  data: Record<string, Tank>;
}


export default function TankList() {
  const [tanks, setTanks] = useState<Tank[]>([]);

  useEffect(() => {
    fetch('../api/syncTanks')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            return response.json() as Promise<ApiResponse>;
        })
        .then((data) => {
            console.log('Fetched Data:', data);
            setTanks(Object.values(data.data || {}));
        })
        .catch((err) => {
            console.error('Error fetching from API route:', err);
        });
  }, []);

  return (
    <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {tanks.map((tank, index) => (
                <TankTableItem
                    key={index}
                    nation={tank.nation}
                    typeIcon={tank.type}
                    name={tank.name}
                    link={tank.name}
                />
            ))}
        </div>
    </div>
  );
}