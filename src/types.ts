import type { fixtureIds } from "./fixture-ids.js";

export type FixtureId = (typeof fixtureIds)[number];
export type FixtureSource = "horizon" | "rpc";

export interface FixtureMeta {
  id: FixtureId;
  source: FixtureSource;
  description: string;
  tags: string[];
  endpoint: string;
}

export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export interface HorizonAccount {
  id: string;
  account_id: string;
  sequence: string;
  balances: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface HorizonTransaction {
  id: string;
  hash: string;
  ledger: number;
  source_account: string;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
  [key: string]: unknown;
}

export interface JsonRpcSuccess<T = unknown> {
  jsonrpc: "2.0";
  id: number | string | null;
  result: T;
}

export interface JsonRpcError {
  jsonrpc: "2.0";
  id: number | string | null;
  error: { code: number; message: string; data?: unknown };
}
