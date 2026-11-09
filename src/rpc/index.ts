import {
  getFixtureFrom,
  listFixturesFrom,
  withOverridesFrom,
} from "../core.js";
import { createResponse } from "../response.js";
import { registry } from "./registry.js";
import type { DeepPartial, FixtureId } from "../types.js";

export type RpcFixtureId = Extract<FixtureId, `rpc.${string}`>;
export type {
  DeepPartial,
  FixtureMeta,
  JsonRpcError,
  JsonRpcSuccess,
} from "../types.js";
export { CONTRACTS } from "../constants.js";

export function getFixture<T = unknown>(id: RpcFixtureId): T {
  return getFixtureFrom<T>(registry, id);
}

export function listFixtures(filter?: { tag?: string }) {
  return listFixturesFrom(registry, { ...filter, source: "rpc" });
}

export function withOverrides<T>(
  id: RpcFixtureId,
  overrides: DeepPartial<T>,
): T {
  return withOverridesFrom<T>(registry, id, overrides);
}

export function fixtureResponse(
  id: RpcFixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
