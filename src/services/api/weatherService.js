import { toast } from "react-toastify";

class WeatherService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
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
          { field: { Name: "icon" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("weather", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
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
        icon: weather.icon
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching weather:", error?.response?.data?.message);
      } else {
        console.error("Error fetching weather:", error.message);
      }
      return [];
    }
  }

  async getById(id) {
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
          { field: { Name: "icon" } }
        ]
      };

      const response = await this.apperClient.getRecordById("weather", parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        date: response.data.date,
        tempHigh: response.data.temp_high,
        tempLow: response.data.temp_low,
        precipitation: response.data.precipitation,
        conditions: response.data.conditions,
        icon: response.data.icon
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching weather with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching weather with ID ${id}:`, error.message);
      }
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
            icon: weatherData.icon
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
            icon: newWeather.icon
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating weather:", error?.response?.data?.message);
      } else {
        console.error("Error creating weather:", error.message);
      }
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
            icon: weatherData.icon
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
            icon: updatedWeather.icon
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating weather:", error?.response?.data?.message);
      } else {
        console.error("Error updating weather:", error.message);
      }
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
      if (error?.response?.data?.message) {
        console.error("Error deleting weather:", error?.response?.data?.message);
      } else {
        console.error("Error deleting weather:", error.message);
      }
      return false;
    }
  }
}

export const weatherService = new WeatherService();