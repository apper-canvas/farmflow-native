import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const TaskList = ({ tasks, onComplete, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getTaskIcon = (type) => {
    switch (type.toLowerCase()) {
      case "watering":
        return "Droplets";
      case "fertilizing":
        return "Sprout";
      case "harvesting":
        return "Scissors";
      case "planting":
        return "Seed";
      case "weeding":
        return "Trash2";
      default:
        return "CheckSquare";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "completed"].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`p-4 transition-all duration-200 ${task.completed ? "opacity-75" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.completed 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600"
                  }`}>
                    <ApperIcon 
                      name={task.completed ? "CheckCircle" : getTaskIcon(task.type)} 
                      size={20} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${
                        task.completed ? "line-through text-earth-500" : "text-earth-900"
                      }`}>
                        {task.title}
                      </h3>
                      <Badge variant={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-earth-600">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="MapPin" size={14} />
                        <span>{task.farmName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                      </span>
                      {task.cropType && (
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Sprout" size={14} />
                          <span>{task.cropType}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!task.completed && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onComplete(task.Id)}
                      className="flex items-center"
                    >
                      <ApperIcon name="Check" size={16} className="mr-1" />
                      Complete
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="p-2"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.Id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;