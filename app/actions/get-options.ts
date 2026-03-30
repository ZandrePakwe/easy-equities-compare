"use server";

import { parse } from "node-html-parser";

export type Source = "etf" | "unit-trust";

export type FundOption = {
  name: string;
  isin: string;
  source: Source;
};

const SOURCES: { url: string; source: Source }[] = [
  { url: "https://compare.easyequities.co.za/compare", source: "etf" },
  {
    url: "https://wealth.easyequities.co.za/unittrustscompare",
    source: "unit-trust",
  },
];

async function fetchOptions(
  url: string,
  source: Source,
): Promise<FundOption[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${source} options: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const root = parse(html);
  const optionDivs = root.querySelectorAll("div.option");

  const seen = new Set<string>();
  const result: FundOption[] = [];

  for (const div of optionDivs) {
    const name = div.getAttribute("data-name") ?? "";
    const isin = div.getAttribute("data-isin") ?? "";
    if (name && isin && !seen.has(isin)) {
      seen.add(isin);
      result.push({ name, isin, source });
    }
  }

  return result;
}

export async function getOptions(query?: string): Promise<FundOption[]> {
  const results = await Promise.allSettled(
    SOURCES.map(({ url, source }) => fetchOptions(url, source)),
  );

  const seen = new Set<string>();
  const combined: FundOption[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const option of result.value) {
        if (!seen.has(option.isin)) {
          seen.add(option.isin);
          combined.push(option);
        }
      }
    }
  }

  combined.sort((a, b) => a.name.localeCompare(b.name));

  if (query) {
    const normalize = (s: string) => s.replace(/\s/g, "").toLowerCase();
    const normalizedQuery = normalize(query);
    return combined.filter((opt) =>
      normalize(opt.name).includes(normalizedQuery),
    );
  }

  return combined;
}
