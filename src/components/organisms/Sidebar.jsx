import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const navigationItems = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/farms", icon: "MapPin", label: "Farms" },
    { to: "/crops", icon: "Sprout", label: "Crops" },
    { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { to: "/finance", icon: "DollarSign", label: "Finance" },
    { to: "/weather", icon: "CloudSun", label: "Weather" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg"
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={24} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface border-r border-earth-200 min-h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">FarmFlow</h1>
          </div>
          
<nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavigationItem>
            ))}
          </nav>
          
          <div className="mt-8 pt-4 border-t border-earth-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 left-0 w-64 bg-surface border-r border-earth-200 min-h-screen z-40"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sprout" size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold gradient-text">FarmFlow</h1>
              </div>
              
<nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.to} to={item.to} icon={item.icon}>
                    {item.label}
                  </NavigationItem>
                ))}
              </nav>
              
              <div className="mt-8 pt-4 border-t border-earth-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;