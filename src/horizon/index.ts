import {
  getFixtureFrom,
  listFixturesFrom,
  withOverridesFrom,
} from "../core.js";
import { createResponse } from "../response.js";
import { registry, type HorizonFixtureDataMap } from "./registry.js";
import type { DeepPartial, FixtureId } from "../types.js";

export type HorizonFixtureId = Extract<FixtureId, `horizon.${string}`>;
export type { HorizonFixtureDataMap };
export type {
  DeepPartial,
  FixtureMeta,
  HorizonAccount,
  HorizonTransaction,
} from "../types.js";
export { ACCOUNTS, ISSUERS } from "../constants.js";

export function getFixture<
  T = never,
  K extends HorizonFixtureId = HorizonFixtureId,
>(
  id: [T] extends [never] ? K : HorizonFixtureId,
): [T] extends [never] ? HorizonFixtureDataMap[K] : T {
  return getFixtureFrom(registry, id) as [T] extends [never]
    ? HorizonFixtureDataMap[K]
    : T;
}

export function listFixtures(filter?: { tag?: string }) {
  return listFixturesFrom(registry, { ...filter, source: "horizon" });
}

export function withOverrides<
  T = never,
  K extends HorizonFixtureId = HorizonFixtureId,
>(
  id: K,
  overrides: [T] extends [never]
    ? NoInfer<DeepPartial<HorizonFixtureDataMap[K]>>
    : NoInfer<DeepPartial<T>>,
): [T] extends [never] ? HorizonFixtureDataMap[K] : T {
  return withOverridesFrom(registry, id, overrides as DeepPartial<unknown>) as [T] extends [never]
    ? HorizonFixtureDataMap[K]
    : T;
}

export function fixtureResponse(
  id: HorizonFixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
