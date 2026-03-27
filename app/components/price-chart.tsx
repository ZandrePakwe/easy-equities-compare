"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { PricePoint } from "@/app/lib/queries";

export default function PriceChart({ prices }: { prices: PricePoint[] }) {
  if (prices.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center text-sm text-zinc-400">
        No price data available for this period
      </div>
    );
  }

  const trendUp = prices[prices.length - 1].price >= prices[0].price;
  const color = trendUp
    ? "var(--color-accent)"
    : "var(--color-danger)";

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={prices}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `R ${v.toFixed(0)}`}
            width={60}
          />
          <Tooltip
            formatter={(value) => [`R ${Number(value).toFixed(2)}`, "Price"]}
            labelStyle={{ color: "#71717a" }}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e4e4e7",
              fontSize: "0.875rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
