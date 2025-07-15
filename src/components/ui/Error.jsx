import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="max-w-md w-full mx-4 text-center">
        <div className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-earth-900 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-earth-600 mb-6">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center">
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Try Again
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;