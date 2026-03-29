"use client";

import { useState, useRef } from "react";
import EtfSelect from "@/app/components/etf-select";
import { useEtfIsins } from "@/app/lib/use-etf-isins";
import { useMultipleEtfDetails } from "@/app/lib/queries";
import { COLUMN_CONFIG } from "@/app/components/etf-column-config";
import type { SearchableSelectOption } from "@/app/components/searchable-select";
import PriceChartDialog from "@/app/components/price-chart-dialog";
import type { PriceChartDialogHandle } from "@/app/components/price-chart-dialog";
import ComparisonChartDialog, { useComparisonDialog } from "@/app/components/comparison-chart-dialog";

const WORD_LIMIT = 8;

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const words = text.split(/\s+/);
  const needsTruncation = words.length > WORD_LIMIT;
  const display =
    expanded || !needsTruncation
      ? text
      : words.slice(0, WORD_LIMIT).join(" ") + "…";

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
  const { isins, updateIsins } = useEtfIsins();
  const results = useMultipleEtfDetails(isins);
  const chartRef = useRef<PriceChartDialogHandle>(null);
  const { open: openComparison } = useComparisonDialog();

  return (
    <tbody>
      {results.some((r) => r.isError) && (
        <tr>
          <td colSpan={COLUMN_CONFIG.length + 2} className="px-4 py-2">
            <p className="text-sm text-red-500">
              Failed to load some ETF details.
            </p>
          </td>
        </tr>
      )}
      {isins.map((isin, i) => {
        const r = results[i];
        if (!r?.data) {
          return (
            <tr key={isin} className="border-b border-zinc-100">
              <td className="sticky left-0 z-10 bg-white px-4 py-2">
                <div className="flex items-start gap-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                  <button
                    onClick={() => updateIsins(isins.filter((v) => v !== isin))}
                    className="shrink-0 rounded-full bg-zinc-100 p-2 text-sm leading-none text-zinc-400 hover:text-zinc-700 sm:bg-transparent sm:hover:bg-zinc-100"
                  >
                    &times;
                  </button>
                </div>
              </td>
              {COLUMN_CONFIG.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
                </td>
              ))}
              <td className="px-4 py-2">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
              </td>
            </tr>
          );
        }
        return (
          <tr key={isin} className="border-b border-zinc-100">
            <td className="sticky left-0 max-w-[25vw] bg-white px-4 py-2 font-semibold wrap-break-word whitespace-normal text-zinc-800 sm:max-w-50">
              <div className="flex items-start gap-2">
                <span className="flex-1">{r.data.fundName}</span>
                <div className="flex shrink-0 flex-col-reverse items-center gap-1 sm:flex-row sm:gap-2">
                  <button
                    onClick={() =>
                      chartRef.current?.open(isin, r.data.fundName)
                    }
                    className="hover:text-accent rounded-full bg-zinc-100 p-2 text-zinc-400 sm:bg-transparent sm:hover:bg-zinc-100"
                    aria-label="View price trend"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75ZM1 8.75A.75.75 0 0 1 1.75 8h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 8.75Zm12 6a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm-8 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => updateIsins(isins.filter((v) => v !== isin))}
                    className="rounded-full bg-zinc-100 p-2 text-sm leading-none text-zinc-400 hover:text-zinc-700 sm:bg-transparent sm:hover:bg-zinc-100"
                  >
                    &times;
                  </button>
                </div>
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
      {isins.length >= 2 && (
        <tr>
          <td colSpan={COLUMN_CONFIG.length + 2} className="px-4 py-3">
            <button
              onClick={() => openComparison()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
              </svg>
              Compare Growth
            </button>
          </td>
        </tr>
      )}
      <PriceChartDialog ref={chartRef} />
      <ComparisonChartDialog
        isins={isins.filter((_, i) => results[i]?.data)}
        names={results.filter((r) => r.data).map((r) => r.data!.fundName)}
      />
    </tbody>
  );
}

export function EtfDetailsFooter() {
  const { isins, updateIsins } = useEtfIsins();

  function handleSelect(option: SearchableSelectOption | null) {
    if (!option) return;
    if (isins.includes(option.value)) return;
    updateIsins([...isins, option.value]);
  }

  return (
    <div className="border-t border-zinc-200 px-4 py-2">
      <div className="w-full max-w-80">
        <EtfSelect onChange={handleSelect} excludeIsins={isins} />
      </div>
    </div>
  );
}
