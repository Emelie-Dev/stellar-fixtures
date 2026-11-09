import { readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { StrKey, xdr } from "@stellar/stellar-base";
import { getFixture, listFixtures, withOverrides } from "../src/index.js";
import { registry } from "../src/registry.js";
import { fixtureIds } from "../src/fixture-ids.js";
import {
  fixtureResponse as horizonResponse,
  getFixture as getHorizonFixture,
  listFixtures as listHorizonFixtures,
  withOverrides as overrideHorizonFixture,
} from "../src/horizon/index.js";
import {
  fixtureResponse as rpcResponse,
  getFixture as getRpcFixture,
  listFixtures as listRpcFixtures,
  withOverrides as overrideRpcFixture,
} from "../src/rpc/index.js";

const fixtureRoot = new URL("../src/fixtures/", import.meta.url);

function verifyPayload(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(verifyPayload);
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [field, nested] of Object.entries(value)) {
    if (typeof nested === "string") {
      const decoders: Record<
        string,
        { fromXDR(input: string, format: "base64"): unknown }
      > = {
        envelope_xdr: xdr.TransactionEnvelope,
        envelopeXdr: xdr.TransactionEnvelope,
        result_xdr: xdr.TransactionResult,
        resultXdr: xdr.TransactionResult,
        errorResultXdr: xdr.TransactionResult,
        result_meta_xdr: xdr.TransactionMeta,
        fee_meta_xdr: xdr.TransactionMeta,
        resultMetaXdr: xdr.TransactionMeta,
        transactionData: xdr.SorobanTransactionData,
        returnValue: xdr.ScVal,
        topic: xdr.ScVal,
        value: xdr.ScVal,
        key: xdr.LedgerKey,
        xdr: xdr.LedgerEntry,
      };
      if (field === "xdr") {
        try {
          xdr.LedgerEntry.fromXDR(nested, "base64");
        } catch {
          xdr.ScVal.fromXDR(nested, "base64");
        }
      } else if (field !== "key" || !nested.startsWith("G")) {
        decoders[field]?.fromXDR(nested, "base64");
      }
      for (const match of nested.matchAll(/[GC][A-Z2-7]{55}/g)) {
        if (match[0].startsWith("G")) StrKey.decodeEd25519PublicKey(match[0]);
        else StrKey.decodeContract(match[0]);
      }
      if (field === "hash" || field.endsWith("_hash") || field === "txHash") {
        expect(nested).toMatch(/^[0-9a-f]{64}$/);
      }
    } else {
      verifyPayload(nested);
    }
  }
}

describe("fixture catalog", () => {
  it("registers every JSON file exactly once with complete metadata", async () => {
    expect(registry).toHaveLength(fixtureIds.length);
    expect(new Set(registry.map(({ meta }) => meta.id)).size).toBe(
      registry.length,
    );
    for (const entry of registry) {
      expect(entry.meta.description.trim()).not.toBe("");
      expect(entry.meta.tags.length).toBeGreaterThan(0);
      expect(entry.meta.endpoint.trim()).not.toBe("");
      const [source, ...rest] = entry.meta.id.split(".");
      expect(entry.meta.source).toBe(source);
      const path = `${source}/${rest.join("-")}.json`;
      expect(await readdir(new URL(`${source}/`, fixtureRoot))).toContain(
        path.split("/")[1],
      );
    }
    for (const source of ["horizon", "rpc"]) {
      const entries = registry.filter((entry) => entry.meta.source === source);
      const files = await readdir(new URL(`${source}/`, fixtureRoot));
      expect(files).toHaveLength(entries.length);
    }
  });

  it("filters cloned fixture metadata by source and tag", () => {
    expect(
      listFixtures({ source: "rpc" }).every((item) => item.source === "rpc"),
    ).toBe(true);
    expect(
      listFixtures({ tag: "payment" }).every((item) =>
        item.tags.includes("payment"),
      ),
    ).toBe(true);
    expect(
      listFixtures({ source: "horizon", tag: "payment" }).length,
    ).toBeGreaterThan(0);
    const metadata = listFixtures();
    metadata[0].tags.push("mutated");
    expect(listFixtures()[0].tags).not.toContain("mutated");
  });

  it("provides isolated source-specific APIs and response helpers", async () => {
    expect(
      getHorizonFixture<{ balances: unknown[] }>("horizon.account.basic"),
    ).toHaveProperty("balances");
    expect(listHorizonFixtures({ tag: "payment" }).length).toBeGreaterThan(0);
    expect(
      overrideHorizonFixture("horizon.account.basic", { sequence: "9" }),
    ).toHaveProperty("sequence", "9");
    expect(
      (await horizonResponse("horizon.account.basic").json()).account_id,
    ).toBe(
      getHorizonFixture<{ account_id: string }>("horizon.account.basic")
        .account_id,
    );

    expect(getRpcFixture("rpc.getHealth.healthy")).toHaveProperty(
      "result.status",
      "healthy",
    );
    expect(listRpcFixtures({ tag: "health" })).toHaveLength(1);
    expect(
      overrideRpcFixture("rpc.getHealth.healthy", { id: 2 }),
    ).toHaveProperty("id", 2);
    expect((await rpcResponse("rpc.getHealth.healthy").json()).jsonrpc).toBe(
      "2.0",
    );
  });

  it("deep-clones fixtures on every retrieval", () => {
    const first = getFixture<{ balances: Array<{ balance: string }> }>(
      "horizon.account.basic",
    );
    first.balances[0].balance = "0";
    expect(
      getFixture<{ balances: Array<{ balance: string }> }>(
        "horizon.account.basic",
      ).balances[0].balance,
    ).not.toBe("0");
    expect(() =>
      getFixture("unknown.fixture" as (typeof fixtureIds)[number]),
    ).toThrow(RangeError);
  });

  it("deep-merges object overrides, replaces arrays, and preserves the source", () => {
    const original = getFixture<{
      flags: Record<string, boolean>;
      balances: unknown[];
    }>("horizon.account.basic");
    const changed = withOverrides<typeof original>("horizon.account.basic", {
      flags: { auth_required: true },
      balances: [{ asset_type: "native", balance: "4" }],
    });
    expect(changed.flags.auth_required).toBe(true);
    expect(changed.flags.auth_revocable).toBe(false);
    expect(changed.balances).toHaveLength(1);
    const withNewObject = withOverrides<typeof original>(
      "horizon.account.basic",
      { flags: { added: true } },
    );
    expect(withNewObject.flags.added).toBe(true);
    expect(getFixture<typeof original>("horizon.account.basic")).toEqual(
      original,
    );
    expect(
      withOverrides("horizon.account.basic", { sequence: "9" }),
    ).toHaveProperty("sequence", "9");
  });

  it("validates response category shapes, hashes, XDR, and synthetic strkeys", () => {
    for (const { meta, data } of registry) {
      verifyPayload(data);
      if (meta.source === "rpc") {
        const body = data as Record<string, unknown>;
        expect(body.jsonrpc).toBe("2.0");
        expect("result" in body !== "error" in body).toBe(true);
      }
      if (meta.id.startsWith("horizon.transaction.")) {
        const body = data as Record<string, unknown>;
        expect(body).toHaveProperty("hash");
        expect(body).toHaveProperty("ledger");
        expect(body).toHaveProperty("source_account");
        expect(body).toHaveProperty("envelope_xdr");
      }
    }
  });
});
