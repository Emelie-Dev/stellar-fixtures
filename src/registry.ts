import fixture0 from "./fixtures/horizon/account-basic.json";
import fixture1 from "./fixtures/horizon/account-with-trustlines.json";
import fixture2 from "./fixtures/horizon/account-low-balance.json";
import fixture3 from "./fixtures/horizon/account-not-found.json";
import fixture4 from "./fixtures/horizon/transaction-payment-success.json";
import fixture5 from "./fixtures/horizon/transaction-multi-op-success.json";
import fixture6 from "./fixtures/horizon/transaction-failed-bad-seq.json";
import fixture7 from "./fixtures/horizon/transaction-failed-op-underfunded.json";
import fixture8 from "./fixtures/horizon/transaction-failed-op-no-trust.json";
import fixture9 from "./fixtures/horizon/transaction-failed-insufficient-fee.json";
import fixture10 from "./fixtures/horizon/payment-native.json";
import fixture11 from "./fixtures/horizon/payment-credit-asset.json";
import fixture12 from "./fixtures/horizon/path-payment-strict-receive.json";
import fixture13 from "./fixtures/horizon/operations-list.json";
import fixture14 from "./fixtures/horizon/effects-list.json";
import fixture15 from "./fixtures/horizon/offers-list.json";
import fixture16 from "./fixtures/horizon/orderbook-basic.json";
import fixture17 from "./fixtures/horizon/ledger-latest.json";
import fixture18 from "./fixtures/horizon/fee-stats-basic.json";
import fixture19 from "./fixtures/horizon/paging-empty-page.json";
import fixture20 from "./fixtures/horizon/paging-next-page.json";
import fixture21 from "./fixtures/horizon/root-info.json";
import fixture22 from "./fixtures/rpc/getHealth-healthy.json";
import fixture23 from "./fixtures/rpc/getLatestLedger-basic.json";
import fixture24 from "./fixtures/rpc/getNetwork-testnet.json";
import fixture25 from "./fixtures/rpc/getTransaction-success.json";
import fixture26 from "./fixtures/rpc/getTransaction-failed.json";
import fixture27 from "./fixtures/rpc/getTransaction-not-found.json";
import fixture28 from "./fixtures/rpc/sendTransaction-pending.json";
import fixture29 from "./fixtures/rpc/sendTransaction-error.json";
import fixture30 from "./fixtures/rpc/sendTransaction-duplicate.json";
import fixture31 from "./fixtures/rpc/sendTransaction-try-again-later.json";
import fixture32 from "./fixtures/rpc/simulateTransaction-success.json";
import fixture33 from "./fixtures/rpc/simulateTransaction-error.json";
import fixture34 from "./fixtures/rpc/simulateTransaction-restore-required.json";
import fixture35 from "./fixtures/rpc/getEvents-contract-events.json";
import fixture36 from "./fixtures/rpc/getEvents-empty.json";
import fixture37 from "./fixtures/rpc/getLedgerEntries-found.json";
import fixture38 from "./fixtures/rpc/getLedgerEntries-empty.json";
import fixture39 from "./fixtures/rpc/error-invalid-request.json";
import fixture40 from "./fixtures/rpc/error-method-not-found.json";
import type { FixtureMeta } from "./types.js";

