"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import EtfSelect from "@/app/components/etf-select";
import { useMultipleEtfDetails } from "@/app/lib/queries";
import { COLUMN_CONFIG } from "@/app/components/etf-column-config";
import type { SearchableSelectOption } from "@/app/components/searchable-select";

const WORD_LIMIT = 8;

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const words = text.split(/\s+/);
  const needsTruncation = words.length > WORD_LIMIT;
  const display = expanded || !needsTruncation ? text : words.slice(0, WORD_LIMIT).join(" ") + "…";

  return (
    <td className="max-w-50 px-4 py-2 wrap-break-word whitespace-normal text-zinc-700">
      {display}
      {needsTruncation && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-1 text-blue-600 hover:text-blue-800"
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </td>
  );
}

export default function EtfDetailsBody() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isins = searchParams.get("etfs")?.split(",").filter(Boolean) ?? [];
  const results = useMultipleEtfDetails(isins);

  function updateIsins(next: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("etfs");
    } else {
      params.set("etfs", next.join(","));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleRemove(isin: string) {
    updateIsins(isins.filter((i) => i !== isin));
  }

  return (
    <tbody>
      {results.some((r) => r.isError) && (
        <tr>
          <td colSpan={COLUMN_CONFIG.length + 2} className="px-4 py-2">
            <p className="text-sm text-red-500">Failed to load some ETF details.</p>
          </td>
        </tr>
      )}
      {isins.map((isin, i) => {
        const r = results[i];
        if (!r?.data) return null;
        return (
          <tr key={isin} className="border-b border-zinc-100">
            <td className="sticky left-0 max-w-50 bg-white px-4 py-2 font-semibold wrap-break-word whitespace-normal text-zinc-800">
              <div className="flex items-start gap-1">
                <span className="flex-1">{r.data.fundName}</span>
                <button
                  onClick={() => handleRemove(isin)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-700"
                >
                  &times;
                </button>
              </div>
            </td>
            {COLUMN_CONFIG.map((col) => (
              <td key={col.key} className="px-4 py-2 text-zinc-700">
                {col.format(r.data![col.key])}
              </td>
            ))}
            <ExpandableDescription text={String(r.data.description)} />
          </tr>
        );
      })}
    </tbody>
  );
}

export function EtfDetailsFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isins = searchParams.get("etfs")?.split(",").filter(Boolean) ?? [];

  function updateIsins(next: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("etfs");
    } else {
      params.set("etfs", next.join(","));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSelect(option: SearchableSelectOption | null) {
    if (!option) return;
    if (isins.includes(option.value)) return;
    updateIsins([...isins, option.value]);
  }

  return (
    <div className="border-t border-zinc-200 px-4 py-2">
      <div className="w-80">
        <EtfSelect onChange={handleSelect} excludeIsins={isins} />
      </div>
    </div>
  );
}
