import { toast } from "react-toastify";

class WeatherService {
constructor() {
    this.apperClient = null;
    this.initializeClient();
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; // OpenWeatherMap API key from environment
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cachedData = null;
    this.lastUpdateTime = null;
    this.refreshInterval = 15 * 60 * 1000; // 15 minutes
    this.autoRefreshTimer = null;
    this.startAutoRefresh();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  startAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
    }
    
    this.autoRefreshTimer = setInterval(() => {
      this.refreshWeatherData();
    }, this.refreshInterval);
  }

  async refreshWeatherData() {
    try {
      const data = await this.fetchRealTimeWeather();
      this.cachedData = data;
      this.lastUpdateTime = new Date().toISOString();
      return data;
    } catch (error) {
      console.error("Auto-refresh failed:", error.message);
      return this.cachedData || [];
    }
  }

  async fetchRealTimeWeather() {
    try {
      // Default location (can be made configurable)
      const lat = 40.7128;
      const lon = -74.0060;
      
      // Fetch current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API error: ${currentResponse.status}`);
      }
      
      const currentData = await currentResponse.json();
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();
      
      // Process current weather
      const currentWeather = this.processCurrentWeather(currentData);
      
      // Process forecast data (get daily forecasts)
      const dailyForecasts = this.processForecastData(forecastData);
      
      // Combine current weather with forecast
      return [currentWeather, ...dailyForecasts];
      
    } catch (error) {
      console.error("Error fetching real-time weather:", error.message);
      throw error;
    }
  }

  processCurrentWeather(data) {
    const now = new Date();
    return {
      Id: 1,
      name: data.weather[0].description,
      tags: 'current,real-time',
      date: now.toISOString(),
      tempHigh: Math.round(data.main.temp_max),
      tempLow: Math.round(data.main.temp_min),
      precipitation: data.rain ? Math.round((data.rain['1h'] || 0) * 100) : 0,
      conditions: this.capitalizeWords(data.weather[0].description),
      icon: data.weather[0].icon,
      realTime: true,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      lastUpdated: now.toISOString()
    };
  }

  processForecastData(data) {
    const dailyData = new Map();
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: date.toISOString(),
          temps: [],
          conditions: [],
          precipitation: 0,
          icon: item.weather[0].icon
        });
      }
      
      const dayData = dailyData.get(dateKey);
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].description);
      
      if (item.rain) {
        dayData.precipitation += item.rain['3h'] || 0;
      }
    });
    
    return Array.from(dailyData.values()).slice(0, 4).map((day, index) => ({
      Id: index + 2,
      name: this.capitalizeWords(day.conditions[0]),
      tags: 'forecast,real-time',
      date: day.date,
      tempHigh: Math.round(Math.max(...day.temps)),
      tempLow: Math.round(Math.min(...day.temps)),
      precipitation: Math.min(Math.round(day.precipitation * 10), 100),
      conditions: this.capitalizeWords(day.conditions[0]),
      icon: day.icon,
      realTime: true,
      lastUpdated: new Date().toISOString()
    }));
  }

  capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  async getAll() {
    try {
      // Check if we have recent cached data
      if (this.cachedData && this.lastUpdateTime) {
        const timeSinceUpdate = Date.now() - new Date(this.lastUpdateTime).getTime();
        if (timeSinceUpdate < this.refreshInterval) {
          return this.cachedData;
        }
      }
      
      // Fetch fresh data
      const realTimeData = await this.fetchRealTimeWeather();
      this.cachedData = realTimeData;
      this.lastUpdateTime = new Date().toISOString();
      
      return realTimeData;
      
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      
      // Fallback to cached data if available
      if (this.cachedData) {
        toast.warning("Using cached weather data - real-time update failed");
        return this.cachedData;
      }
      
      // Fallback to database data if no cache
      return this.getFallbackData();
    }
  }

  async getFallbackData() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "conditions" } },
          { field: { Name: "icon" } },
          { field: { Name: "lastUpdated" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("weather", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return this.getDefaultWeatherData();
      }
      
      return response.data.map(weather => ({
        Id: weather.Id,
        name: weather.Name,
        tags: weather.Tags,
        date: weather.date,
        tempHigh: weather.temp_high,
        tempLow: weather.temp_low,
        precipitation: weather.precipitation,
        conditions: weather.conditions,
        icon: weather.icon,
        realTime: false,
        lastUpdated: weather.lastUpdated
      }));
    } catch (error) {
      console.error("Error fetching fallback weather:", error.message);
      return this.getDefaultWeatherData();
    }
  }

  getDefaultWeatherData() {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      return {
        Id: i + 1,
        name: "Fair Weather",
        tags: 'default',
        date: date.toISOString(),
        tempHigh: 75,
        tempLow: 55,
        precipitation: 20,
        conditions: "Partly Cloudy",
        icon: "02d",
        realTime: false,
        lastUpdated: null
      };
    });
  }

  async forceRefresh() {
    try {
      const data = await this.fetchRealTimeWeather();
      this.cachedData = data;
      this.lastUpdateTime = new Date().toISOString();
      toast.success("Weather data refreshed successfully");
      return data;
    } catch (error) {
      toast.error("Failed to refresh weather data");
      throw error;
    }
  }

  getLastUpdateTime() {
    return this.lastUpdateTime;
  }

  isDataFresh() {
    if (!this.lastUpdateTime) return false;
    const timeSinceUpdate = Date.now() - new Date(this.lastUpdateTime).getTime();
    return timeSinceUpdate < this.refreshInterval;
  }

  async getById(id) {
    try {
      const allWeather = await this.getAll();
      return allWeather.find(w => w.Id === parseInt(id)) || null;
    } catch (error) {
      console.error(`Error fetching weather with ID ${id}:`, error.message);
      return null;
    }
  }

  async create(weatherData) {
    try {
      const params = {
        records: [
          {
            Name: weatherData.conditions,
            date: weatherData.date,
            temp_high: weatherData.tempHigh,
            temp_low: weatherData.tempLow,
            precipitation: weatherData.precipitation,
            conditions: weatherData.conditions,
            icon: weatherData.icon,
            lastUpdated: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord("weather", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} weather records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newWeather = successfulRecords[0].data;
          return {
            Id: newWeather.Id,
            name: newWeather.Name,
            tags: newWeather.Tags,
            date: newWeather.date,
            tempHigh: newWeather.temp_high,
            tempLow: newWeather.temp_low,
            precipitation: newWeather.precipitation,
            conditions: newWeather.conditions,
            icon: newWeather.icon,
            lastUpdated: newWeather.lastUpdated
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating weather:", error.message);
      return null;
    }
  }

  async update(id, weatherData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: weatherData.conditions,
            date: weatherData.date,
            temp_high: weatherData.tempHigh,
            temp_low: weatherData.tempLow,
            precipitation: weatherData.precipitation,
            conditions: weatherData.conditions,
            icon: weatherData.icon,
            lastUpdated: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.updateRecord("weather", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} weather records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedWeather = successfulUpdates[0].data;
          return {
            Id: updatedWeather.Id,
            name: updatedWeather.Name,
            tags: updatedWeather.Tags,
            date: updatedWeather.date,
            tempHigh: updatedWeather.temp_high,
            tempLow: updatedWeather.temp_low,
            precipitation: updatedWeather.precipitation,
            conditions: updatedWeather.conditions,
            icon: updatedWeather.icon,
            lastUpdated: updatedWeather.lastUpdated
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating weather:", error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("weather", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} weather records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting weather:", error.message);
      return false;
    }
  }

  destroy() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
    }
  }
}

export const weatherService = new WeatherService();