import { useQuery } from "@tanstack/react-query";
import { getEtfOptions } from "@/app/actions/get-etf-options";

export type { EtfOption } from "@/app/actions/get-etf-options";

export function useEtfOptions(query?: string) {
  return useQuery({
    queryKey: ["etf-options", query],
    queryFn: () => getEtfOptions(query),
  });
}
