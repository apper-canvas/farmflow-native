import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    type: "watering",
    dueDate: "",
    priority: "medium",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll(),
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        completed: false,
        completedDate: null,
      };

      if (editingTask) {
        await taskService.update(editingTask.Id, {
          ...taskData,
          completed: editingTask.completed,
          completedDate: editingTask.completedDate,
        });
        setTasks(tasks.map(task => 
          task.Id === editingTask.Id ? { ...taskData, Id: editingTask.Id, completed: editingTask.completed, completedDate: editingTask.completedDate } : task
        ));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks([...tasks, newTask]);
        toast.success("Task created successfully!");
      }

      resetForm();
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = {
        ...task,
        completed: true,
        completedDate: new Date().toISOString(),
      };
      
      await taskService.update(taskId, updatedTask);
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task completed!");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId,
      cropId: task.cropId || "",
      title: task.title,
      type: task.type,
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
      notes: task.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmId) errors.farmId = "Farm is required";
    if (!formData.title.trim()) errors.title = "Task title is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropId: "",
      title: "",
      type: "watering",
      dueDate: "",
      priority: "medium",
      notes: "",
    });
    setFormErrors({});
    setEditingTask(null);
    setShowForm(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const getFilteredCrops = () => {
    return crops.filter(crop => crop.farmId === formData.farmId);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Tasks" 
        actions={
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Task
          </Button>
        }
      />

{showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="mx-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-earth-900">
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="p-2"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      type="select"
                      label="Farm"
                      value={formData.farmId}
                      onChange={(value) => handleChange("farmId", value)}
                      options={farms.map(farm => ({
                        value: farm.Id.toString(),
                        label: farm.name
                      }))}
                      error={formErrors.farmId}
                    />

                    <FormField
                      type="select"
                      label="Crop (Optional)"
                      value={formData.cropId}
                      onChange={(value) => handleChange("cropId", value)}
                      options={[
                        { value: "", label: "Select a crop" },
                        ...getFilteredCrops().map(crop => ({
                          value: crop.Id.toString(),
                          label: crop.cropType
                        }))
                      ]}
                    />
                  </div>

                  <FormField
                    label="Task Title"
                    value={formData.title}
                    onChange={(value) => handleChange("title", value)}
                    placeholder="e.g., Water tomato plants"
                    error={formErrors.title}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      type="select"
                      label="Task Type"
                      value={formData.type}
                      onChange={(value) => handleChange("type", value)}
                      options={[
                        { value: "watering", label: "Watering" },
                        { value: "fertilizing", label: "Fertilizing" },
                        { value: "harvesting", label: "Harvesting" },
                        { value: "planting", label: "Planting" },
                        { value: "weeding", label: "Weeding" },
                        { value: "pest_control", label: "Pest Control" },
                        { value: "maintenance", label: "Maintenance" },
                        { value: "inspection", label: "Inspection" },
                        { value: "other", label: "Other" },
                      ]}
                    />

                    <FormField
                      type="date"
                      label="Due Date"
                      value={formData.dueDate}
                      onChange={(value) => handleChange("dueDate", value)}
                      error={formErrors.dueDate}
                    />

                    <FormField
                      type="select"
                      label="Priority"
                      value={formData.priority}
                      onChange={(value) => handleChange("priority", value)}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                    />
                  </div>

                  <FormField
                    type="textarea"
                    label="Notes"
                    value={formData.notes}
                    onChange={(value) => handleChange("notes", value)}
                    placeholder="Additional details about this task..."
                    rows={3}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex items-center">
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {editingTask ? "Update Task" : "Create Task"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {tasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description="Create your first task to start managing your farm activities"
          actionText="Add Task"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Tasks;