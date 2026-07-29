import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-control text-supporting font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-control px-3",
        lg: "h-11 rounded-control px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: ReactNode;
}

const addClassNameRecursively = (
  children: ReactNode,
  className: string
): ReactNode => {
  const foo = (child: ReactNode) => {
    if (!isValidElement(child)) return child;

    return cloneElement(child, {
      // @ts-ignore
      className: `${child.props.className || ""} ${className}`.trim(),
      children: addClassNameRecursively(child.props.children, className),
    });
  };
  return Children.map(children, foo);
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "cursor-can-hover"
        )}
        ref={ref}
        {...props}
      >
        {/* add pointer-events-none to every child recursively */}
        {addClassNameRecursively(children, "pointer-events-none")}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
