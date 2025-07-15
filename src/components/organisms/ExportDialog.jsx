import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ExportDialog = ({ onExport, onCancel }) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return;
    }

    setIsExporting(true);
    try {
      await onExport(exportFormat, startDate, endDate);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    { value: "csv", label: "CSV (Excel)" },
    { value: "pdf", label: "PDF Report" }
  ];

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-earth-900">Export Financial Report</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Export Format
              </label>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Date Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-earth-600 mb-1">From</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={today}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">To</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    max={today}
                    min={startDate}
                    className="w-full"
                  />
                </div>
              </div>
              {startDate && endDate && new Date(startDate) > new Date(endDate) && (
                <p className="text-red-600 text-sm mt-1">
                  End date must be after start date
                </p>
              )}
            </div>

            <div className="bg-earth-50 p-3 rounded-lg">
              <div className="flex items-start">
                <ApperIcon name="Info" size={16} className="text-earth-500 mr-2 mt-0.5" />
                <div className="text-sm text-earth-600">
                  <p className="font-medium mb-1">Export Options:</p>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>CSV:</strong> Spreadsheet format for Excel/Google Sheets</li>
                    <li>• <strong>PDF:</strong> Formatted report with summary and details</li>
                    <li>• Leave dates empty to export all transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || (startDate && endDate && new Date(startDate) > new Date(endDate))}
              className="flex items-center"
            >
              {isExporting ? (
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Download" size={16} className="mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExportDialog;