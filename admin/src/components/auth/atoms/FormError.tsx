import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div
      className={cn(
        "bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm text-white",
        className
      )}
    >
      <TriangleAlertIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
