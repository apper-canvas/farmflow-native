import { toast } from "react-toastify";
import { store } from "@/store/store";
import { loadDashboardData } from "@/store/dashboardSlice";
class FarmService {
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
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "location" } },
          { field: { Name: "created_at" } },
          { field: { Name: "active_crops" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("farm", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.Name,
        tags: farm.Tags,
        size: farm.size,
        sizeUnit: farm.size_unit,
        location: farm.location,
        createdAt: farm.created_at,
        activeCrops: farm.active_crops || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farms:", error?.response?.data?.message);
      } else {
        console.error("Error fetching farms:", error.message);
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
          { field: { Name: "size" } },
          { field: { Name: "size_unit" } },
          { field: { Name: "location" } },
          { field: { Name: "created_at" } },
          { field: { Name: "active_crops" } }
        ]
      };

      const response = await this.apperClient.getRecordById("farm", parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        size: response.data.size,
        sizeUnit: response.data.size_unit,
        location: response.data.location,
        createdAt: response.data.created_at,
        activeCrops: response.data.active_crops || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching farm with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching farm with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [
          {
            Name: farmData.name,
            size: farmData.size,
            size_unit: farmData.sizeUnit,
            location: farmData.location,
            created_at: new Date().toISOString(),
            active_crops: 0
          }
        ]
      };

      const response = await this.apperClient.createRecord("farm", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} farms:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulRecords.length > 0) {
          const newFarm = successfulRecords[0].data;
          // Trigger dashboard refresh
          store.dispatch(loadDashboardData());
          return {
            Id: newFarm.Id,
            name: newFarm.Name,
            tags: newFarm.Tags,
            size: newFarm.size,
            sizeUnit: newFarm.size_unit,
            location: newFarm.location,
            createdAt: newFarm.created_at,
            activeCrops: newFarm.active_crops || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating farm:", error?.response?.data?.message);
      } else {
        console.error("Error creating farm:", error.message);
      }
      return null;
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: farmData.name,
            size: farmData.size,
            size_unit: farmData.sizeUnit,
            location: farmData.location,
            created_at: farmData.createdAt
          }
        ]
      };

      const response = await this.apperClient.updateRecord("farm", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} farms:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulUpdates.length > 0) {
          const updatedFarm = successfulUpdates[0].data;
          // Trigger dashboard refresh
          store.dispatch(loadDashboardData());
          return {
            Id: updatedFarm.Id,
            name: updatedFarm.Name,
            tags: updatedFarm.Tags,
            size: updatedFarm.size,
            sizeUnit: updatedFarm.size_unit,
            location: updatedFarm.location,
            createdAt: updatedFarm.created_at,
            activeCrops: updatedFarm.active_crops || 0
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating farm:", error?.response?.data?.message);
      } else {
        console.error("Error updating farm:", error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("farm", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} farms:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
}
        
        if (successfulDeletions.length > 0) {
          // Trigger dashboard refresh
          store.dispatch(loadDashboardData());
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting farm:", error?.response?.data?.message);
      } else {
        console.error("Error deleting farm:", error.message);
      }
      return false;
    }
  }
}

export const farmService = new FarmService();