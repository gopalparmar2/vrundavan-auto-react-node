import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10",
        destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/10",
        outline: "border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 text-slate-500 dark:text-slate-400",
        link: "text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      },
      size: {
        default: "h-11 px-4 py-2 gap-1.5",
        xs: "h-6 px-2 text-xs rounded-md gap-1 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-lg px-3 text-xs gap-1.5",
        lg: "h-12 rounded-xl px-8 gap-1.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
