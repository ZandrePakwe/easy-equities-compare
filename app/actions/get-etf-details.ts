"use server";

export type EtfDetails = {
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

const TABLE_URL =
  "https://api.hubapi.com/hubdb/api/v2/tables/2053309?portalId=1690236";
const ROWS_URL =
  "https://api.hubapi.com/hubdb/api/v2/tables/2053309/rows?portalId=1690236";

export async function getEtfDetails(isin: string): Promise<EtfDetails> {
  const [columnsRes, rowsRes] = await Promise.all([
    fetch(TABLE_URL),
    fetch(`${ROWS_URL}&isin=${encodeURIComponent(isin)}`),
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

  return {
    fundName: String(getValue("info_fundname")),
    description: String(getValue("info_description")),
    performance1Month: toNumber("performance_1month"),
    performance1Year: toNumber("performance_1year"),
    performance3Years: toNumber("performance_3years"),
    performance5Years: toNumber("performance_5years"),
    performance10Years: toNumber("performance_10years"),
    feesTER: Number(getValue("fees_ter")),
    performanceFee: toNumber("fees_performancefee"),
    performanceYtd: Number(getValue("performance_ytd")),
    pricePerShare: Number(getValue("prices_tri")),
    fundSize: String(getValue("prices_fundsize")),
    assetType: String(getValue("info_assetclass")),
    factSheetUrl: String(getValue("info_linktofactsheet")),
  };
}
