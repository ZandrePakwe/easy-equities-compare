import { useQuery, useQueries } from "@tanstack/react-query";
import { getOptions } from "@/app/actions/get-options";
import { getDetails } from "@/app/actions/get-details";
import { getPrices } from "@/app/actions/get-prices";
import type { Source } from "@/app/actions/get-options";

export type { FundOption, Source } from "@/app/actions/get-options";
export type { FundDetails } from "@/app/actions/get-details";
export type { PricePoint } from "@/app/actions/get-prices";

export function useOptions(query?: string) {
  return useQuery({
    queryKey: ["fund-options", query],
    queryFn: () => getOptions(query),
  });
}

export function useMultipleDetails(
  entries: { isin: string; source: Source }[],
) {
  return useQueries({
    queries: entries.map(({ isin, source }) => ({
      queryKey: ["fund-details", isin, source],
      queryFn: () => getDetails(isin, source),
    })),
  });
}

export function usePrices(isin: string | null) {
  return useQuery({
    queryKey: ["fund-prices", isin],
    queryFn: () => getPrices(isin!),
    enabled: !!isin,
  });
}

export function useMultiplePrices(isins: string[]) {
  return useQueries({
    queries: isins.map((isin) => ({
      queryKey: ["fund-prices", isin],
      queryFn: () => getPrices(isin),
    })),
  });
}
