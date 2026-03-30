"use client";

import { useState } from "react";
import { useOptions } from "@/app/lib/queries";
import type { Source } from "@/app/lib/queries";
import SearchableSelect from "@/app/components/searchable-select";
import type { SearchableSelectOption } from "@/app/components/searchable-select";

type FundSelectProps = {
  onChange?: (isin: string, source: Source) => void;
  excludeIsins?: string[];
};

export default function FundSelect({ onChange, excludeIsins }: FundSelectProps) {
  const [query, setQuery] = useState("");
  const { data: options, isLoading, isError, error } = useOptions(query);

  const selectOptions =
    options
      ?.filter((fund) => !excludeIsins?.includes(fund.isin))
      .map((fund) => ({
        label: fund.name,
        value: `${fund.source}:${fund.isin}`,
      })) ?? [];

  function handleChange(option: SearchableSelectOption | null) {
    if (!option) return;
    const colonIndex = option.value.indexOf(":");
    const source = option.value.slice(0, colonIndex) as Source;
    const isin = option.value.slice(colonIndex + 1);
    onChange?.(isin, source);
  }

  return (
    <SearchableSelect
      options={selectOptions}
      placeholder="Search funds..."
      isLoading={isLoading}
      error={isError ? `Failed to load funds: ${error.message}` : undefined}
      onSearch={setQuery}
      onChange={handleChange}
    />
  );
}
