import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button component with multiple variants and sizes
 * Built using class-variance-authority for type-safe styling
 * Supports all standard button variants: default, destructive, outline, secondary, ghost, link
 */
const buttonVariants = cva(
  // Base styles applied to all button variants
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary button with brand colors
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Destructive button for dangerous actions
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outlined button with border
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Secondary button with muted colors
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost button with transparent background
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link-style button with underline
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Standard button size
        default: "h-10 px-4 py-2",
        // Small button for compact layouts
        sm: "h-9 rounded-md px-3",
        // Large button for emphasis
        lg: "h-11 rounded-md px-8",
        // Icon-only button (square)
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// TypeScript interface for Button component props
// Extends standard HTML button attributes with variant and size props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Future compatibility for Radix UI integration
}

// Forwarded ref button component for proper ref handling
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Export both the component and variants for external use
export { Button, buttonVariants };
