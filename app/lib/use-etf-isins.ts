"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Manages the list of selected ETF ISINs via URL search params.
 *
 * Must be rendered inside a `<Suspense>` boundary because it uses `useSearchParams`.
 */
export function useEtfIsins() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isins = searchParams.get("etfs")?.split(",").filter(Boolean) ?? [];

  function updateIsins(next: string[]) {
    const params = new URLSearchParams(window.location.search);
    if (next.length === 0) {
      params.delete("etfs");
    } else {
      params.set("etfs", next.join(","));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return { isins, updateIsins };
}
