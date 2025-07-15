import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, index }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "Sun";
      case "partly cloudy":
        return "PartlyCloudyDay";
      case "cloudy":
        return "Cloud";
      case "rainy":
        return "CloudRain";
      case "stormy":
        return "CloudLightning";
      default:
        return "Sun";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 text-center hover-scale">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm font-medium text-earth-600">
            {formatDate(weather.date)}
          </p>
          
          <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full">
            <ApperIcon 
              name={getWeatherIcon(weather.conditions)} 
              size={32}
              className="text-primary-600"
            />
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-bold text-earth-900">
              {weather.tempHigh}°
            </p>
            <p className="text-sm text-earth-600">
              {weather.tempLow}°
            </p>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-earth-500">
            <ApperIcon name="Droplets" size={12} />
            <span>{weather.precipitation}%</span>
          </div>
          
          <p className="text-xs text-earth-600 font-medium">
            {weather.conditions}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;