import { deepClone } from "./clone.js";
import { deepMerge } from "./merge.js";
import type {
  DeepPartial,
  FixtureId,
  FixtureMeta,
  FixtureSource,
} from "./types.js";

export interface FixtureRecord {
  meta: FixtureMeta;
  data: unknown;
}

export function getFixtureFrom<T = unknown>(
  records: readonly FixtureRecord[],
  id: FixtureId,
): T {
  const record = records.find((entry) => entry.meta.id === id);
  if (!record) throw new RangeError(`Unknown fixture id: ${id}`);
  return deepClone(record.data) as T;
}

export function listFixturesFrom(
  records: readonly FixtureRecord[],
  filter?: { source?: FixtureSource; tag?: string },
): FixtureMeta[] {
  return records
    .filter(
      ({ meta }) =>
        (filter?.source === undefined || meta.source === filter.source) &&
        (filter?.tag === undefined || meta.tags.includes(filter.tag)),
    )
    .map(({ meta }) => deepClone(meta));
}

export function withOverridesFrom<T>(
  records: readonly FixtureRecord[],
  id: FixtureId,
  overrides: DeepPartial<T>,
): T {
  return deepMerge(getFixtureFrom<T>(records, id), overrides);
}
