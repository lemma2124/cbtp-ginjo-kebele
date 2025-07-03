
import { cn } from '@/lib/utils';

export const Spinner = ({ className, size = "default" }) => {
  const sizeStyles = {
    sm: "h-4 w-4 border-2",
    default: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
    xl: "h-16 w-16 border-4"
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={cn(
          "border-transparent rounded-full border-t-primary border-l-primary/30 animate-spin",
          sizeStyles[size],
          className
        )}
      />
    </div>
  );
};
