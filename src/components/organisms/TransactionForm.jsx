import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const TransactionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    farmId: "1",
  });

  const [errors, setErrors] = useState({});

const expenseCategories = [
    { value: "seeds", label: "Seeds & Planting" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "fuel", label: "Fuel" },
    { value: "labor", label: "Labor" },
  ];

  const incomeCategories = [
    { value: "crop_sales", label: "Crop Sales" },
    { value: "livestock", label: "Livestock" },
    { value: "subsidies", label: "Subsidies" },
    { value: "grants", label: "Grants" },
    { value: "services", label: "Services" },
    { value: "other", label: "Other" },
  ];

  const farms = [
    { value: "1", label: "Green Valley Farm" },
    { value: "2", label: "Sunny Acres" },
    { value: "3", label: "Prairie View Farm" },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (parseFloat(formData.amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      Id: Date.now(),
    };
    
    onSubmit(transaction);
    toast.success(`${formData.type === "income" ? "Income" : "Expense"} added successfully!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-earth-900">
              Add {formData.type === "income" ? "Income" : "Expense"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Type</label>
                <div className="flex rounded-lg border border-earth-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleChange("type", "income")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      formData.type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-white text-earth-700 hover:bg-earth-50"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("type", "expense")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      formData.type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-white text-earth-700 hover:bg-earth-50"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <FormField
                type="select"
                label="Farm"
                value={formData.farmId}
                onChange={(value) => handleChange("farmId", value)}
                options={farms}
                error={errors.farmId}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Category"
                value={formData.category}
                onChange={(value) => handleChange("category", value)}
                options={formData.type === "income" ? incomeCategories : expenseCategories}
                error={errors.category}
              />

              <FormField
                type="number"
                label="Amount ($)"
                value={formData.amount}
                onChange={(value) => handleChange("amount", value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.amount}
              />
            </div>

            <FormField
              type="date"
              label="Date"
              value={formData.date}
              onChange={(value) => handleChange("date", value)}
              error={errors.date}
            />

            <FormField
              type="textarea"
              label="Description"
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
              placeholder="Enter transaction details..."
              rows={3}
              error={errors.description}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add {formData.type === "income" ? "Income" : "Expense"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionForm;