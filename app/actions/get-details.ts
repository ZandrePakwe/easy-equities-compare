"use server";

import type { Source } from "@/app/actions/get-options";

export type FundDetails = {
  fundName: string;
  description: string;
  performance1Month: number | undefined;
  performance1Year: number | undefined;
  performance3Years: number | undefined;
  performance5Years: number | undefined;
  performance10Years: number | undefined;
  feesTER: number;
  performanceYtd: number;
  performanceFee: number | undefined;
  pricePerShare: number;
  fundSize: string;
  assetType: string;
  factSheetUrl: string;
};

type Column = {
  name: string;
  label: string;
  id: number;
  type: "TEXT" | "NUMBER";
};

type ColumnsResponse = {
  columns: Column[];
};

type RowsResponse = {
  objects: { values: Record<string, string | number> }[];
};

const TABLE_IDS: Record<Source, string> = {
  etf: "2053309",
  "unit-trust": "3418385",
};

type ColumnNames = {
  fundName: string;
  description: string;
  performance1Month: string;
  performance1Year: string;
  performance3Years: string;
  performance5Years: string;
  performance10Years: string;
  feesTER: string;
  performanceFee: string;
  performanceYtd: string;
  pricePerShare: string;
  fundSize: string;
  assetType: string;
  factSheetUrl: string;
};

const COLUMN_NAMES: Record<Source, ColumnNames> = {
  etf: {
    fundName: "info_fundname",
    description: "info_description",
    performance1Month: "performance_1month",
    performance1Year: "performance_1year",
    performance3Years: "performance_3years",
    performance5Years: "performance_5years",
    performance10Years: "performance_10years",
    feesTER: "fees_ter",
    performanceFee: "fees_performancefee",
    performanceYtd: "performance_ytd",
    pricePerShare: "prices_tri",
    fundSize: "prices_fundsize",
    assetType: "info_assetclass",
    factSheetUrl: "info_linktofactsheet",
  },
  "unit-trust": {
    fundName: "info_unit_trust_name",
    description: "info_fund_objective_description",
    performance1Month: "performance_in_one_month",
    performance1Year: "performance_in_one_year",
    performance3Years: "performance_in_three_years",
    performance5Years: "performance_in_five_years",
    performance10Years: "performance_in_ten_years",
    feesTER: "fees_ter",
    performanceFee: "fees_performance_fee",
    performanceYtd: "performance_ytd",
    pricePerShare: "prices_tri",
    fundSize: "prices_fundsize",
    assetType: "info_fundclassification",
    factSheetUrl: "info_facsheet",
  },
};

export async function getDetails(
  isin: string,
  source: Source,
): Promise<FundDetails> {
  const tableId = TABLE_IDS[source];
  const tableUrl = `https://api.hubapi.com/hubdb/api/v2/tables/${tableId}?portalId=1690236`;
  const rowsUrl = `https://api.hubapi.com/hubdb/api/v2/tables/${tableId}/rows?portalId=1690236`;

  const [columnsRes, rowsRes] = await Promise.all([
    fetch(tableUrl),
    fetch(`${rowsUrl}&isin=${encodeURIComponent(isin)}`),
  ]);

  if (!columnsRes.ok) {
    throw new Error(
      `Failed to fetch columns: ${columnsRes.status} ${columnsRes.statusText}`,
    );
  }
  if (!rowsRes.ok) {
    throw new Error(
      `Failed to fetch rows: ${rowsRes.status} ${rowsRes.statusText}`,
    );
  }

  const columnsData: ColumnsResponse = await columnsRes.json();
  const rowsData: RowsResponse = await rowsRes.json();

  const nameToId = new Map<string, number>();
  for (const col of columnsData.columns) {
    nameToId.set(col.name, col.id);
  }

  const row = rowsData.objects[0];
  if (!row) {
    throw new Error(`No data found for ISIN: ${isin}`);
  }

  function getValue(name: string): string | number | undefined {
    const id = nameToId.get(name);
    if (id === undefined) {
      throw new Error(`Column "${name}" not found in table schema`);
    }
    return row.values[id.toString()];
  }

  function toNumber(name: string): number | undefined {
    const v = getValue(name);
    return v == null ? undefined : Number(v);
  }

  const col = COLUMN_NAMES[source];

  return {
    fundName: String(getValue(col.fundName)),
    description: String(getValue(col.description)),
    performance1Month: toNumber(col.performance1Month),
    performance1Year: toNumber(col.performance1Year),
    performance3Years: toNumber(col.performance3Years),
    performance5Years: toNumber(col.performance5Years),
    performance10Years: toNumber(col.performance10Years),
    feesTER: Number(getValue(col.feesTER)),
    performanceFee: toNumber(col.performanceFee),
    performanceYtd: Number(getValue(col.performanceYtd)),
    pricePerShare: Number(getValue(col.pricePerShare)),
    fundSize: String(getValue(col.fundSize)),
    assetType: String(getValue(col.assetType)),
    factSheetUrl: String(getValue(col.factSheetUrl)),
  };
}
