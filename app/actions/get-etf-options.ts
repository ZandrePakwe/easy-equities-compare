"use server";

import { parse } from "node-html-parser";

export type EtfOption = {
  name: string;
  isin: string;
};

export async function getEtfOptions(query?: string): Promise<EtfOption[]> {
  const response = await fetch("https://compare.easyequities.co.za/compare");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ETF options: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const root = parse(html);
  const optionDivs = root.querySelectorAll("div.option");

  const seen = new Set<string>();
  const result: EtfOption[] = [];

  for (const div of optionDivs) {
    const name = div.getAttribute("data-name") ?? "";
    const isin = div.getAttribute("data-isin") ?? "";
    if (name && isin && !seen.has(isin)) {
      seen.add(isin);
      result.push({ name, isin });
    }
  }

  if (query) {
    const normalize = (s: string) => s.replace(/\s/g, "").toLowerCase();
    const normalizedQuery = normalize(query);
    return result.filter((opt) =>
      normalize(opt.name).includes(normalizedQuery),
    );
  }

  return result;
}
