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
5. Run `npm run generate` to refresh generated fixture files, IDs, registry, constants, and `docs/FIXTURES.md`.
6. Add or update tests if the fixture introduces a new response shape.
7. Run the full local setup checks and include their results in your PR.

IDs use lowercase dotted names: `<source>.<resource>.<scenario>`, for example `horizon.payment.native` or `rpc.getTransaction.success`. Use descriptive scenario names for failures and edge cases.

## Issues and pull requests

Before starting, comment on an open issue to claim it and confirm the acceptance criteria with maintainers. This project participates in Drips Wave, and PRs are reviewed against the issue acceptance criteria. For a new fixture request, use the Add a fixture issue template.

Use [Conventional Commits](https://www.conventionalcommits.org/), such as `feat: add RPC ledger-entry fixtures` or `fix: correct transaction result XDR`.

PR checklist:

- [ ] The change is scoped to the issue and preserves deterministic fixture data.
- [ ] XDR values decode using the matching Stellar XDR type.
- [ ] Registry and catalog documentation are regenerated.
- [ ] Formatting, lint, typecheck, validation, tests, and build pass.
- [ ] Public API and behavior changes are documented.
