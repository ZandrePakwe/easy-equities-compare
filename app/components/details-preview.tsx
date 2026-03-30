import { Suspense } from "react";
import { COLUMN_CONFIG } from "@/app/components/column-config";
import DetailsBody, { DetailsFooter } from "@/app/components/details-body";

export default function DetailsPreview() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-0">
      <p className="text-center text-sm text-zinc-500">
        Use the search below to add ETFs or unit trusts and compare key metrics
        such as total expense ratio, annual returns, and fund size side by side.
      </p>
      <div className="rounded-lg border border-zinc-200 shadow-sm">
        <div className="relative p-2 sm:p-4">
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
            <Suspense
              fallback={
                <tbody>
                  {Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      <td className="sticky left-0 bg-white px-4 py-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                      </td>
                      {COLUMN_CONFIG.map((col) => (
                        <td key={col.key} className="px-4 py-2">
                          <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              }
            >
              <DetailsBody />
            </Suspense>
          </table>
          </div>
          <div className="pointer-events-none absolute -right-2 top-0 h-full w-6 bg-linear-to-l from-white to-transparent sm:hidden" />
        </div>
        <Suspense
          fallback={
            <div className="border-t border-zinc-200 px-4 py-2">
              <div className="h-9 w-full max-w-80 animate-pulse rounded bg-zinc-200" />
            </div>
          }
        >
          <DetailsFooter />
        </Suspense>
      </div>
    </div>
  );
}
