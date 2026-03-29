"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import PriceChart from "@/app/components/price-chart";
import { useEtfPrices } from "@/app/lib/queries";
import { useMounted } from "@/app/lib/use-mounted";
import { useScrollLock } from "@/app/lib/use-scroll-lock";
import type { PricePoint } from "@/app/lib/queries";

const TABS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 365 * 3 },
  { label: "5Y", days: 365 * 5 },
  { label: "Max", days: null },
] as const;

type Tab = (typeof TABS)[number];

function filterPrices(prices: PricePoint[], tab: Tab): PricePoint[] {
  if (tab.days === null) return prices;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - tab.days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return prices.filter((p) => p.date >= cutoffStr);
}

function computeReturns(prices: PricePoint[]): { total: number; annualised: number } | null {
  if (prices.length < 2) return null;
  const startPrice = prices[0].price;
  const endPrice = prices[prices.length - 1].price;
  if (startPrice <= 0) return null;
  const total = endPrice / startPrice - 1;
  const startDate = new Date(prices[0].date);
  const endDate = new Date(prices[prices.length - 1].date);
  const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 0) return null;
  const annualised = Math.pow(endPrice / startPrice, 365 / days) - 1;
  return { total, annualised };
}

export type PriceChartDialogHandle = {
  open: (isin: string, fundName: string) => void;
};

const PriceChartDialog = forwardRef<PriceChartDialogHandle>(
  function PriceChartDialog(_, ref) {
    const mounted = useMounted();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isin, setIsin] = useState<string | null>(null);
    const [fundName, setFundName] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
    useScrollLock(isin !== null);

    const { data: prices, isLoading, isError } = useEtfPrices(isin);

    useImperativeHandle(ref, () => ({
      open(newIsin: string, newFundName: string) {
        setIsin(newIsin);
        setFundName(newFundName);
        setActiveTab(TABS[0]);
        dialogRef.current?.showModal();
      },
    }));

    function close() {
      dialogRef.current?.close();
      setIsin(null);
    }

    const filtered = prices ? filterPrices(prices, activeTab) : [];
    const returns = computeReturns(filtered);

    if (!mounted) return null;

    return createPortal(
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-xl border-none bg-white p-0 shadow-xl backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-800">
              {fundName}
            </h2>
            <button
              onClick={close}
              className="rounded-full bg-zinc-100 p-2 text-sm leading-none text-zinc-400 sm:bg-transparent sm:hover:bg-zinc-100 hover:text-zinc-700"
            >
              &times;
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {returns !== null && (
            <div className="flex items-baseline gap-4 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-500">Total return</span>
                <span
                  className={`font-semibold ${returns.total >= 0 ? "text-accent" : "text-danger"}`}
                >
                  {returns.total >= 0 ? "+" : ""}
                  {(returns.total * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-500">Annualised</span>
                <span
                  className={`font-semibold ${returns.annualised >= 0 ? "text-accent" : "text-danger"}`}
                >
                  {returns.annualised >= 0 ? "+" : ""}
                  {(returns.annualised * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex h-80 flex-col items-center justify-center gap-3">
              <svg className="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-sm text-zinc-500">Fetching price data…</p>
            </div>
          )}
          {isError && (
            <div className="flex h-80 items-center justify-center text-sm text-red-500">
              Failed to load price data
            </div>
          )}
          {!isLoading && !isError && <PriceChart prices={filtered} />}
        </div>
      </dialog>,
      document.body,
    );
  },
);

export default PriceChartDialog;
