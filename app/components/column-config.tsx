import { ReactNode } from "react";
import type { FundDetails } from "@/app/lib/queries";

function formatPerformancePercentage(v: FundDetails[keyof FundDetails]) {
  if (v == null) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  const color = n > 0 ? "text-accent" : n < 0 ? "text-danger" : "";
  return <span className={color}>{n.toFixed(2)}%</span>;
}

function formatPercentage(v: FundDetails[keyof FundDetails]) {
  if (v == null) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return <span>{n.toFixed(2)}%</span>;
}

export const COLUMN_CONFIG: {
  key: keyof FundDetails;
  label: string;
  format: (v: FundDetails[keyof FundDetails]) => ReactNode;
}[] = [
  { key: "assetType", label: "Asset Type", format: (v) => String(v) },
  {
    key: "pricePerShare",
    label: "Price per Share",
    format: (v) => `R ${Number(v).toFixed(2)}`,
  },
  {
    key: "fundSize",
    label: "Fund Size",
    format: (v) => `${String(v)}`,
  },
  { key: "performanceYtd", label: "YTD", format: formatPerformancePercentage },
  {
    key: "performance1Month",
    label: "1 Month",
    format: formatPerformancePercentage,
  },
  {
    key: "performance1Year",
    label: "1 Year",
    format: formatPerformancePercentage,
  },
  {
    key: "performance3Years",
    label: "3 Years",
    format: formatPerformancePercentage,
  },
  {
    key: "performance5Years",
    label: "5 Years",
    format: formatPerformancePercentage,
  },
  {
    key: "performance10Years",
    label: "10 Years",
    format: formatPerformancePercentage,
  },
  { key: "feesTER", label: "TER", format: formatPercentage },
  {
    key: "performanceFee",
    label: "Performance Fee",
    format: formatPercentage,
  },
  {
    key: "factSheetUrl",
    label: "Fact Sheet",
    format: (v) => {
      try {
        const url = new URL(String(v));
        if (url.protocol !== "https:" && url.protocol !== "http:") return "-";
        return (
          <a
            href={url.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View PDF
          </a>
        );
      } catch {
        return "-";
      }
    },
  },
];
