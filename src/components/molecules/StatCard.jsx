import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = "primary",
  gradient = false,
  trend = "neutral"
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    danger: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-earth-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover-scale cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
          {change && (
            <div className={`flex items-center text-sm ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                size={16} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-earth-600">{title}</p>
          <p className={`text-2xl font-bold ${gradient ? "gradient-text" : "text-earth-900"}`}>
            {value}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;