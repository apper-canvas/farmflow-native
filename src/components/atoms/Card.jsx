import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-xl border border-earth-200 transition-all duration-200";
  
  const variants = {
    default: "card-shadow",
    elevated: "card-shadow-hover",
    glass: "glass-effect",
    gradient: "bg-gradient-to-br from-surface to-earth-50",
  };
  
  const hoverStyles = hover ? "hover:card-shadow-hover hover-scale cursor-pointer" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;