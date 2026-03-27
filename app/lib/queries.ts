import { useQuery, useQueries } from "@tanstack/react-query";
import { getEtfOptions } from "@/app/actions/get-etf-options";
import { getEtfDetails } from "@/app/actions/get-etf-details";

export type { EtfOption } from "@/app/actions/get-etf-options";
export type { EtfDetails } from "@/app/actions/get-etf-details";

export function useEtfOptions(query?: string) {
  return useQuery({
    queryKey: ["etf-options", query],
    queryFn: () => getEtfOptions(query),
  });
}

export function useEtfDetails(isin?: string) {
  return useQuery({
    queryKey: ["etf-details", isin],
    queryFn: () => getEtfDetails(isin!),
    enabled: !!isin,
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
