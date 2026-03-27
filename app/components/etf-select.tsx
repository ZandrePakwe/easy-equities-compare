"use client";

import { useState } from "react";
import { useEtfOptions } from "@/app/lib/queries";
import SearchableSelect from "@/app/components/searchable-select";
import type { SearchableSelectOption } from "@/app/components/searchable-select";

type EtfSelectProps = {
  onChange?: (option: SearchableSelectOption | null) => void;
  excludeIsins?: string[];
};

export default function EtfSelect({ onChange, excludeIsins }: EtfSelectProps) {
  const [query, setQuery] = useState("");
  const { data: options, isLoading, isError, error } = useEtfOptions(query);

  const selectOptions =
    options
      ?.filter((etf) => !excludeIsins?.includes(etf.isin))
      .map((etf) => ({ label: etf.name, value: etf.isin })) ?? [];

  return (
    <SearchableSelect
      options={selectOptions}
      placeholder="Search ETFs..."
      isLoading={isLoading}
      error={isError ? `Failed to load ETFs: ${error.message}` : undefined}
      onSearch={setQuery}
      onChange={(option) => onChange?.(option)}
    />
  );
}
