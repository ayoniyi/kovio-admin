/** @format */

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
type ButtonProps = React.ComponentProps<typeof Button>;

interface BtnProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function CustomButton({
  children,
  isLoading,
  className,
  asChild,
  ...props
}: any) {
  // When using `asChild`, the underlying Button uses Radix Slot which requires exactly one React element child.
  // To avoid React.Children.only errors, render only the provided child without extra nodes (like a spinner) in that mode.
  if (asChild) {
    return (
      <Button
        className={cn(
          "bg-kv-primary rounded-full cursor-pointer shadow-none hover:text-white/100 text-white px-10 h-12 hover:bg-kv-primary/100  text-base font-medium transition hover:opacity-90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        asChild
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "bg-kv-primary rounded-full cursor-pointer shadow-none hover:text-white/100 text-white px-10 h-12 hover:bg-kv-primary/100  text-base font-medium transition hover:opacity-90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
      disabled={isLoading}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Button>
  );
}
