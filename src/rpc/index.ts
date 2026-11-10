import {
  getFixtureFrom,
  listFixturesFrom,
  withOverridesFrom,
} from "../core.js";
import { createResponse } from "../response.js";
import { registry, type RpcFixtureDataMap } from "./registry.js";
import type { DeepPartial, FixtureId } from "../types.js";

export type RpcFixtureId = Extract<FixtureId, `rpc.${string}`>;
export type { RpcFixtureDataMap };
export type {
  DeepPartial,
  FixtureMeta,
  JsonRpcError,
  JsonRpcSuccess,
} from "../types.js";
export { CONTRACTS } from "../constants.js";

export function getFixture<T = never, K extends RpcFixtureId = RpcFixtureId>(
  id: [T] extends [never] ? K : RpcFixtureId,
): [T] extends [never] ? RpcFixtureDataMap[K] : T {
  return getFixtureFrom(registry, id) as [T] extends [never]
    ? RpcFixtureDataMap[K]
    : T;
}

export function listFixtures(filter?: { tag?: string }) {
  return listFixturesFrom(registry, { ...filter, source: "rpc" });
}

export function withOverrides<
  T = never,
  K extends RpcFixtureId = RpcFixtureId,
>(
  id: K,
  overrides: [T] extends [never]
    ? NoInfer<DeepPartial<RpcFixtureDataMap[K]>>
    : NoInfer<DeepPartial<T>>,
): [T] extends [never] ? RpcFixtureDataMap[K] : T {
  return withOverridesFrom(registry, id, overrides as DeepPartial<unknown>) as [T] extends [never]
    ? RpcFixtureDataMap[K]
    : T;
}

export function fixtureResponse(
  id: RpcFixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
