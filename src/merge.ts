import { deepClone } from "./clone.js";
import type { DeepPartial } from "./types.js";

export function deepMerge<T>(target: T, overrides: DeepPartial<T>): T {
  if (
    target === null ||
    typeof target !== "object" ||
    overrides === null ||
    typeof overrides !== "object" ||
    Array.isArray(target) ||
    Array.isArray(overrides)
  ) {
    return deepClone(overrides as T);
  }

  const result = deepClone(target) as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    const current = result[key];
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      result[key] = deepMerge(current, value as DeepPartial<typeof current>);
    } else {
      result[key] = deepClone(value);
    }
  }
  return result as T;
}
