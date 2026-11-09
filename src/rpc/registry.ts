import fixture0 from "../fixtures/rpc/getHealth-healthy.json";
import fixture1 from "../fixtures/rpc/getLatestLedger-basic.json";
import fixture2 from "../fixtures/rpc/getNetwork-testnet.json";
import fixture3 from "../fixtures/rpc/getTransaction-success.json";
import fixture4 from "../fixtures/rpc/getTransaction-failed.json";
import fixture5 from "../fixtures/rpc/getTransaction-not-found.json";
import fixture6 from "../fixtures/rpc/sendTransaction-pending.json";
import fixture7 from "../fixtures/rpc/sendTransaction-error.json";
import fixture8 from "../fixtures/rpc/sendTransaction-duplicate.json";
import fixture9 from "../fixtures/rpc/sendTransaction-try-again-later.json";
import fixture10 from "../fixtures/rpc/simulateTransaction-success.json";
import fixture11 from "../fixtures/rpc/simulateTransaction-error.json";
import fixture12 from "../fixtures/rpc/simulateTransaction-restore-required.json";
import fixture13 from "../fixtures/rpc/getEvents-contract-events.json";
import fixture14 from "../fixtures/rpc/getEvents-empty.json";
import fixture15 from "../fixtures/rpc/getLedgerEntries-found.json";
import fixture16 from "../fixtures/rpc/getLedgerEntries-empty.json";
import fixture17 from "../fixtures/rpc/error-invalid-request.json";
import fixture18 from "../fixtures/rpc/error-method-not-found.json";
import type { FixtureMeta } from "../types.js";

export const registry: { meta: FixtureMeta; data: unknown }[] = [
  {
    meta: {
      id: "rpc.getHealth.healthy",
      source: "rpc",
      description: "Healthy Stellar RPC service response.",
      tags: ["health", "success"],
      endpoint: "rpc:getHealth",
    },
    data: fixture0,
  },
  {
    meta: {
      id: "rpc.getLatestLedger.basic",
      source: "rpc",
      description: "Latest ledger sequence and close time.",
      tags: ["ledger", "latest"],
      endpoint: "rpc:getLatestLedger",
    },
    data: fixture1,
  },
  {
    meta: {
      id: "rpc.getNetwork.testnet",
      source: "rpc",
      description: "Network identity for Stellar Test Network.",
      tags: ["network", "testnet"],
      endpoint: "rpc:getNetwork",
    },
    data: fixture2,
  },
  {
    meta: {
      id: "rpc.getTransaction.success",
      source: "rpc",
      description: "Successful transaction lookup with valid XDR fields.",
      tags: ["transaction", "success"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture3,
  },
  {
    meta: {
      id: "rpc.getTransaction.failed",
      source: "rpc",
      description: "Failed transaction lookup with valid failure result XDR.",
      tags: ["transaction", "failure"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture4,
  },
  {
    meta: {
      id: "rpc.getTransaction.not-found",
      source: "rpc",
      description: "Transaction lookup response for an unavailable hash.",
      tags: ["transaction", "not-found"],
      endpoint: "rpc:getTransaction",
    },
    data: fixture5,
  },
  {
    meta: {
      id: "rpc.sendTransaction.pending",
      source: "rpc",
      description: "Transaction accepted for processing.",
      tags: ["send-transaction", "pending"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture6,
  },
  {
    meta: {
      id: "rpc.sendTransaction.error",
      source: "rpc",
      description: "Transaction submission returned an XDR error result.",
      tags: ["send-transaction", "error"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture7,
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
    data: fixture8,
  },
  {
    meta: {
      id: "rpc.sendTransaction.try-again-later",
      source: "rpc",
      description: "Transaction submission should be retried later.",
      tags: ["send-transaction", "retry"],
      endpoint: "rpc:sendTransaction",
    },
    data: fixture9,
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
    data: fixture10,
  },
  {
    meta: {
      id: "rpc.simulateTransaction.error",
      source: "rpc",
      description: "Simulation response containing an execution error.",
      tags: ["simulate", "error", "soroban"],
      endpoint: "rpc:simulateTransaction",
    },
    data: fixture11,
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
    data: fixture12,
  },
  {
    meta: {
      id: "rpc.getEvents.contract-events",
      source: "rpc",
      description: "Contract event page with a deterministic topic and value.",
      tags: ["events", "contract"],
      endpoint: "rpc:getEvents",
    },
    data: fixture13,
  },
  {
    meta: {
      id: "rpc.getEvents.empty",
      source: "rpc",
      description: "Empty contract event page.",
      tags: ["events", "empty"],
      endpoint: "rpc:getEvents",
    },
    data: fixture14,
  },
  {
    meta: {
      id: "rpc.getLedgerEntries.found",
      source: "rpc",
      description: "Ledger entry lookup returning valid ledger entry XDR.",
      tags: ["ledger-entries", "found"],
      endpoint: "rpc:getLedgerEntries",
    },
    data: fixture15,
  },
  {
    meta: {
      id: "rpc.getLedgerEntries.empty",
      source: "rpc",
      description: "Ledger entry lookup with no matching entries.",
      tags: ["ledger-entries", "empty"],
      endpoint: "rpc:getLedgerEntries",
    },
    data: fixture16,
  },
  {
    meta: {
      id: "rpc.error.invalid-request",
      source: "rpc",
      description: "JSON-RPC invalid request error response.",
      tags: ["error", "invalid-request"],
      endpoint: "JSON-RPC",
    },
    data: fixture17,
  },
  {
    meta: {
      id: "rpc.error.method-not-found",
      source: "rpc",
      description: "JSON-RPC method not found error response.",
      tags: ["error", "method-not-found"],
      endpoint: "JSON-RPC",
    },
    data: fixture18,
  },
];
