'use client';

import { useEffect, useState } from "react";
import { Equipment } from "@/types/types";
import Image from "next/image";
import LoadingComponent from "./LoadingComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

    const fetchSelectedEquipment = async () => {
      try {
        const response = await fetch(`/api/equipment/${tankID}`);
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setSelectedEquipment(result.data);
        } else {
          console.error("Error fetching selected equipment:", result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    Promise.all([fetchEquipment(), fetchSelectedEquipment()]).finally(() => setLoading(false));
  }, [tankID]);

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
        // Alert ?
      } else {
        console.error("Error saving equipment:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDelete = async () => {
    try {
        const response = await fetch(`/api/equipment/deleteSelection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tankID }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
            setSelectedEquipment([null, null, null]);
        } else {
            console.error("Error deleting equipment:", result.error);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
  };

  const cleanEquipmentName = (name: string) => {
    return name
      .replace(/\b(Bounty|Improved|Innovative|Experimental|T1|T2|T3|Class|1|2|3)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (loading) {
    return <LoadingComponent message="Loading equipments..." />;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Select Equipment</h2>
      <div className="flex space-x-2 justify-between">
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative w-20 h-20">
              {!selectedEquipment[index] && (
                <select
                  className="appearance-none w-20 h-20 bg-gray-700 rounded-lg text-white p-2 cursor-pointer text-center"
                  value={selectedEquipment[index] || ""}
                  onChange={(e) => {
                    //Creates copy of a list
                    const newSelection = [...selectedEquipment];
                    newSelection[index] = e.target.value ? parseInt(e.target.value) : null;
                    setSelectedEquipment(newSelection);
                  }}
                >
                  <option value="">Select</option>
                  {equipmentList.map((item) => {
                    const baseName = cleanEquipmentName(item.name);

                    return (
                      <option
                        key={item.provision_id}
                        value={item.provision_id}
                        disabled={selectedEquipment
                          .map((selectedId) => {
                            const selectedItem = equipmentList.find(e => e.provision_id === selectedId);
                            return selectedItem ? cleanEquipmentName(selectedItem.name) : null;
                          })
                          .includes(baseName)}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              )}

              {selectedEquipment[index] !== null && (
                <div
                  className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center bg-gray-700 rounded-lg cursor-pointer"
                  onClick={() => {
                    const newSelection = [...selectedEquipment];
                    newSelection[index] = null;
                    setSelectedEquipment(newSelection);
                  }}
                >
                  {equipmentList.find(e => e.provision_id === selectedEquipment[index])?.image && (
                    <Image
                      src={equipmentList.find(e => e.provision_id === selectedEquipment[index])?.image || ""}
                      alt="Equipment Icon"
                      width={45}
                      height={45}
                      className="object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div>
          <button
            className="ml-3 text-red-500 hover:text-red-700 transition mr-3"
            onClick={handleDelete}
            title="Delete Rating"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>

          <button
            className="mt-4 w-max bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Save Selection
        </button>
          
        </div>
      </div>
    </div>
  );
}
