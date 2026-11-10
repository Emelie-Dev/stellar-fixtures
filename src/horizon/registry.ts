import fixture0 from "../fixtures/horizon/account-basic.json";
import fixture1 from "../fixtures/horizon/account-with-trustlines.json";
import fixture2 from "../fixtures/horizon/account-low-balance.json";
import fixture3 from "../fixtures/horizon/account-not-found.json";
import fixture4 from "../fixtures/horizon/transaction-payment-success.json";
import fixture5 from "../fixtures/horizon/transaction-multi-op-success.json";
import fixture6 from "../fixtures/horizon/transaction-failed-bad-seq.json";
import fixture7 from "../fixtures/horizon/transaction-failed-op-underfunded.json";
import fixture8 from "../fixtures/horizon/transaction-failed-op-no-trust.json";
import fixture9 from "../fixtures/horizon/transaction-failed-insufficient-fee.json";
import fixture10 from "../fixtures/horizon/payment-native.json";
import fixture11 from "../fixtures/horizon/payment-credit-asset.json";
import fixture12 from "../fixtures/horizon/path-payment-strict-receive.json";
import fixture13 from "../fixtures/horizon/operations-list.json";
import fixture14 from "../fixtures/horizon/effects-list.json";
import fixture15 from "../fixtures/horizon/offers-list.json";
import fixture16 from "../fixtures/horizon/orderbook-basic.json";
import fixture17 from "../fixtures/horizon/ledger-latest.json";
import fixture18 from "../fixtures/horizon/fee-stats-basic.json";
import fixture19 from "../fixtures/horizon/paging-empty-page.json";
import fixture20 from "../fixtures/horizon/paging-next-page.json";
import fixture21 from "../fixtures/horizon/root-info.json";
import type { FixtureMeta } from "../types.js";

export interface HorizonFixtureDataMap {
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
}

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
];

export interface HorizonFixtureDataMap {
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
}
