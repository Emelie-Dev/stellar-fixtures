import { getFixtureFrom, listFixturesFrom, withOverridesFrom } from "./core.js";
import { registry } from "./registry.js";
import { createResponse } from "./response.js";
import type {
  DeepPartial,
  FixtureId,
  FixtureMeta,
  FixtureSource,
} from "./types.js";

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

export function getFixture<T = unknown>(id: FixtureId): T {
  return getFixtureFrom<T>(registry, id);
}

export function listFixtures(filter?: {
  source?: FixtureSource;
  tag?: string;
}): FixtureMeta[] {
  return listFixturesFrom(registry, filter);
}

export function withOverrides<T>(id: FixtureId, overrides: DeepPartial<T>): T {
  return withOverridesFrom(registry, id, overrides);
}

export function fixtureResponse(
  id: FixtureId,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return createResponse(getFixture(id), init);
}
