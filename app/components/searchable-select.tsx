"use client";

import { useState } from "react";
import { useClickOutside } from "@/app/lib/use-click-outside";
import DebouncedInput from "@/app/components/debounced-input";

export type SearchableSelectOption = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  options: SearchableSelectOption[];
  placeholder?: string;
  isLoading?: boolean;
  error?: string;
  value?: SearchableSelectOption | null;
  onSearch?: (query: string) => void;
  onChange?: (option: SearchableSelectOption) => void;
};

export default function SearchableSelect({
  options,
  placeholder = "Search...",
  isLoading,
  error,
  value,
  onSearch,
  onChange,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <DebouncedInput
        placeholder={value?.label ?? placeholder}
        value={query}
        onChange={(val) => {
          setQuery(val);
          setOpen(true);
        }}
        onDebouncedChange={(val) => onSearch?.(val)}
        onFocus={() => setOpen(true)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 placeholder:text-zinc-400"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {open && !isLoading && options.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange?.(option);
                setQuery("");
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-zinc-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
