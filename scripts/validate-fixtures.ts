import { readdir, readFile } from "node:fs/promises";
import { StrKey, xdr } from "@stellar/stellar-base";
import { registry } from "../src/registry.js";
import { fixtureIds } from "../src/fixture-ids.js";

const root = new URL("../src/fixtures/", import.meta.url);
const failures: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) failures.push(message);
};
const decodeXdr = (field: string, value: string, path: string) => {
  if (field === "key" && /^[G][A-Z2-7]{55}$/.test(value)) return;
  if (field === "xdr") {
    try {
      xdr.LedgerEntry.fromXDR(value, "base64");
      return;
    } catch {
      try {
        xdr.ScVal.fromXDR(value, "base64");
        return;
      } catch (error) {
        failures.push(`${path}: invalid XDR (${String(error)})`);
        return;
      }
    }
  }
  const decoder =
    field === "envelope_xdr" || field === "envelopeXdr"
      ? xdr.TransactionEnvelope
      : field === "result_xdr" ||
          field === "resultXdr" ||
          field === "errorResultXdr"
        ? xdr.TransactionResult
        : field === "result_meta_xdr" ||
            field === "fee_meta_xdr" ||
            field === "resultMetaXdr"
          ? xdr.TransactionMeta
          : field === "transactionData"
            ? xdr.SorobanTransactionData
            : field === "returnValue" || field === "topic" || field === "value"
              ? xdr.ScVal
              : field === "key" && path.includes("entries")
                ? xdr.LedgerKey
                : undefined;
  if (!decoder) return;
  try {
    decoder.fromXDR(value, "base64");
  } catch (error) {
    failures.push(`${path}: invalid ${field} XDR (${String(error)})`);
  }
};
const inspect = (value: unknown, path: string) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, `${path}[${index}]`));
  } else if (value !== null && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (typeof nested === "string") {
        decodeXdr(key, nested, path);
        for (const match of nested.matchAll(/[GC][A-Z2-7]{55}/g)) {
          const strkey = match[0];
          try {
            if (strkey.startsWith("G")) StrKey.decodeEd25519PublicKey(strkey);
            else StrKey.decodeContract(strkey);
          } catch {
            failures.push(`${path}.${key}: invalid Stellar strkey ${strkey}`);
          }
        }
        if (
          (key === "hash" || key.endsWith("_hash") || key === "txHash") &&
          !/^[0-9a-f]{64}$/.test(nested)
        ) {
          failures.push(
            `${path}.${key}: expected a 64-character lowercase hex hash`,
          );
        }
      } else {
        inspect(nested, `${path}.${key}`);
      }
    }
  }
};

const expectedPaths = new Set(
  fixtureIds.map(
    (id) => `${id.split(".")[0]}/${id.split(".").slice(1).join("-")}.json`,
  ),
);
const actualPaths = new Set<string>();
for (const source of ["horizon", "rpc"] as const) {
  for (const file of await readdir(new URL(`${source}/`, root))) {
    actualPaths.add(`${source}/${file}`);
  }
}
for (const path of expectedPaths)
  check(actualPaths.has(path), `Missing fixture file: ${path}`);
for (const path of actualPaths)
  check(expectedPaths.has(path), `Unregistered fixture file: ${path}`);
check(
  registry.length === fixtureIds.length,
  "Registry and fixture ID counts differ.",
);
check(
  new Set(registry.map(({ meta }) => meta.id)).size === registry.length,
  "Fixture IDs are not unique.",
);

for (const { meta, data } of registry) {
  check(meta.description.trim().length > 0, `${meta.id}: empty description`);
  check(meta.tags.length > 0, `${meta.id}: missing tags`);
  check(meta.endpoint.trim().length > 0, `${meta.id}: missing endpoint`);
  const source = meta.id.split(".", 1)[0];
  check(source === meta.source, `${meta.id}: source does not match ID`);
  if (meta.source === "rpc" && data !== null && typeof data === "object") {
    const body = data as Record<string, unknown>;
    check(body.jsonrpc === "2.0", `${meta.id}: invalid JSON-RPC version`);
    check(
      "result" in body !== "error" in body,
      `${meta.id}: expected result XOR error`,
    );
  }
  inspect(data, meta.id);
}

for (const id of fixtureIds) {
  const [source, ...rest] = id.split(".");
  const path = new URL(`${source}/${rest.join("-")}.json`, root);
  try {
    JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    failures.push(`${id}: fixture JSON cannot be read (${String(error)})`);
  }
}

if (failures.length > 0) {
  console.error(
    `Fixture validation failed (${failures.length} issue(s)):\n- ${failures.join("\n- ")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${registry.length} fixtures, strkeys, XDR payloads, and response envelopes.`,
  );
}
