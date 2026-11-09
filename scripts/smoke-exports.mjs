import assert from "node:assert/strict";
import { createRequire } from "node:module";

const esmRoot = await import("stellar-fixtures");
const esmHorizon = await import("stellar-fixtures/horizon");
const esmRpc = await import("stellar-fixtures/rpc");
const require = createRequire(import.meta.url);
const cjsRoot = require("stellar-fixtures");
const cjsHorizon = require("stellar-fixtures/horizon");
const cjsRpc = require("stellar-fixtures/rpc");

for (const api of [esmRoot, cjsRoot]) {
  assert.equal(api.getFixture("horizon.account.basic").account_id.length, 56);
}
for (const api of [esmHorizon, cjsHorizon]) {
  assert.equal(
    api.getFixture("horizon.account.basic").balances[0].asset_type,
    "native",
  );
  assert.ok(
    api.listFixtures().every((fixture) => fixture.source === "horizon"),
  );
}
for (const api of [esmRpc, cjsRpc]) {
  assert.equal(
    api.getFixture("rpc.getHealth.healthy").result.status,
    "healthy",
  );
  assert.ok(api.listFixtures().every((fixture) => fixture.source === "rpc"));
}

console.log("ESM and CJS root and source subpath exports work.");
