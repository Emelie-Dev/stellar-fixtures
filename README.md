# stellar-fixtures

[![CI](https://github.com/determined-001/stellar-fixtures/actions/workflows/ci.yml/badge.svg)](https://github.com/determined-001/stellar-fixtures/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/stellar-fixtures)](https://www.npmjs.com/package/stellar-fixtures)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Deterministic, typed fixtures for Stellar Horizon and Soroban RPC responses. Hand-written Stellar mocks drift from the actual response shapes; these checked-in examples give tests realistic payloads and valid XDR without making network calls or shipping runtime dependencies.

## Install

```sh
npm install --save-dev stellar-fixtures
```

Requires Node.js 18 or newer.

## Quick start

Use the fetch-compatible `Response` helper in Vitest:

```ts
import { fixtureResponse } from "stellar-fixtures";
import { expect, it, vi } from "vitest";

it("handles an account response", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(fixtureResponse("horizon.account.basic")),
  );
  const response = await fetch(
    "https://horizon-testnet.stellar.org/accounts/example",
  );
  expect(response.status).toBe(200);
  expect((await response.json()).balances[0].asset_type).toBe("native");
});
```

### Horizon

```ts
import { getFixture, listFixtures } from "stellar-fixtures/horizon";
import type { HorizonAccount } from "stellar-fixtures/horizon";

const account = getFixture<HorizonAccount>("horizon.account.with-trustlines");
const paymentFixtures = listFixtures({ tag: "payment" });
```

### Stellar RPC

```ts
import { getFixture } from "stellar-fixtures/rpc";
import type { JsonRpcSuccess } from "stellar-fixtures/rpc";

const health = getFixture<JsonRpcSuccess<{ status: string }>>(
  "rpc.getHealth.healthy",
);
console.log(health.result.status);
```

## API reference

- `getFixture<T>(id)` returns a deep clone on every call.
- `listFixtures({ source?, tag? })` returns cloned metadata for matching fixtures.
- `withOverrides<T>(id, overrides)` deep-merges object properties; arrays are replaced.
- `fixtureResponse(id, { status?, headers? })` builds a JSON `Response` (default status 200).
- `ACCOUNTS`, `ISSUERS`, and `CONTRACTS` contain synthetic, checksummed Stellar strkeys.
- `FixtureId`, `FixtureMeta`, `DeepPartial`, and minimal response interfaces are exported types.

Subpaths `stellar-fixtures/horizon` and `stellar-fixtures/rpc` expose source-specific `getFixture`, `listFixtures`, and `withOverrides` functions and associated types.

See the complete [fixture catalog](./docs/FIXTURES.md).

## Generation and validation

`npm run generate` derives deterministic synthetic keys from fixed seed phrases and writes the generated XDR values into the checked-in JSON files. Generation uses `@stellar/stellar-base` as a development-only tool. `npm run validate` verifies catalog registration, IDs, key checksums, response envelopes, hashes, and the XDR encodings. Neither build nor test contacts a Stellar network.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, fixture authoring, and pull request guidance.

## License

MIT. See [LICENSE](./LICENSE).
