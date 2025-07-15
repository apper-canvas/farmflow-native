import { toast } from "react-toastify";

class CropService {
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
          { field: { Name: "crop_type" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("crop", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.Name,
        tags: crop.Tags,
        farmId: crop.farm_id?.toString() || "",
        cropType: crop.crop_type,
        plantingDate: crop.planting_date,
        expectedHarvest: crop.expected_harvest,
        quantity: crop.quantity,
        unit: crop.unit,
        status: crop.status,
        notes: crop.notes
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
      } else {
        console.error("Error fetching crops:", error.message);
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
          { field: { Name: "crop_type" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById("crop", parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        farmId: response.data.farm_id?.toString() || "",
        cropType: response.data.crop_type,
        plantingDate: response.data.planting_date,
        expectedHarvest: response.data.expected_harvest,
        quantity: response.data.quantity,
        unit: response.data.unit,
        status: response.data.status,
        notes: response.data.notes
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching crop with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [
          {
            Name: cropData.cropType,
            crop_type: cropData.cropType,
            planting_date: cropData.plantingDate,
            expected_harvest: cropData.expectedHarvest,
            quantity: cropData.quantity,
            unit: cropData.unit,
            status: cropData.status,
            notes: cropData.notes,
            farm_id: parseInt(cropData.farmId)
          }
        ]
      };

      const response = await this.apperClient.createRecord("crop", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} crops:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newCrop = successfulRecords[0].data;
          return {
            Id: newCrop.Id,
            name: newCrop.Name,
            tags: newCrop.Tags,
            farmId: newCrop.farm_id?.toString() || "",
            cropType: newCrop.crop_type,
            plantingDate: newCrop.planting_date,
            expectedHarvest: newCrop.expected_harvest,
            quantity: newCrop.quantity,
            unit: newCrop.unit,
            status: newCrop.status,
            notes: newCrop.notes
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error("Error creating crop:", error.message);
      }
      return null;
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: cropData.cropType,
            crop_type: cropData.cropType,
            planting_date: cropData.plantingDate,
            expected_harvest: cropData.expectedHarvest,
            quantity: cropData.quantity,
            unit: cropData.unit,
            status: cropData.status,
            notes: cropData.notes,
            farm_id: parseInt(cropData.farmId)
          }
        ]
      };

      const response = await this.apperClient.updateRecord("crop", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} crops:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCrop = successfulUpdates[0].data;
          return {
            Id: updatedCrop.Id,
            name: updatedCrop.Name,
            tags: updatedCrop.Tags,
            farmId: updatedCrop.farm_id?.toString() || "",
            cropType: updatedCrop.crop_type,
            plantingDate: updatedCrop.planting_date,
            expectedHarvest: updatedCrop.expected_harvest,
            quantity: updatedCrop.quantity,
            unit: updatedCrop.unit,
            status: updatedCrop.status,
            notes: updatedCrop.notes
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
      } else {
        console.error("Error updating crop:", error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("crop", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} crops:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error("Error deleting crop:", error.message);
      }
      return false;
    }
  }
}

export const cropService = new CropService();