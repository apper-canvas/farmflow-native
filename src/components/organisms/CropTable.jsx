import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const CropTable = ({ crops, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("plantingDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredCrops = crops.filter(crop =>
    crop.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "planted":
        return "info";
      case "growing":
        return "primary";
      case "flowering":
        return "warning";
      case "ready":
        return "success";
      case "harvested":
        return "default";
      default:
        return "default";
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar 
          onSearch={setSearchTerm}
          placeholder="Search crops..."
        />
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-earth-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                  <button
                    onClick={() => handleSort("cropType")}
                    className="flex items-center space-x-1 hover:text-primary-600"
                  >
                    <span>Crop Type</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                  <button
                    onClick={() => handleSort("plantingDate")}
                    className="flex items-center space-x-1 hover:text-primary-600"
                  >
                    <span>Planted</span>
                    <ApperIcon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                  Expected Harvest
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                  Quantity
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-earth-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {sortedCrops.map((crop, index) => (
                <motion.tr
                  key={crop.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-earth-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Sprout" size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-earth-900">{crop.cropType}</p>
                        <p className="text-sm text-earth-600">{crop.farmName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-earth-600">
                    {format(new Date(crop.plantingDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-earth-600">
                    {format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-earth-600">
                    {crop.quantity} {crop.unit}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(crop.status)}>
                      {crop.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(crop)}
                        className="p-2"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(crop.Id)}
                        className="p-2 hover:bg-red-50 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CropTable;