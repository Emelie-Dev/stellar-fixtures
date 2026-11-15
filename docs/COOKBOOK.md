# Consumer Cookbook

`stellar-fixtures` provides offline, deterministic JSON payloads and pre-encoded XDR strings for unit and integration tests. It makes **no network calls** and requires **no `@stellar/stellar-sdk` or `@stellar/stellar-base` runtime dependency** in consumer projects.

All fixture IDs below exist in the generated [fixture catalog](./FIXTURES.md).

---

## 1. Isolated Clones with `getFixture`

Every call to `getFixture(id)` returns a fresh deep clone. Mutating a returned fixture in one test never leaks state into subsequent tests:

```ts
import { getFixture } from "stellar-fixtures/horizon";
import type { HorizonAccount } from "stellar-fixtures/horizon";
import { expect, it } from "vitest";

it("returns an isolated deep clone on each call", () => {
  const first = getFixture<HorizonAccount>("horizon.account.basic");
  first.sequence = "9999999999999999";

  const second = getFixture<HorizonAccount>("horizon.account.basic");
  expect(second.sequence).toBe("1000000000000000");
});
```

---

## 2. Customizing Nested Fields and Replacing Arrays with `withOverrides`

`withOverrides(id, overrides)` deep-merges nested plain objects onto a cloned fixture, while **arrays are replaced entirely** rather than merged element-by-element:

```ts
import { withOverrides } from "stellar-fixtures";
import type { HorizonAccount, JsonRpcSuccess } from "stellar-fixtures";
import { expect, it } from "vitest";

it("merges nested objects and replaces arrays in withOverrides", () => {
  // 1. Deep-merging nested object properties on an RPC simulation response
  const customSim = withOverrides<
    JsonRpcSuccess<{
      minResourceFee: string;
      cost: { cpuInsns: string; memBytes: string };
    }>
  >("rpc.simulateTransaction.success", {
    result: {
      minResourceFee: "95000",
    },
  });
  expect(customSim.result.minResourceFee).toBe("95000");
  expect(customSim.result.cost.cpuInsns).toBe("142080");

  // 2. Replacing an array (balances is replaced with the single override entry)
  const singleBalanceAccount = withOverrides<HorizonAccount>(
    "horizon.account.with-trustlines",
    {
      balances: [
        {
          balance: "25.0000000",
          asset_type: "native",
        },
      ],
    },
  );
  expect(singleBalanceAccount.balances).toHaveLength(1);
  expect(singleBalanceAccount.balances[0]?.balance).toBe("25.0000000");
});
```

---

## 3. Filtering Fixture Metadata by Source and Tag with `listFixtures`

Use `listFixtures({ source?, tag? })` to discover or iterate over scenario groups (for example, running parameterized tests across all failure fixtures):

```ts
import { getFixture, listFixtures } from "stellar-fixtures";
import { expect, it } from "vitest";

it("filters fixture metadata by source and tag", () => {
  const horizonFailures = listFixtures({ source: "horizon", tag: "failure" });
  expect(horizonFailures.map((meta) => meta.id)).toContain(
    "horizon.transaction.failed.bad-seq",
  );

  const sorobanSimulationFixtures = listFixtures({
    source: "rpc",
    tag: "soroban",
  });
  for (const meta of sorobanSimulationFixtures) {
    const payload = getFixture<Record<string, unknown>>(meta.id);
    expect(payload.jsonrpc).toBe("2.0");
  }
});
```

---

## 4. Mocking HTTP Error Statuses and Headers with `fixtureResponse`

`fixtureResponse(id, { status?, headers? })` builds a standard Web `Response` (default `status: 200`, `content-type: application/json`). Pass a custom `status` (such as `404` or `400`) when testing error handling against mocked `fetch`:

```ts
import { fixtureResponse } from "stellar-fixtures";
import { expect, it, vi } from "vitest";

it("simulates a 404 Horizon account lookup with custom headers", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      fixtureResponse("horizon.account.not-found", {
        status: 404,
        headers: { "x-ratelimit-remaining": "59" },
      }),
    ),
  );

  const response = await fetch(
    "https://horizon-testnet.stellar.org/accounts/GEXAMPLE",
  );
  expect(response.status).toBe(404);
  expect(response.headers.get("x-ratelimit-remaining")).toBe("59");

  const body = (await response.json()) as { status: number; title: string };
  expect(body.status).toBe(404);
  expect(body.title).toBe("Resource Missing");
});
```
