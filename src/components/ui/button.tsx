import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover",
  danger:
    "bg-danger text-white hover:bg-danger-hover",
  ghost:
    "bg-transparent text-foreground hover:bg-border",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
