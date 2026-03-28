"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useMultipleEtfPrices } from "@/app/lib/queries";
import { useMounted } from "@/app/lib/use-mounted";
import type { PricePoint } from "@/app/lib/queries";

const TABS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 365 * 3 },
  { label: "5Y", days: 365 * 5 },
] as const;

type Tab = (typeof TABS)[number];

const LINE_COLORS = ["#551cb4", "#0fd9ba", "#eb1f49"];

function filterPrices(prices: PricePoint[], tab: Tab): PricePoint[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - tab.days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return prices.filter((p) => p.date >= cutoffStr);
}

type NormalisedPoint = Record<string, string | number> & { date: string };

function normaliseAndMerge(
  allPrices: PricePoint[][],
  names: string[],
): NormalisedPoint[] {
  if (allPrices.length === 0) return [];

  // Find the latest start date across all series so all start from 0%
  const startDates = allPrices.map((prices) =>
    prices.length > 0 ? prices[0].date : "",
  );
  const commonStart = startDates.reduce((a, b) => (a > b ? a : b), "");

  // Build a map: date -> { name: normalisedValue }
  const dateMap = new Map<string, Record<string, number>>();

  allPrices.forEach((prices, i) => {
    const fromCommon = prices.filter((p) => p.date >= commonStart);
    if (fromCommon.length === 0) return;
    const basePrice = fromCommon[0].price;
    if (basePrice <= 0) return;

    for (const p of fromCommon) {
      const growth = ((p.price - basePrice) / basePrice) * 100;
      const existing = dateMap.get(p.date) ?? {};
      existing[names[i]] = growth;
      dateMap.set(p.date, existing);
    }
  });

  return Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}

export type ComparisonChartDialogHandle = {
  open: (isins: string[], names: string[]) => void;
};

const ComparisonChartDialog = forwardRef<ComparisonChartDialogHandle>(
  function ComparisonChartDialog(_, ref) {
    const mounted = useMounted();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isins, setIsins] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>(TABS[3]);

    const results = useMultipleEtfPrices(isins);
    const isLoading = results.some((r) => r.isLoading);
    const isError = results.some((r) => r.isError);
    const allLoaded = results.every((r) => r.data);

    useImperativeHandle(ref, () => ({
      open(newIsins: string[], newNames: string[]) {
        setIsins(newIsins);
        setNames(newNames);
        setActiveTab(TABS[3]);
        dialogRef.current?.showModal();
      },
    }));

    function close() {
      dialogRef.current?.close();
      setIsins([]);
      setNames([]);
    }

    const filteredAll = allLoaded
      ? results.map((r) => filterPrices(r.data!, activeTab))
      : [];
    const chartData = allLoaded ? normaliseAndMerge(filteredAll, names) : [];

    if (!mounted) return null;

    return createPortal(
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-xl border-none bg-white p-0 shadow-xl backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-800">
              Growth Comparison
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

          {isLoading && (
            <div className="h-80 animate-pulse rounded bg-zinc-100" />
          )}
          {isError && (
            <div className="flex h-80 items-center justify-center text-sm text-red-500">
              Failed to load price data
            </div>
          )}
          {!isLoading && !isError && chartData.length === 0 && (
            <div className="flex h-80 items-center justify-center text-sm text-zinc-400">
              No price data available for this period
            </div>
          )}
          {!isLoading && !isError && chartData.length > 0 && (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={40}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(2)}%`,
                      String(name),
                    ]}
                    labelStyle={{ color: "#71717a" }}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e4e4e7",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "0.75rem" }}
                  />
                  {names.map((name, i) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </dialog>,
      document.body,
    );
  },
);

export default ComparisonChartDialog;
