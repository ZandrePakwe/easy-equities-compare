import { Suspense } from "react";
import { COLUMN_CONFIG } from "@/app/components/etf-column-config";
import EtfDetailsBody, { EtfDetailsFooter } from "@/app/components/etf-details-body";

export default function EtfDetailsPreview() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <div className="rounded-lg border border-zinc-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-max text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="sticky top-0 bg-zinc-50 px-4 py-2 font-semibold text-zinc-800">
                  Fund
                </th>
                {COLUMN_CONFIG.map((col) => (
                  <th
                    key={col.key}
                    className="sticky top-0 bg-zinc-50 px-4 py-2 font-medium text-zinc-500"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="sticky top-0 bg-zinc-50 px-4 py-2 font-medium text-zinc-500">
                  Description
                </th>
              </tr>
            </thead>
            <Suspense>
              <EtfDetailsBody />
            </Suspense>
          </table>
        </div>
        <Suspense>
          <EtfDetailsFooter />
        </Suspense>
      </div>
    </div>
  );
}
