import { getFixtureFrom, listFixturesFrom, withOverridesFrom } from "./core.js";
import { registry, type FixtureDataMap } from "./registry.js";
import { createResponse } from "./response.js";
import type {
  DeepPartial,
  FixtureId,
  FixtureMeta,
  FixtureSource,
} from "./types.js";

export type { FixtureDataMap } from "./registry.js";
export type {
  DeepPartial,
  FixtureId,
  FixtureMeta,
  FixtureSource,
  HorizonAccount,
  HorizonTransaction,
  JsonRpcError,
  JsonRpcSuccess,
} from "./types.js";
export { ACCOUNTS, CONTRACTS, ISSUERS } from "./constants.js";

export function getFixture<
  T = never,
  K extends FixtureId = FixtureId,
>(
  id: [T] extends [never] ? K : FixtureId,
): [T] extends [never] ? FixtureDataMap[K] : T {
  return getFixtureFrom(registry, id) as [T] extends [never]
    ? FixtureDataMap[K]
    : T;
}

export function listFixtures(filter?: {
  source?: FixtureSource;
  tag?: string;
}): FixtureMeta[] {
  return listFixturesFrom(registry, filter);
}

export function withOverrides<
  T = never,
  K extends FixtureId = FixtureId,
>(
  id: K,
  overrides: [T] extends [never]
    ? NoInfer<DeepPartial<FixtureDataMap[K]>>
    : NoInfer<DeepPartial<T>>,
): [T] extends [never] ? FixtureDataMap[K] : T {
  return withOverridesFrom(registry, id, overrides as DeepPartial<unknown>) as [T] extends [never]
    ? FixtureDataMap[K]
    : T;
}

export function fixtureResponse(
  id: FixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
