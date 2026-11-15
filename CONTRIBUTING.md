# Contributing

Thanks for helping improve `stellar-fixtures`.

## Local setup

1. Install Node.js 18 or newer and npm.
2. Clone the repository and run `npm ci`.
3. Run `npm run generate` if you changed key/XDR generation inputs.
4. Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm run validate`, `npm run test:coverage`, and `npm run build`.

## Scripts

- `npm run generate` generates the stable synthetic keys, XDR payloads, fixture JSON, registry, and catalog.
- `npm run validate` checks fixture file/registry integrity and XDR, key, and response shapes.
- `npm test` and `npm run test:coverage` run the test suite.
- `npm run build` creates ESM, CJS, and declaration outputs in `dist/`.
- `npm run dev` watches the package entry point.

## Adding a fixture

1. Choose a source (`horizon` or `rpc`) and a unique ID following the naming convention below.
2. Add the response JSON under `src/fixtures/<source>/`.
3. Add its metadata and payload to the catalog definitions in `scripts/generate-xdr.ts`.
4. Generate valid XDR with `@stellar/stellar-base`; do not hand-author encoded XDR.
5. Run `npm run generate` to refresh generated fixture files, IDs, registry, constants, and [`docs/FIXTURES.md`](./docs/FIXTURES.md).
6. Add or update tests if the fixture introduces a new response shape.
7. Run the full local setup checks and include their results in your PR.

### Fixture ID and filename conventions

IDs use lowercase dotted names: `<source>.<resource>.<scenario>`, where `<source>` is either `horizon` or `rpc` and `<resource>` / `<scenario>` use lowercase kebab-case segments.

During `npm run generate`, `scripts/generate-xdr.ts` strips the `<source>.` prefix and replaces every remaining dot (`.`) with a hyphen (`-`) to resolve the JSON path:

```text
src/fixtures/<source>/<id-without-source-with-hyphens>.json
```

| Convention         | Good example                                                                                   | Bad example                                            | Why                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| ID to file mapping | `horizon.transaction.failed.bad-seq` -> `src/fixtures/horizon/transaction-failed-bad-seq.json` | `src/fixtures/horizon/transaction.failed.bad-seq.json` | Dots after `<source>.` must become hyphens in the filename                  |
| RPC ID casing      | `rpc.getTransaction.not-found` -> `src/fixtures/rpc/getTransaction-not-found.json`             | `rpc.get_transaction.notFound`                         | Match the exact RPC method name followed by a lowercase kebab-case scenario |

### Endpoint metadata and tags

- **`endpoint`:** Must describe the real HTTP route or JSON-RPC method represented by the fixture:
  - **Horizon REST endpoints:** Use `<METHOD> /<path>` with template placeholders in braces (good: `"GET /accounts/{account_id}"`, `"GET /transactions/{hash}"`; bad: `"accounts"` or `"https://horizon-testnet.stellar.org/accounts/G..."`).
  - **Soroban RPC methods:** Use `"rpc:<methodName>"` for method results or `"JSON-RPC"` for protocol-level JSON-RPC errors (good: `"rpc:getTransaction"`, `"rpc:getEvents"`, `"JSON-RPC"`; bad: `"POST /rpc"` or `"getTransaction"`).
- **`tags`:** Provide an array of lowercase, searchable scenario terms (good: `["transaction", "failure", "bad-seq"]`; bad: `["TransactionFailure", "Horizon"]`).

### Horizon paging tokens vs. Soroban RPC event cursors

Horizon paging tokens and Soroban RPC event cursors use distinct formats and are **not interchangeable**:

- **Horizon `paging_token` and `cursor` query parameters:** Numeric ledger/operation sequence strings such as `"500001"` or `"500001-1"` embedded in `_links.next.href` (`?cursor=500001&limit=1`) and record `paging_token` fields.
- **Soroban RPC `getEvents` identifiers and cursors:** Event records use zero-padded composite ledger-and-event IDs such as `"id": "000000500001-0000000001"` alongside `"pagingToken": "500001-1"`. Do not use Horizon URLs in RPC fixtures or zero-padded RPC event IDs as Horizon collection `paging_token` values.

Browse the generated [fixture catalog](./docs/FIXTURES.md) for existing conventions, and use the [Add a fixture issue template](./.github/ISSUE_TEMPLATE/add_fixture.md) when proposing new fixtures.

## Issues and pull requests

Before starting, comment on an open issue to claim it and confirm the acceptance criteria with maintainers. This project participates in Drips Wave, and PRs are reviewed against the issue acceptance criteria. For a new fixture request, use the [Add a fixture issue template](./.github/ISSUE_TEMPLATE/add_fixture.md).

Use [Conventional Commits](https://www.conventionalcommits.org/), such as `feat: add RPC ledger-entry fixtures` or `fix: correct transaction result XDR`.

PR checklist:

- [ ] The change is scoped to the issue and preserves deterministic fixture data.
- [ ] XDR values decode using the matching Stellar XDR type.
- [ ] Registry and catalog documentation are regenerated.
- [ ] Formatting, lint, typecheck, validation, tests, and build pass.
- [ ] Public API and behavior changes are documented.