export const registry: { meta: FixtureMeta; data: unknown }[] = [
  {
    meta: {
      id: "horizon.account.basic",
      source: "horizon",
      description: "Account with a native balance only.",
      tags: ["account", "success"],
      endpoint: "GET /accounts/{account_id}",
    },
    data: fixture0,
  },
  {
    meta: {
      id: "horizon.account.with-trustlines",
      source: "horizon",
      description:
        "Account with native, USD, and EUR balances and trustline flags.",
      tags: ["account", "trustline"],
      endpoint: "GET /accounts/{account_id}",
    },
    data: fixture1,
  },
  {
    meta: {
      id: "horizon.account.low-balance",
      source: "horizon",
      description: "Account with a balance near the minimum reserve.",
      tags: ["account", "balance"],
      endpoint: "GET /accounts/{account_id}",
    },
    data: fixture2,
  },
  {
    meta: {
      id: "horizon.account.not-found",
      source: "horizon",
      description: "Standard Horizon 404 account response body.",
      tags: ["account", "error", "not-found"],
      endpoint: "GET /accounts/{account_id}",
    },
    data: fixture3,
  },
  {
    meta: {
      id: "horizon.transaction.payment.success",
      source: "horizon",
      description: "Successful single native payment transaction.",
      tags: ["transaction", "payment", "success"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture4,
  },
  {
    meta: {
      id: "horizon.transaction.multi-op.success",
      source: "horizon",
      description: "Successful transaction containing two payment operations.",
      tags: ["transaction", "success", "multi-op"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture5,
  },
  {
    meta: {
      id: "horizon.transaction.failed.bad-seq",
      source: "horizon",
      description:
        "Transaction rejected because its sequence number is invalid.",
      tags: ["transaction", "failure", "bad-seq"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture6,
  },
  {
    meta: {
      id: "horizon.transaction.failed.op-underfunded",
      source: "horizon",
      description: "Failed transaction with an underfunded operation result.",
      tags: ["transaction", "failure", "underfunded"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture7,
  },
  {
    meta: {
      id: "horizon.transaction.failed.op-no-trust",
      source: "horizon",
      description:
        "Failed transaction with a missing trustline operation result.",
      tags: ["transaction", "failure", "trustline"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture8,
  },
  {
    meta: {
      id: "horizon.transaction.failed.insufficient-fee",
      source: "horizon",
      description: "Transaction rejected for insufficient fee.",
      tags: ["transaction", "failure", "fee"],
      endpoint: "GET /transactions/{hash}",
    },
    data: fixture9,
  },
  {
    meta: {
      id: "horizon.payment.native",
      source: "horizon",
      description: "Native XLM payment operation.",
      tags: ["payment", "native"],
      endpoint: "GET /payments/{id}",
    },
    data: fixture10,
  },
  {
    meta: {
      id: "horizon.payment.credit-asset",
      source: "horizon",
      description: "USD credit asset payment operation.",
      tags: ["payment", "credit-asset"],
      endpoint: "GET /payments/{id}",
    },
    data: fixture11,
  },
  {
    meta: {
      id: "horizon.path-payment.strict-receive",
      source: "horizon",
      description: "Strict-receive path payment with one intermediate asset.",
      tags: ["payment", "path-payment"],
      endpoint: "GET /operations/{id}",
    },
    data: fixture12,
  },
  {
    meta: {
      id: "horizon.operations.list",
      source: "horizon",
      description: "Paged operation collection containing a payment.",
      tags: ["operations", "list", "paging"],
      endpoint: "GET /accounts/{account_id}/operations",
    },
    data: fixture13,
  },
  {
    meta: {
      id: "horizon.effects.list",
      source: "horizon",
      description: "Paged effects collection with an account credited effect.",
      tags: ["effects", "list", "paging"],
      endpoint: "GET /accounts/{account_id}/effects",
    },
    data: fixture14,
  },
  {
    meta: {
      id: "horizon.offers.list",
      source: "horizon",
      description: "Paged offers collection with one open sell offer.",
      tags: ["offers", "list", "paging"],
      endpoint: "GET /accounts/{account_id}/offers",
    },
    data: fixture15,
  },
  {
    meta: {
      id: "horizon.orderbook.basic",
      source: "horizon",
      description: "Order book for native XLM against USD.",
      tags: ["orderbook", "offers"],
      endpoint: "GET /order_book",
    },
    data: fixture16,
  },
  {
    meta: {
      id: "horizon.ledger.latest",
      source: "horizon",
      description: "Latest closed ledger resource.",
      tags: ["ledger", "latest"],
      endpoint: "GET /ledgers/{sequence}",
    },
    data: fixture17,
  },
  {
    meta: {
      id: "horizon.fee-stats.basic",
      source: "horizon",
      description: "Fee inclusion statistics for recent ledgers.",
      tags: ["fee", "stats"],
      endpoint: "GET /fee_stats",
    },
    data: fixture18,
  },
  {
    meta: {
      id: "horizon.paging.empty-page",
      source: "horizon",
      description: "Empty Horizon collection page with standard links.",
      tags: ["paging", "empty"],
      endpoint: "GET /transactions",
    },
    data: fixture19,
  },
  {
    meta: {
      id: "horizon.paging.next-page",
      source: "horizon",
      description: "Collection page with a deterministic next-page cursor.",
      tags: ["paging", "cursor"],
      endpoint: "GET /transactions",
    },
    data: fixture20,
  },
  {
    meta: {
      id: "horizon.root.info",
      source: "horizon",
      description: "Horizon root info for the Stellar Test Network.",
      tags: ["root", "network", "info"],
      endpoint: "GET /",
    },
    data: fixture21,
  },
  {
    meta: {
      id: "rpc.getHealth.healthy",
      source: "rpc",
      description: "Healthy Stellar RPC service response.",
      tags: ["health", "success"],
      endpoint: "rpc:getHealth",
    },
    data: fixture22,
  },
  {
    meta: {
      id: "rpc.getLatestLedger.basic",
      source: "rpc",
      description: "Latest ledger sequence and close time.",
      tags: ["ledger", "latest"],
      endpoint: "rpc:getLatestLedger",
    },
    data: fixture23,
  },
  {
    meta: {
      id: "rpc.getNetwork.testnet",
      source: "rpc",
      description: "Network identity for Stellar Test Network.",
      tags: ["network", "testnet"],
      endpoint: "rpc:getNetwork",
    },
    data: fixture24,
  },
  {
    meta: {
      id: "rpc.getTransaction.success",
      source: "rpc",
      description: "Successful transaction lookup with valid XDR fields.",
      tags: ["transaction", "success"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture25,
  },
  {
    meta: {
      id: "rpc.getTransaction.failed",
      source: "rpc",
      description: "Failed transaction lookup with valid failure result XDR.",
      tags: ["transaction", "failure"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture26,
  },
  {
    meta: {
      id: "rpc.getTransaction.not-found",
      source: "rpc",
      description: "Transaction lookup response for an unavailable hash.",
      tags: ["transaction", "not-found"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture27,
  },
  {
    meta: {
      id: "rpc.sendTransaction.pending",
      source: "rpc",
      description: "Transaction accepted for processing.",
      tags: ["send-transaction", "pending"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture28,
  },
  {
    meta: {
      id: "rpc.sendTransaction.error",
      source: "rpc",
      description: "Transaction submission returned an XDR error result.",
      tags: ["send-transaction", "error"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture29,
  },
  {
    meta: {
      id: "rpc.sendTransaction.duplicate",
      source: "rpc",
      description:
        "Transaction submission reports an already-known transaction.",
      tags: ["send-transaction", "duplicate"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture30,
  },
  {
    meta: {
      id: "rpc.sendTransaction.try-again-later",
      source: "rpc",
      description: "Transaction submission should be retried later.",
      tags: ["send-transaction", "retry"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture31,
  },
  {
    meta: {
      id: "rpc.simulateTransaction.success",
      source: "rpc",
      description:
        "Successful simulation with resource fee, cost, and return-value XDR.",
      tags: ["simulate", "success", "soroban"],
      endpoint: "rpc:simulateTransaction",
    },
    data: fixture32,
  },
  {
    meta: {
      id: "rpc.simulateTransaction.error",
      source: "rpc",
      description: "Simulation response containing an execution error.",
      tags: ["simulate", "error", "soroban"],
      endpoint: "rpc:simulateTransaction",
    },
    data: fixture33,
  },
  {
    meta: {
      id: "rpc.simulateTransaction.restore-required",
      source: "rpc",
      description:
        "Simulation response requiring a footprint restoration transaction.",
      tags: ["simulate", "restore", "soroban"],
      endpoint: "rpc:simulateTransaction",
    },
    data: fixture34,
  },
  {
    meta: {
      id: "rpc.getEvents.contract-events",
      source: "rpc",
      description: "Contract event page with a deterministic topic and value.",
      tags: ["events", "contract"],
      endpoint: "rpc:getEvents",
    },
    data: fixture35,
  },
  {
    meta: {
      id: "rpc.getEvents.empty",
      source: "rpc",
      description: "Empty contract event page.",
      tags: ["events", "empty"],
      endpoint: "rpc:getEvents",
    },
    data: fixture36,
  },
  {
    meta: {
      id: "rpc.getLedgerEntries.found",
      source: "rpc",
      description: "Ledger entry lookup returning valid ledger entry XDR.",
      tags: ["ledger-entries", "found"],
      endpoint: "rpc:getLedgerEntries",
    },
    data: fixture37,
  },
  {
    meta: {
      id: "rpc.getLedgerEntries.empty",
      source: "rpc",
      description: "Ledger entry lookup with no matching entries.",
      tags: ["ledger-entries", "empty"],
      endpoint: "rpc:getLedgerEntries",
    },
    data: fixture38,
  },
  {
    meta: {
      id: "rpc.error.invalid-request",
      source: "rpc",
      description: "JSON-RPC invalid request error response.",
      tags: ["error", "invalid-request"],
      endpoint: "JSON-RPC",
    },
    data: fixture39,
  },
  {
    meta: {
      id: "rpc.error.method-not-found",
      source: "rpc",
      description: "JSON-RPC method not found error response.",
      tags: ["error", "method-not-found"],
      endpoint: "JSON-RPC",
    },
    data: fixture40,
  },
];

type RpcFixture<T> = {
  [K in keyof T]: K extends "jsonrpc" ? "2.0" : T[K];
};

export interface FixtureDataMap {
  "horizon.account.basic": typeof fixture0;
  "horizon.account.with-trustlines": typeof fixture1;
  "horizon.account.low-balance": typeof fixture2;
  "horizon.account.not-found": typeof fixture3;
  "horizon.transaction.payment.success": typeof fixture4;
  "horizon.transaction.multi-op.success": typeof fixture5;
  "horizon.transaction.failed.bad-seq": typeof fixture6;
  "horizon.transaction.failed.op-underfunded": typeof fixture7;
  "horizon.transaction.failed.op-no-trust": typeof fixture8;
  "horizon.transaction.failed.insufficient-fee": typeof fixture9;
  "horizon.payment.native": typeof fixture10;
  "horizon.payment.credit-asset": typeof fixture11;
  "horizon.path-payment.strict-receive": typeof fixture12;
  "horizon.operations.list": typeof fixture13;
  "horizon.effects.list": typeof fixture14;
  "horizon.offers.list": typeof fixture15;
  "horizon.orderbook.basic": typeof fixture16;
  "horizon.ledger.latest": typeof fixture17;
  "horizon.fee-stats.basic": typeof fixture18;
  "horizon.paging.empty-page": typeof fixture19;
  "horizon.paging.next-page": typeof fixture20;
  "horizon.root.info": typeof fixture21;
  "rpc.getHealth.healthy": RpcFixture<typeof fixture22>;
  "rpc.getLatestLedger.basic": RpcFixture<typeof fixture23>;
  "rpc.getNetwork.testnet": RpcFixture<typeof fixture24>;
  "rpc.getTransaction.success": RpcFixture<typeof fixture25>;
  "rpc.getTransaction.failed": RpcFixture<typeof fixture26>;
  "rpc.getTransaction.not-found": RpcFixture<typeof fixture27>;
  "rpc.sendTransaction.pending": RpcFixture<typeof fixture28>;
  "rpc.sendTransaction.error": RpcFixture<typeof fixture29>;
  "rpc.sendTransaction.duplicate": RpcFixture<typeof fixture30>;
  "rpc.sendTransaction.try-again-later": RpcFixture<typeof fixture31>;
  "rpc.simulateTransaction.success": RpcFixture<typeof fixture32>;
  "rpc.simulateTransaction.error": RpcFixture<typeof fixture33>;
  "rpc.simulateTransaction.restore-required": RpcFixture<typeof fixture34>;
  "rpc.getEvents.contract-events": RpcFixture<typeof fixture35>;
  "rpc.getEvents.empty": RpcFixture<typeof fixture36>;
  "rpc.getLedgerEntries.found": RpcFixture<typeof fixture37>;
  "rpc.getLedgerEntries.empty": RpcFixture<typeof fixture38>;
  "rpc.error.invalid-request": RpcFixture<typeof fixture39>;
  "rpc.error.method-not-found": RpcFixture<typeof fixture40>;
}
