import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
}

export function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  const baseClasses = "rounded-lg p-6 transition-colors";

  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm",
    elevated: "bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700",
    outlined: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-none",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
