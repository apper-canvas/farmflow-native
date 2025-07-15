import { useState } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, actions, showFarmSelector = false }) => {
  const [selectedFarm, setSelectedFarm] = useState("1");

  const farms = [
    { value: "1", label: "Green Valley Farm" },
    { value: "2", label: "Sunny Acres" },
    { value: "3", label: "Prairie View Farm" },
  ];

  return (
    <div className="bg-surface border-b border-earth-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-earth-900">{title}</h1>
          {showFarmSelector && (
            <div className="min-w-[200px]">
              <Select
                value={selectedFarm}
                onChange={setSelectedFarm}
                className="border-earth-300"
              >
                {farms.map((farm) => (
                  <option key={farm.value} value={farm.value}>
                    {farm.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;