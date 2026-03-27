"use client";

import { useState } from "react";
import { useEtfOptions } from "@/app/lib/queries";
import SearchableSelect from "@/app/components/searchable-select";
import type { SearchableSelectOption } from "@/app/components/searchable-select";

export default function EtfSelect() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SearchableSelectOption | null>(null);
  const { data: options, isLoading, isError, error } = useEtfOptions(query);

  const selectOptions =
    options?.map((etf) => ({ label: etf.name, value: etf.isin })) ?? [];

  return (
    <SearchableSelect
      options={selectOptions}
      placeholder="Search ETFs..."
      isLoading={isLoading}
      error={isError ? `Failed to load ETFs: ${error.message}` : undefined}
      value={selected}
      onSearch={setQuery}
      onChange={setSelected}
    />
  );
}
