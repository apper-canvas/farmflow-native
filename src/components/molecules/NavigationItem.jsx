import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, children, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
            : "text-earth-700 hover:bg-primary-50 hover:text-primary-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            size={20} 
            className={`mr-3 transition-colors duration-200 ${
              isActive ? "text-white" : "text-earth-500 group-hover:text-primary-600"
            }`} 
          />
          <span className="font-medium">{children}</span>
          {badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto bg-accent-500 text-white text-xs rounded-full px-2 py-1"
            >
              {badge}
            </motion.span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;