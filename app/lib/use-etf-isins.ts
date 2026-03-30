"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * Manages the list of selected ETF ISINs via URL search params.
 *
 * Must be rendered inside a `<Suspense>` boundary because it uses `useSearchParams`.
 */
export function useEtfIsins() {
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
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  return { isins, updateIsins };
}
