import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";
import { format } from "date-fns";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getAll();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const getFarmingAdvice = (weatherData) => {
    const advice = [];
    
    if (weatherData.precipitation > 70) {
      advice.push({
        type: "warning",
        message: "High chance of rain - postpone outdoor activities",
        icon: "CloudRain"
      });
    }
    
    if (weatherData.tempHigh > 85) {
      advice.push({
        type: "danger",
        message: "High temperature - ensure adequate irrigation",
        icon: "Thermometer"
      });
    }
    
    if (weatherData.tempLow < 40) {
      advice.push({
        type: "info",
        message: "Cold weather - protect sensitive crops",
        icon: "Snowflake"
      });
    }
    
    if (weatherData.precipitation < 20 && weatherData.tempHigh > 75) {
      advice.push({
        type: "success",
        message: "Perfect weather for harvesting and field work",
        icon: "Sun"
      });
    }
    
    return advice;
  };

  const getTodaysWeather = () => {
    const today = new Date();
    return weather.find(w => 
      new Date(w.date).toDateString() === today.toDateString()
    ) || weather[0];
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  const todaysWeather = getTodaysWeather();
  const farmingAdvice = todaysWeather ? getFarmingAdvice(todaysWeather) : [];

  return (
    <div className="p-6 space-y-6">
      <Header title="Weather Forecast" />

      {/* Today's Weather Highlight */}
      {todaysWeather && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-earth-900">Today's Weather</h2>
            <Badge variant="primary">
              {format(new Date(todaysWeather.date), "EEEE, MMM dd")}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Sun" size={32} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-earth-900">{todaysWeather.tempHigh}°</p>
              <p className="text-sm text-earth-600">High</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Thermometer" size={32} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-earth-900">{todaysWeather.tempLow}°</p>
              <p className="text-sm text-earth-600">Low</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Droplets" size={32} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-earth-900">{todaysWeather.precipitation}%</p>
              <p className="text-sm text-earth-600">Rain Chance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Eye" size={32} className="text-white" />
              </div>
              <p className="text-lg font-bold text-earth-900">{todaysWeather.conditions}</p>
              <p className="text-sm text-earth-600">Conditions</p>
            </div>
          </div>
        </Card>
      )}

      {/* Farming Advice */}
      {farmingAdvice.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center">
            <ApperIcon name="Lightbulb" size={20} className="mr-2" />
            Farming Advice
          </h3>
          <div className="space-y-3">
            {farmingAdvice.map((advice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 bg-earth-50 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  advice.type === "warning" ? "bg-yellow-100 text-yellow-600" :
                  advice.type === "danger" ? "bg-red-100 text-red-600" :
                  advice.type === "success" ? "bg-green-100 text-green-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <ApperIcon name={advice.icon} size={16} />
                </div>
                <p className="text-earth-800">{advice.message}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* 5-Day Forecast */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-earth-900 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {weather.map((day, index) => (
            <WeatherCard key={index} weather={day} index={index} />
          ))}
        </div>
      </Card>

      {/* Detailed Weather Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-earth-200">
          <h3 className="text-lg font-bold text-earth-900">Detailed Forecast</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">Conditions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">High / Low</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">Precipitation</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-earth-700">Farming Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {weather.map((day, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-earth-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-earth-900">
                      {format(new Date(day.date), "EEE, MMM dd")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Sun" size={16} className="text-earth-500" />
                      <span className="text-earth-800">{day.conditions}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-earth-900 font-medium">{day.tempHigh}°</span>
                    <span className="text-earth-600 mx-1">/</span>
                    <span className="text-earth-600">{day.tempLow}°</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Droplets" size={16} className="text-blue-500" />
                      <span className="text-earth-800">{day.precipitation}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {day.precipitation > 70 ? (
                      <Badge variant="warning">Indoor Work</Badge>
                    ) : day.tempHigh > 85 ? (
                      <Badge variant="danger">High Heat</Badge>
                    ) : day.tempLow < 40 ? (
                      <Badge variant="info">Frost Risk</Badge>
                    ) : (
                      <Badge variant="success">Good for Field Work</Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Weather;