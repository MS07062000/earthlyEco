import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";

interface FormSuccessProps {
  message?: string;
  className?: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div
      className={cn(
        "bg-emerald-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-700",
        className
      )}
    >
      <CheckCircleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
