"use server";

export type PricePoint = {
  date: string;
  price: number;
};

export async function getPrices(isin: string): Promise<PricePoint[]> {
  const res = await fetch(
    `https://pricing.easyequities.co.za/api/prices?ISINCode=${encodeURIComponent(isin)}&period=0`,
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch prices: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();

  return (data.Prices ?? []).map(
    (p: { ClosingDate: string; Price: number }) => ({
      date: p.ClosingDate.split("T")[0],
      price: p.Price / 100,
    }),
  );
}
