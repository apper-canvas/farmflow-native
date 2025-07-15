import { toast } from "react-toastify";
import { store } from "@/store/store";
import { loadDashboardData } from "@/store/dashboardSlice";
class TaskService {
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
          { field: { Name: "farm_name" } },
          { field: { Name: "crop_type" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("task", params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        name: task.Name,
        tags: task.Tags,
        farmId: task.farm_id?.toString() || "",
        farmName: task.farm_name,
        cropId: task.crop_id?.toString() || "",
        cropType: task.crop_type,
        title: task.title,
        type: task.type,
        dueDate: task.due_date,
        completed: task.completed,
        completedDate: task.completed_date,
        priority: task.priority,
        notes: task.notes
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
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
          { field: { Name: "farm_name" } },
          { field: { Name: "crop_type" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } },
          { field: { Name: "crop_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById("task", parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        tags: response.data.Tags,
        farmId: response.data.farm_id?.toString() || "",
        farmName: response.data.farm_name,
        cropId: response.data.crop_id?.toString() || "",
        cropType: response.data.crop_type,
        title: response.data.title,
        type: response.data.type,
        dueDate: response.data.due_date,
        completed: response.data.completed,
        completedDate: response.data.completed_date,
        priority: response.data.priority,
        notes: response.data.notes
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching task with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title,
            title: taskData.title,
            type: taskData.type,
            due_date: taskData.dueDate,
            completed: taskData.completed,
            completed_date: taskData.completedDate,
            priority: taskData.priority,
            notes: taskData.notes,
            farm_id: parseInt(taskData.farmId),
            crop_id: taskData.cropId ? parseInt(taskData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.createRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulRecords.length > 0) {
          const newTask = successfulRecords[0].data;
          // Trigger dashboard refresh
          store.dispatch(loadDashboardData());
          return {
            Id: newTask.Id,
            name: newTask.Name,
            tags: newTask.Tags,
            farmId: newTask.farm_id?.toString() || "",
            farmName: newTask.farm_name,
            cropId: newTask.crop_id?.toString() || "",
            cropType: newTask.crop_type,
            title: newTask.title,
            type: newTask.type,
            dueDate: newTask.due_date,
            completed: newTask.completed,
            completedDate: newTask.completed_date,
            priority: newTask.priority,
            notes: newTask.notes
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
      }
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: taskData.title,
            title: taskData.title,
            type: taskData.type,
            due_date: taskData.dueDate,
            completed: taskData.completed,
            completed_date: taskData.completedDate,
            priority: taskData.priority,
            notes: taskData.notes,
            farm_id: parseInt(taskData.farmId),
            crop_id: taskData.cropId ? parseInt(taskData.cropId) : null
          }
        ]
      };

      const response = await this.apperClient.updateRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          // Trigger dashboard refresh
          store.dispatch(loadDashboardData());
          return {
            Id: updatedTask.Id,
            name: updatedTask.Name,
            tags: updatedTask.Tags,
            farmId: updatedTask.farm_id?.toString() || "",
            farmName: updatedTask.farm_name,
            cropId: updatedTask.crop_id?.toString() || "",
            cropType: updatedTask.crop_type,
            title: updatedTask.title,
            type: updatedTask.type,
            dueDate: updatedTask.due_date,
            completed: updatedTask.completed,
            completedDate: updatedTask.completed_date,
            priority: updatedTask.priority,
            notes: updatedTask.notes
          };
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("task", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
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
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
      }
      return false;
    }
  }
}

export const taskService = new TaskService();