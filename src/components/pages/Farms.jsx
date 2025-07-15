import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FarmCard from "@/components/organisms/FarmCard";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import { farmService } from "@/services/api/farmService";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    sizeUnit: "acres",
    location: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showForm) {
        resetForm();
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const farmData = {
        ...formData,
        size: parseFloat(formData.size),
        createdAt: editingFarm ? editingFarm.createdAt : new Date().toISOString(),
      };

      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        setFarms(farms.map(farm => 
          farm.Id === editingFarm.Id ? { ...farmData, Id: editingFarm.Id } : farm
        ));
        toast.success("Farm updated successfully!");
      } else {
        const newFarm = await farmService.create(farmData);
        setFarms([...farms, newFarm]);
        toast.success("Farm created successfully!");
      }

      resetForm();
    } catch (err) {
      toast.error("Failed to save farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit,
      location: farm.location,
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;

    try {
      await farmService.delete(farmId);
      setFarms(farms.filter(farm => farm.Id !== farmId));
      toast.success("Farm deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete farm");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Farm name is required";
    if (!formData.size) errors.size = "Size is required";
    if (parseFloat(formData.size) <= 0) errors.size = "Size must be greater than 0";
    if (!formData.location.trim()) errors.location = "Location is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      size: "",
      sizeUnit: "acres",
      location: "",
    });
    setFormErrors({});
    setEditingFarm(null);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      resetForm();
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div>
      <Header 
        title="Farms" 
        actions={
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Farm
          </Button>
        }
      />

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-earth-900">
                    {editingFarm ? "Edit Farm" : "Add New Farm"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <FormField
                    label="Farm Name"
                    value={formData.name}
                    onChange={(value) => handleChange("name", value)}
                    placeholder="Enter farm name"
                    error={formErrors.name}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      type="number"
                      label="Size"
                      value={formData.size}
                      onChange={(value) => handleChange("size", value)}
                      placeholder="0"
                      step="0.1"
                      min="0"
                      error={formErrors.size}
                    />
                    <FormField
                      type="select"
                      label="Unit"
                      value={formData.sizeUnit}
                      onChange={(value) => handleChange("sizeUnit", value)}
                      options={[
                        { value: "acres", label: "Acres" },
                        { value: "hectares", label: "Hectares" },
                        { value: "square_meters", label: "Square Meters" },
                        { value: "square_feet", label: "Square Feet" },
                      ]}
                    />
                  </div>

                  <FormField
                    label="Location"
                    value={formData.location}
                    onChange={(value) => handleChange("location", value)}
                    placeholder="Enter farm location"
                    error={formErrors.location}
                  />

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" type="button" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex items-center justify-center">
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {editingFarm ? "Update Farm" : "Create Farm"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </motion.div>
)}
      {farms.length === 0 ? (
        <Empty
          icon="MapPin"
          title="No farms found"
          description="Start by adding your first farm to begin managing your agriculture operations"
          actionText="Add Farm"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              onEdit={handleEdit}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;