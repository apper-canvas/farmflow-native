import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CropTable from "@/components/organisms/CropTable";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    cropType: "",
    plantingDate: "",
    expectedHarvest: "",
    quantity: "",
    unit: "pounds",
    status: "planted",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll(),
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops data");
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
      const cropData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvest: new Date(formData.expectedHarvest).toISOString(),
      };

      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        setCrops(crops.map(crop => 
          crop.Id === editingCrop.Id ? { ...cropData, Id: editingCrop.Id } : crop
        ));
        toast.success("Crop updated successfully!");
      } else {
        const newCrop = await cropService.create(cropData);
        setCrops([...crops, newCrop]);
        toast.success("Crop added successfully!");
      }

      resetForm();
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId,
      cropType: crop.cropType,
      plantingDate: crop.plantingDate.split("T")[0],
      expectedHarvest: crop.expectedHarvest.split("T")[0],
      quantity: crop.quantity.toString(),
      unit: crop.unit,
      status: crop.status,
      notes: crop.notes,
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      await cropService.delete(cropId);
      setCrops(crops.filter(crop => crop.Id !== cropId));
      toast.success("Crop deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete crop");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmId) errors.farmId = "Farm is required";
    if (!formData.cropType.trim()) errors.cropType = "Crop type is required";
    if (!formData.plantingDate) errors.plantingDate = "Planting date is required";
    if (!formData.expectedHarvest) errors.expectedHarvest = "Expected harvest date is required";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    if (parseFloat(formData.quantity) <= 0) errors.quantity = "Quantity must be greater than 0";
    
    if (formData.plantingDate && formData.expectedHarvest) {
      if (new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
        errors.expectedHarvest = "Expected harvest must be after planting date";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropType: "",
      plantingDate: "",
      expectedHarvest: "",
      quantity: "",
      unit: "pounds",
      status: "planted",
      notes: "",
    });
    setFormErrors({});
    setEditingCrop(null);
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

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Crops" 
        actions={
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Crop
          </Button>
        }
      />

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-4xl mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-earth-900">
                  {editingCrop ? "Edit Crop" : "Add New Crop"}
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
                    label="Crop Type"
                    value={formData.cropType}
                    onChange={(value) => handleChange("cropType", value)}
                    placeholder="e.g., Corn, Wheat, Tomatoes"
                    error={formErrors.cropType}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="date"
                    label="Planting Date"
                    value={formData.plantingDate}
                    onChange={(value) => handleChange("plantingDate", value)}
                    error={formErrors.plantingDate}
                  />

                  <FormField
                    type="date"
                    label="Expected Harvest Date"
                    value={formData.expectedHarvest}
                    onChange={(value) => handleChange("expectedHarvest", value)}
                    error={formErrors.expectedHarvest}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    type="number"
                    label="Quantity"
                    value={formData.quantity}
                    onChange={(value) => handleChange("quantity", value)}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    error={formErrors.quantity}
                  />

                  <FormField
                    type="select"
                    label="Unit"
                    value={formData.unit}
                    onChange={(value) => handleChange("unit", value)}
                    options={[
                      { value: "pounds", label: "Pounds" },
                      { value: "kilograms", label: "Kilograms" },
                      { value: "tons", label: "Tons" },
                      { value: "bushels", label: "Bushels" },
                      { value: "acres", label: "Acres" },
                      { value: "hectares", label: "Hectares" },
                    ]}
                  />

                  <FormField
                    type="select"
                    label="Status"
                    value={formData.status}
                    onChange={(value) => handleChange("status", value)}
                    options={[
                      { value: "planted", label: "Planted" },
                      { value: "growing", label: "Growing" },
                      { value: "flowering", label: "Flowering" },
                      { value: "ready", label: "Ready for Harvest" },
                      { value: "harvested", label: "Harvested" },
                    ]}
                  />
                </div>

                <FormField
                  type="textarea"
                  label="Notes"
                  value={formData.notes}
                  onChange={(value) => handleChange("notes", value)}
                  placeholder="Additional notes about this crop..."
                  rows={3}
                />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex items-center">
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    {editingCrop ? "Update Crop" : "Add Crop"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      )}

      {crops.length === 0 ? (
        <Empty
          icon="Sprout"
          title="No crops found"
          description="Start tracking your crops by adding your first planting"
          actionText="Add Crop"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <CropTable
          crops={crops}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Crops;