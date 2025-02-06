'use client';

import { useEffect, useState } from "react";
import { Equipment } from "@/types/types";
import Image from "next/image";

interface EquipmentSelectorProps {
  tankID: number;
}

export default function EquipmentSelector({ tankID }: EquipmentSelectorProps) {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<(number | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`/api/equipment`);
        const result = await response.json();

        if (response.ok && result.success) {
          setEquipmentList(result.data);
        } else {
          console.error("Error fetching equipment:", result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tankID,
          selectedEquipment,
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Equipment selection saved successfully!");
      } else {
        console.error("Error saving equipment:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Select Equipment</h2>

      {loading ? (
        <p>Loading equipment...</p>
      ) : (
        <>
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative">
                <select
                  className="appearance-none w-24 h-24 bg-gray-700 rounded-lg text-white p-2 cursor-pointer text-center"
                  value={selectedEquipment[index] || ""}
                  onChange={(e) => {
                    const newSelection = [...selectedEquipment];
                    newSelection[index] = e.target.value ? parseInt(e.target.value) : null;
                    setSelectedEquipment(newSelection);
                  }}
                >
                  <option value="">Select</option>
                  {equipmentList.map((item) => (
                    <option key={item.provision_id} value={item.provision_id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                {selectedEquipment[index] !== null && (
                  <div
                    className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center"
                    onClick={() => {
                      const newSelection = [...selectedEquipment];
                      newSelection[index] = null;
                      setSelectedEquipment(newSelection);
                    }}
                  >
                    <Image
                      src={equipmentList.find(e => e.provision_id === selectedEquipment[index])?.image || ""}
                      alt="Equipment Icon"
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="mt-4 w-max bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Save Selection
          </button>
        </>
      )}
    </div>
  );
}
