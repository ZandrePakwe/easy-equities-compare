import { useQuery, useQueries } from "@tanstack/react-query";
import { getEtfOptions } from "@/app/actions/get-etf-options";
import { getEtfDetails } from "@/app/actions/get-etf-details";
import { getEtfPrices } from "@/app/actions/get-etf-prices";

export type { EtfOption } from "@/app/actions/get-etf-options";
export type { EtfDetails } from "@/app/actions/get-etf-details";
export type { PricePoint } from "@/app/actions/get-etf-prices";

export function useEtfOptions(query?: string) {
  return useQuery({
    queryKey: ["etf-options", query],
    queryFn: () => getEtfOptions(query),
  });
}

export function useMultipleEtfDetails(isins: string[]) {
  return useQueries({
    queries: isins.map((isin) => ({
      queryKey: ["etf-details", isin],
      queryFn: () => getEtfDetails(isin),
    })),
  });
}

export function useEtfPrices(isin: string | null) {
  return useQuery({
    queryKey: ["etf-prices", isin],
    queryFn: () => getEtfPrices(isin!),
    enabled: !!isin,
  });
}

export function useMultipleEtfPrices(isins: string[]) {
  return useQueries({
    queries: isins.map((isin) => ({
      queryKey: ["etf-prices", isin],
      queryFn: () => getEtfPrices(isin),
    })),
  });
}
