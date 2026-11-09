import {
  getFixtureFrom,
  listFixturesFrom,
  withOverridesFrom,
} from "../core.js";
import { createResponse } from "../response.js";
import { registry } from "./registry.js";
import type { DeepPartial, FixtureId } from "../types.js";

export type HorizonFixtureId = Extract<FixtureId, `horizon.${string}`>;
export type {
  DeepPartial,
  FixtureMeta,
  HorizonAccount,
  HorizonTransaction,
} from "../types.js";
export { ACCOUNTS, ISSUERS } from "../constants.js";

export function getFixture<T = unknown>(id: HorizonFixtureId): T {
  return getFixtureFrom<T>(registry, id);
}

export function listFixtures(filter?: { tag?: string }) {
  return listFixturesFrom(registry, { ...filter, source: "horizon" });
}

export function withOverrides<T>(
  id: HorizonFixtureId,
  overrides: DeepPartial<T>,
): T {
  return withOverridesFrom<T>(registry, id, overrides);
}

export function fixtureResponse(
  id: HorizonFixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
