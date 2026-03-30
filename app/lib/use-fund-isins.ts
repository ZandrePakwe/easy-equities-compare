"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Source } from "@/app/actions/get-options";

export type FundEntry = {
  isin: string;
  source: Source;
};

const SOURCE_PREFIXES: Record<Source, string> = {
  etf: "etf",
  "unit-trust": "ut",
};

const PREFIX_TO_SOURCE: Record<string, Source> = {
  etf: "etf",
  ut: "unit-trust",
};

function serialize(entries: FundEntry[]): string {
  return entries
    .map((e) => `${SOURCE_PREFIXES[e.source]}:${e.isin}`)
    .join(",");
}

function deserialize(value: string): FundEntry[] {
  return value
    .split(",")
    .filter(Boolean)
    .map((token) => {
      const colonIndex = token.indexOf(":");
      if (colonIndex === -1) {
        return { isin: token, source: "etf" as Source };
      }
      const prefix = token.slice(0, colonIndex);
      const isin = token.slice(colonIndex + 1);
      return { isin, source: PREFIX_TO_SOURCE[prefix] ?? ("etf" as Source) };
    });
}

/**
 * Manages the list of selected fund ISINs via URL search params.
 *
 * Must be rendered inside a `<Suspense>` boundary because it uses `useSearchParams`.
 */
export function useFundIsins() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get("funds") ?? searchParams.get("etfs");
  const funds: FundEntry[] = raw ? deserialize(raw) : [];

  function updateFunds(next: FundEntry[]) {
    const params = new URLSearchParams(window.location.search);
    params.delete("etfs");
    if (next.length === 0) {
      params.delete("funds");
    } else {
      params.set("funds", serialize(next));
    }
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  return { funds, updateFunds };
}
