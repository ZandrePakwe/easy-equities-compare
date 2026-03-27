"use client";

import { useState, useEffect, useRef } from "react";

type DebouncedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange: (value: string) => void;
  delay?: number;
};

export default function DebouncedInput({
  value,
  onChange,
  onDebouncedChange,
  delay = 300,
  ...props
}: DebouncedInputProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <input
      {...props}
      type="text"
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          onDebouncedChange(val);
        }, delay);
      }}
    />
  );
}
