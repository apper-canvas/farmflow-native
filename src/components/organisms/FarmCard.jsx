import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, onEdit, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 hover-scale">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-earth-900">{farm.name}</h3>
              <p className="text-sm text-earth-600">{farm.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(farm)}
              className="p-2"
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(farm.Id)}
              className="p-2 hover:bg-red-50 hover:text-red-600"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600">Size</span>
            <Badge variant="primary">
              {farm.size} {farm.sizeUnit}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600">Active Crops</span>
            <Badge variant="success">
              {farm.activeCrops || 0} crops
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600">Created</span>
            <span className="text-sm text-earth-800">
              {format(new Date(farm.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-earth-200">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="flex items-center">
              <ApperIcon name="Eye" size={16} className="mr-2" />
              View Details
            </Button>
            <Button variant="primary" size="sm" className="flex items-center">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Crop
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FarmCard;