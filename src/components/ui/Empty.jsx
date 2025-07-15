import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Sprout", 
  title = "No data found", 
  description = "Get started by adding your first item",
  actionText = "Add Item",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="max-w-md w-full mx-4 text-center">
        <div className="p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} size={40} className="text-primary-600" />
          </div>
          
          <h3 className="text-xl font-bold text-earth-900 mb-2">
            {title}
          </h3>
          
          <p className="text-earth-600 mb-6">
            {description}
          </p>
          
          {onAction && (
            <Button 
              onClick={onAction}
              className="flex items-center mx-auto"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionText}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;