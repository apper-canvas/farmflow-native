import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-gradient-to-r from-surface to-earth-50 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg"></div>
              <div className="w-16 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded"></div>
              <div className="w-32 h-6 bg-gradient-to-r from-earth-300 to-earth-400 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-surface rounded-xl border border-earth-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-earth-200">
          <div className="flex space-x-4">
            <div className="w-32 h-6 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
            <div className="w-28 h-6 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-earth-100">
            <div className="flex space-x-4">
              <div className="w-32 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
              <div className="w-28 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gradient-to-r from-earth-200 to-earth-300 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-earth-600 font-medium">Loading your farm data...</p>
      </motion.div>
    </div>
  );
};

export default Loading;