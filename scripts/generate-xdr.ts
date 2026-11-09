import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import {
  Account,
  Asset,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-base";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import { ACCOUNTS, CONTRACTS, ISSUERS } from "../src/constants.js";

type JsonRecord = Record<string, unknown>;
interface Definition {
  id: string;
  source: "horizon" | "rpc";
  description: string;
  tags: string[];
  endpoint: string;
  data: JsonRecord;
}

const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const writeFormatted = async (
  url: URL,
  content: string,
  parser: "json" | "typescript" | "markdown",
) => {
  await writeFile(
    url,
    await format(content, { filepath: fileURLToPath(url), parser }),
    "utf8",
  );
};
const time = "2024-01-02T03:04:05Z";
const horizon = "https://horizon-testnet.stellar.org";
const usd = {
  asset_type: "credit_alphanum4",
  asset_code: "USD",
  asset_issuer: "USD_ISSUER",
};
const eur = {
  asset_type: "credit_alphanum4",
  asset_code: "EUR",
  asset_issuer: "EUR_ISSUER",
};
const seq = "1000000000000001";
const buildTransaction = (operationCount = 1) => {
  const keypair = Keypair.fromRawEd25519Seed(
    createHash("sha256")
      .update("stellar-fixtures synthetic primary account v1")
      .digest(),
  );
  const builder = new TransactionBuilder(
    new Account(keypair.publicKey(), seq),
    {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    },
  );
  for (let i = 0; i < operationCount; i += 1) {
    builder.addOperation(
      Operation.payment({
        destination: ACCOUNTS.recipient,
        asset: Asset.native(),
        amount: "1.2500000",
      }),
    );
  }
  const tx = builder.setTimeout(60).build();
  tx.sign(keypair);
  return tx;
};
const txHash = (operationCount = 1) =>
  buildTransaction(operationCount).hash().toString("hex");
const envelope = (operationCount = 1): string =>
  buildTransaction(operationCount).toXDR();
const resultXdr = (
  failed = false,
  badSequence = false,
  insufficientFee = false,
): string =>
  new xdr.TransactionResult({
    feeCharged: xdr.Int64.fromString("100"),
    result: badSequence
      ? xdr.TransactionResultResult.txBadSeq()
      : insufficientFee
        ? xdr.TransactionResultResult.txInsufficientFee()
        : failed
          ? xdr.TransactionResultResult.txFailed([])
          : xdr.TransactionResultResult.txSuccess([]),
    ext: xdr.TransactionResultExt.fromXDR(Buffer.alloc(4)),
  }).toXDR("base64");
const metaXdr = () =>
  xdr.TransactionMeta.fromXDR(Buffer.alloc(8)).toXDR("base64");
const valueXdr = (value: string) => xdr.ScVal.scvString(value).toXDR("base64");
const ledgerXdr = () => {
  const data = xdr.LedgerEntryData.ttl(
    new xdr.TtlEntry({
      keyHash: Buffer.from(hash("stellar-fixtures ledger key"), "hex"),
      liveUntilLedgerSeq: 500100,
    }),
  );
  return new xdr.LedgerEntry({
    lastModifiedLedgerSeq: 500001,
    data,
    ext: xdr.LedgerEntryExt.fromXDR(Buffer.alloc(4)),
  }).toXDR("base64");
};
const ledgerKeyXdr = () =>
  xdr.LedgerKey.ttl(
    new xdr.LedgerKeyTtl({
      keyHash: Buffer.from(hash("stellar-fixtures ledger key"), "hex"),
    }),
  ).toXDR("base64");
const transactionDataXdr = () =>
  new xdr.SorobanTransactionData({
    ext: xdr.ExtensionPoint.fromXDR(Buffer.alloc(4)),
    resources: new xdr.SorobanResources({
      footprint: new xdr.LedgerFootprint({ readOnly: [], readWrite: [] }),
      instructions: 1000,
      readBytes: 256,
      writeBytes: 0,
    }),
    resourceFee: xdr.Int64.fromString("100"),
  }).toXDR("base64");
const payment = (id: string, asset: JsonRecord) => ({
  _links: {
    self: { href: `${horizon}/payments/${id}` },
    transaction: { href: `${horizon}/transactions/${txHash()}` },
  },
  id,
  paging_token: `${500001}-1`,
  transaction_hash: txHash(),
  created_at: time,
  source_account: ACCOUNTS.primary,
  type: "payment",
  type_i: 1,
  asset_type: asset.asset_type,
  ...(asset.asset_type === "native"
    ? {}
    : { asset_code: asset.asset_code, asset_issuer: asset.asset_issuer }),
  from: ACCOUNTS.primary,
  to: ACCOUNTS.recipient,
  amount: "10.0000000",
});
const transaction = (
  _id: string,
  options: { failed?: boolean; badSequence?: boolean; count?: number } = {},
) => ({
  _links: {
    self: { href: `${horizon}/transactions/${txHash(options.count ?? 1)}` },
  },
  id: txHash(options.count ?? 1),
  paging_token: "500001",
  successful: !options.failed,
  hash: txHash(options.count ?? 1),
  ledger: 500001,
  created_at: time,
  source_account: ACCOUNTS.primary,
  source_account_sequence: seq,
  fee_account: ACCOUNTS.primary,
  fee_charged: "100",
  max_fee: "100",
  operation_count: options.count ?? 1,
  envelope_xdr: envelope(options.count ?? 1),
  result_xdr: resultXdr(options.failed, options.badSequence),
  result_meta_xdr: metaXdr(),
  fee_meta_xdr: metaXdr(),
  memo_type: "none",
  signatures: [],
});
const rpc = (id: number, result: JsonRecord) => ({
  jsonrpc: "2.0",
  id,
  result,
});
const rpcError = (id: number, code: number, message: string) => ({
  jsonrpc: "2.0",
  id,
  error: { code, message },
});
const rpcResultXdr = resultXdr();
const scval = valueXdr("stellar-fixtures");
const definitions: Definition[] = [
  {
    id: "horizon.account.basic",
    source: "horizon",
    description: "Account with a native balance only.",
    tags: ["account", "success"],
    endpoint: "GET /accounts/{account_id}",
    data: {
      id: ACCOUNTS.primary,
      account_id: ACCOUNTS.primary,
      sequence: seq,
      subentry_count: 0,
      last_modified_ledger: 500001,
      last_modified_time: time,
      thresholds: { low: "1", med: "1", high: "1" },
      flags: {
        auth_required: false,
        auth_revocable: false,
        auth_immutable: false,
        auth_clawback_enabled: false,
      },
      balances: [
        {
          balance: "1000.0000000",
          buying_liabilities: "0.0000000",
          selling_liabilities: "0.0000000",
          asset_type: "native",
          is_authorized: true,
          is_authorized_to_maintain_liabilities: true,
          is_clawback_enabled: false,
        },
      ],
      signers: [
        { weight: 1, key: ACCOUNTS.primary, type: "ed25519_public_key" },
      ],
      data: {},
      paging_token: "500001",
    },
  },
  {
    id: "horizon.account.with-trustlines",
    source: "horizon",
    description:
      "Account with native, USD, and EUR balances and trustline flags.",
    tags: ["account", "trustline"],
    endpoint: "GET /accounts/{account_id}",
    data: {
      id: ACCOUNTS.primary,
      account_id: ACCOUNTS.primary,
      sequence: seq,
      subentry_count: 2,
      last_modified_ledger: 500001,
      last_modified_time: time,
      thresholds: { low: "1", med: "1", high: "1" },
      flags: {
        auth_required: false,
        auth_revocable: true,
        auth_immutable: false,
        auth_clawback_enabled: false,
      },
      balances: [
        {
          balance: "1000.0000000",
          buying_liabilities: "0.0000000",
          selling_liabilities: "0.0000000",
          asset_type: "native",
          is_authorized: true,
          is_authorized_to_maintain_liabilities: true,
          is_clawback_enabled: false,
        },
        {
          balance: "50.0000000",
          buying_liabilities: "1.0000000",
          selling_liabilities: "0.0000000",
          limit: "1000.0000000",
          asset_type: usd.asset_type,
          asset_code: usd.asset_code,
          asset_issuer: "USD_ISSUER",
          is_authorized: true,
          is_authorized_to_maintain_liabilities: true,
          is_clawback_enabled: false,
        },
        {
          balance: "25.0000000",
          buying_liabilities: "0.0000000",
          selling_liabilities: "0.0000000",
          limit: "500.0000000",
          asset_type: eur.asset_type,
          asset_code: eur.asset_code,
          asset_issuer: "EUR_ISSUER",
          is_authorized: false,
          is_authorized_to_maintain_liabilities: true,
          is_clawback_enabled: false,
        },
      ],
      signers: [
        { weight: 1, key: ACCOUNTS.primary, type: "ed25519_public_key" },
      ],
      data: {},
      paging_token: "500001",
    },
  },
  {
    id: "horizon.account.low-balance",
    source: "horizon",
    description: "Account with a balance near the minimum reserve.",
    tags: ["account", "balance"],
    endpoint: "GET /accounts/{account_id}",
    data: {
      id: ACCOUNTS.secondary,
      account_id: ACCOUNTS.secondary,
      sequence: "2000000000000001",
      subentry_count: 0,
      last_modified_ledger: 500001,
      last_modified_time: time,
      thresholds: { low: "1", med: "1", high: "1" },
      flags: {
        auth_required: false,
        auth_revocable: false,
        auth_immutable: false,
        auth_clawback_enabled: false,
      },
      balances: [
        {
          balance: "1.0000000",
          buying_liabilities: "0.0000000",
          selling_liabilities: "0.0000000",
          asset_type: "native",
          is_authorized: true,
          is_authorized_to_maintain_liabilities: true,
          is_clawback_enabled: false,
        },
      ],
      signers: [
        { weight: 1, key: ACCOUNTS.secondary, type: "ed25519_public_key" },
      ],
      data: {},
      paging_token: "500001",
    },
  },
  {
    id: "horizon.account.not-found",
    source: "horizon",
    description: "Standard Horizon 404 account response body.",
    tags: ["account", "error", "not-found"],
    endpoint: "GET /accounts/{account_id}",
    data: {
      type: "https://stellar.org/horizon-errors/not_found",
      title: "Resource Missing",
      status: 404,
      detail: "The resource at this URL does not exist.",
    },
  },
  {
    id: "horizon.transaction.payment.success",
    source: "horizon",
    description: "Successful single native payment transaction.",
    tags: ["transaction", "payment", "success"],
    endpoint: "GET /transactions/{hash}",
    data: transaction("payment-success"),
  },
  {
    id: "horizon.transaction.multi-op.success",
    source: "horizon",
    description: "Successful transaction containing two payment operations.",
    tags: ["transaction", "success", "multi-op"],
    endpoint: "GET /transactions/{hash}",
    data: transaction("multi-op", { count: 2 }),
  },
  {
    id: "horizon.transaction.failed.bad-seq",
    source: "horizon",
    description: "Transaction rejected because its sequence number is invalid.",
    tags: ["transaction", "failure", "bad-seq"],
    endpoint: "GET /transactions/{hash}",
    data: {
      ...transaction("bad-seq", { failed: true, badSequence: true }),
      successful: false,
      extras: {
        result_codes: { transaction: "tx_bad_seq" },
        result_xdr: resultXdr(false, true),
      },
    },
  },
  {
    id: "horizon.transaction.failed.op-underfunded",
    source: "horizon",
    description: "Failed transaction with an underfunded operation result.",
    tags: ["transaction", "failure", "underfunded"],
    endpoint: "GET /transactions/{hash}",
    data: {
      ...transaction("op-underfunded", { failed: true }),
      extras: {
        result_codes: {
          transaction: "tx_failed",
          operations: ["op_underfunded"],
        },
        result_xdr: resultXdr(true),
      },
    },
  },
  {
    id: "horizon.transaction.failed.op-no-trust",
    source: "horizon",
    description:
      "Failed transaction with a missing trustline operation result.",
    tags: ["transaction", "failure", "trustline"],
    endpoint: "GET /transactions/{hash}",
    data: {
      ...transaction("op-no-trust", { failed: true }),
      extras: {
        result_codes: { transaction: "tx_failed", operations: ["op_no_trust"] },
        result_xdr: resultXdr(true),
      },
    },
  },
  {
    id: "horizon.transaction.failed.insufficient-fee",
    source: "horizon",
    description: "Transaction rejected for insufficient fee.",
    tags: ["transaction", "failure", "fee"],
    endpoint: "GET /transactions/{hash}",
    data: {
      ...transaction("insufficient-fee", { failed: true }),
      result_xdr: resultXdr(false, false, true),
      extras: {
        result_codes: { transaction: "tx_insufficient_fee" },
        result_xdr: resultXdr(false, false, true),
      },
    },
  },
  {
    id: "horizon.payment.native",
    source: "horizon",
    description: "Native XLM payment operation.",
    tags: ["payment", "native"],
    endpoint: "GET /payments/{id}",
    data: payment("native-payment", { asset_type: "native" }),
  },
  {
    id: "horizon.payment.credit-asset",
    source: "horizon",
    description: "USD credit asset payment operation.",
    tags: ["payment", "credit-asset"],
    endpoint: "GET /payments/{id}",
    data: payment("credit-payment", { ...usd, asset_issuer: ACCOUNTS.primary }),
  },
  {
    id: "horizon.path-payment.strict-receive",
    source: "horizon",
    description: "Strict-receive path payment with one intermediate asset.",
    tags: ["payment", "path-payment"],
    endpoint: "GET /operations/{id}",
    data: {
      ...payment("path-payment", { ...usd, asset_issuer: ACCOUNTS.primary }),
      type: "path_payment_strict_receive",
      type_i: 2,
      source_asset_type: "native",
      source_amount: "12.0000000",
      source_max: "15.0000000",
      path: [],
      source_account: ACCOUNTS.primary,
    },
  },
  {
    id: "horizon.operations.list",
    source: "horizon",
    description: "Paged operation collection containing a payment.",
    tags: ["operations", "list", "paging"],
    endpoint: "GET /accounts/{account_id}/operations",
    data: {
      _links: {
        self: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/operations?limit=1&order=asc`,
        },
        next: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/operations?cursor=500001-1&limit=1&order=asc`,
        },
        prev: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/operations?cursor=500001-1&limit=1&order=desc`,
        },
      },
      _embedded: {
        records: [payment("operation-record", { asset_type: "native" })],
      },
    },
  },
  {
    id: "horizon.effects.list",
    source: "horizon",
    description: "Paged effects collection with an account credited effect.",
    tags: ["effects", "list", "paging"],
    endpoint: "GET /accounts/{account_id}/effects",
    data: {
      _links: {
        self: { href: `${horizon}/accounts/${ACCOUNTS.primary}/effects` },
        next: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/effects?cursor=500001-1`,
        },
        prev: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/effects?cursor=500001-1&order=desc`,
        },
      },
      _embedded: {
        records: [
          {
            _links: {
              operation: { href: `${horizon}/operations/operation-record` },
            },
            id: "500001-1",
            paging_token: "500001-1",
            account: ACCOUNTS.recipient,
            type: "account_credited",
            type_i: 2,
            created_at: time,
            asset_type: "native",
            amount: "10.0000000",
            starting_balance: "20.0000000",
          },
        ],
      },
    },
  },
  {
    id: "horizon.offers.list",
    source: "horizon",
    description: "Paged offers collection with one open sell offer.",
    tags: ["offers", "list", "paging"],
    endpoint: "GET /accounts/{account_id}/offers",
    data: {
      _links: {
        self: { href: `${horizon}/accounts/${ACCOUNTS.primary}/offers` },
        next: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/offers?cursor=1`,
        },
        prev: {
          href: `${horizon}/accounts/${ACCOUNTS.primary}/offers?cursor=1&order=desc`,
        },
      },
      _embedded: {
        records: [
          {
            _links: {
              self: { href: `${horizon}/offers/1` },
              offer_maker: { href: `${horizon}/accounts/${ACCOUNTS.primary}` },
            },
            id: "1",
            paging_token: "1",
            seller: ACCOUNTS.primary,
            selling: { asset_type: "native" },
            buying: { ...usd, asset_issuer: ACCOUNTS.primary },
            amount: "25.0000000",
            price_r: { n: 2, d: 1 },
            price: "2.0000000",
            last_modified_ledger: 500001,
            last_modified_time: time,
          },
        ],
      },
    },
  },
  {
    id: "horizon.orderbook.basic",
    source: "horizon",
    description: "Order book for native XLM against USD.",
    tags: ["orderbook", "offers"],
    endpoint: "GET /order_book",
    data: {
      bids: [
        { price_r: { n: 2, d: 1 }, price: "2.0000000", amount: "25.0000000" },
      ],
      asks: [
        { price_r: { n: 3, d: 1 }, price: "3.0000000", amount: "15.0000000" },
      ],
      base: { asset_type: "native" },
      counter: { ...usd, asset_issuer: ACCOUNTS.primary },
    },
  },
  {
    id: "horizon.ledger.latest",
    source: "horizon",
    description: "Latest closed ledger resource.",
    tags: ["ledger", "latest"],
    endpoint: "GET /ledgers/{sequence}",
    data: {
      _links: {
        self: { href: `${horizon}/ledgers/500001` },
        transactions: { href: `${horizon}/ledgers/500001/transactions` },
        operations: { href: `${horizon}/ledgers/500001/operations` },
        payments: { href: `${horizon}/ledgers/500001/payments` },
        effects: { href: `${horizon}/ledgers/500001/effects` },
      },
      id: hash("stellar-fixtures ledger 500001"),
      paging_token: "500001",
      hash: hash("stellar-fixtures ledger 500001"),
      sequence: 500001,
      successful_transaction_count: 4,
      failed_transaction_count: 1,
      operation_count: 5,
      tx_set_operation_count: 5,
      closed_at: time,
      total_coins: "100000000000.0000000",
      fee_pool: "100000000.0000000",
      base_fee_in_stroops: 100,
      base_reserve_in_stroops: 5000000,
      max_tx_set_size: 100,
      protocol_version: 21,
    },
  },
  {
    id: "horizon.fee-stats.basic",
    source: "horizon",
    description: "Fee inclusion statistics for recent ledgers.",
    tags: ["fee", "stats"],
    endpoint: "GET /fee_stats",
    data: {
      last_ledger: "500001",
      last_ledger_base_fee: 100,
      ledger_capacity_usage: "0.5",
      fee_charged: {
        max: "200",
        min: "100",
        mode: "100",
        p10: "100",
        p20: "100",
        p30: "100",
        p40: "100",
        p50: "100",
        p60: "100",
        p70: "100",
        p80: "100",
        p90: "150",
        p95: "200",
        p99: "200",
      },
      max_fee: {
        max: "500",
        min: "100",
        mode: "100",
        p10: "100",
        p20: "100",
        p30: "100",
        p40: "100",
        p50: "100",
        p60: "100",
        p70: "100",
        p80: "200",
        p90: "300",
        p95: "400",
        p99: "500",
      },
    },
  },
  {
    id: "horizon.paging.empty-page",
    source: "horizon",
    description: "Empty Horizon collection page with standard links.",
    tags: ["paging", "empty"],
    endpoint: "GET /transactions",
    data: {
      _links: {
        self: { href: `${horizon}/transactions?limit=10` },
        next: { href: `${horizon}/transactions?limit=10&order=asc` },
        prev: { href: `${horizon}/transactions?limit=10&order=desc` },
      },
      _embedded: { records: [] },
    },
  },
  {
    id: "horizon.paging.next-page",
    source: "horizon",
    description: "Collection page with a deterministic next-page cursor.",
    tags: ["paging", "cursor"],
    endpoint: "GET /transactions",
    data: {
      _links: {
        self: { href: `${horizon}/transactions?limit=1` },
        next: { href: `${horizon}/transactions?cursor=500001&limit=1` },
        prev: {
          href: `${horizon}/transactions?cursor=500001&limit=1&order=desc`,
        },
      },
      _embedded: { records: [transaction("next-page")] },
    },
  },
  {
    id: "horizon.root.info",
    source: "horizon",
    description: "Horizon root info for the Stellar Test Network.",
    tags: ["root", "network", "info"],
    endpoint: "GET /",
    data: {
      _links: {
        self: { href: `${horizon}/` },
        account: { href: `${horizon}/accounts/{account_id}`, templated: true },
        accounts: {
          href: `${horizon}/accounts{?signer,sdp,asset,cursor,limit,order}`,
          templated: true,
        },
        transaction: {
          href: `${horizon}/transactions/{hash}`,
          templated: true,
        },
        transactions: {
          href: `${horizon}/transactions{?cursor,limit,order}`,
          templated: true,
        },
      },
      horizon_version: "2.30.0",
      core_version: "stellar-core 20.0.0",
      ingest_latest_ledger: 500001,
      history_latest_ledger: 500001,
      history_latest_ledger_closed_at: time,
      history_elder_ledger: 1,
      core_latest_ledger: 500001,
      network_passphrase: Networks.TESTNET,
      current_protocol_version: 21,
      supported_protocol_version: 21,
    },
  },
  {
    id: "rpc.getHealth.healthy",
    source: "rpc",
    description: "Healthy Stellar RPC service response.",
    tags: ["health", "success"],
    endpoint: "rpc:getHealth",
    data: rpc(1, { status: "healthy" }),
  },
  {
    id: "rpc.getLatestLedger.basic",
    source: "rpc",
    description: "Latest ledger sequence and close time.",
    tags: ["ledger", "latest"],
    endpoint: "rpc:getLatestLedger",
    data: rpc(1, {
      id: "0000000000000000000000000000000000000000000000000000000000000000",
      sequence: 500001,
      closeTime: "1704164645",
    }),
  },
  {
    id: "rpc.getNetwork.testnet",
    source: "rpc",
    description: "Network identity for Stellar Test Network.",
    tags: ["network", "testnet"],
    endpoint: "rpc:getNetwork",
    data: rpc(1, { passphrase: Networks.TESTNET, protocolVersion: 21 }),
  },
  {
    id: "rpc.getTransaction.success",
    source: "rpc",
    description: "Successful transaction lookup with valid XDR fields.",
    tags: ["transaction", "success"],
    endpoint: "rpc:getTransaction",
    data: rpc(1, {
      status: "SUCCESS",
      latestLedger: 500001,
      latestLedgerCloseTime: "1704164645",
      oldestLedger: 400000,
      oldestLedgerCloseTime: "1703164645",
      applicationOrder: 1,
      feeBump: false,
      envelopeXdr: envelope(),
      resultXdr: rpcResultXdr,
      resultMetaXdr: metaXdr(),
      ledger: 500001,
    }),
  },
  {
    id: "rpc.getTransaction.failed",
    source: "rpc",
    description: "Failed transaction lookup with valid failure result XDR.",
    tags: ["transaction", "failure"],
    endpoint: "rpc:getTransaction",
    data: rpc(1, {
      status: "FAILED",
      latestLedger: 500001,
      latestLedgerCloseTime: "1704164645",
      oldestLedger: 400000,
      oldestLedgerCloseTime: "1703164645",
      applicationOrder: 0,
      feeBump: false,
      envelopeXdr: envelope(),
      resultXdr: resultXdr(true),
      resultMetaXdr: metaXdr(),
      ledger: 500001,
    }),
  },
  {
    id: "rpc.getTransaction.not-found",
    source: "rpc",
    description: "Transaction lookup response for an unavailable hash.",
    tags: ["transaction", "not-found"],
    endpoint: "rpc:getTransaction",
    data: rpc(1, { status: "NOT_FOUND" }),
  },
  {
    id: "rpc.sendTransaction.pending",
    source: "rpc",
    description: "Transaction accepted for processing.",
    tags: ["send-transaction", "pending"],
    endpoint: "rpc:sendTransaction",
    data: rpc(1, { status: "PENDING", hash: txHash() }),
  },
  {
    id: "rpc.sendTransaction.error",
    source: "rpc",
    description: "Transaction submission returned an XDR error result.",
    tags: ["send-transaction", "error"],
    endpoint: "rpc:sendTransaction",
    data: rpc(1, {
      status: "ERROR",
      hash: txHash(),
      errorResultXdr: resultXdr(true),
    }),
  },
  {
    id: "rpc.sendTransaction.duplicate",
    source: "rpc",
    description: "Transaction submission reports an already-known transaction.",
    tags: ["send-transaction", "duplicate"],
    endpoint: "rpc:sendTransaction",
    data: rpc(1, { status: "DUPLICATE", hash: txHash() }),
  },
  {
    id: "rpc.sendTransaction.try-again-later",
    source: "rpc",
    description: "Transaction submission should be retried later.",
    tags: ["send-transaction", "retry"],
    endpoint: "rpc:sendTransaction",
    data: rpc(1, { status: "TRY_AGAIN_LATER", hash: txHash() }),
  },
  {
    id: "rpc.simulateTransaction.success",
    source: "rpc",
    description:
      "Successful simulation with resource fee, cost, and return-value XDR.",
    tags: ["simulate", "success", "soroban"],
    endpoint: "rpc:simulateTransaction",
    data: rpc(1, {
      latestLedger: 500001,
      minResourceFee: "100",
      transactionData: transactionDataXdr(),
      cost: { cpuInsns: "1000", memBytes: "256" },
      results: [{ auth: [], xdr: scval, returnValue: scval }],
      events: [],
      restorePreamble: null,
    }),
  },
  {
    id: "rpc.simulateTransaction.error",
    source: "rpc",
    description: "Simulation response containing an execution error.",
    tags: ["simulate", "error", "soroban"],
    endpoint: "rpc:simulateTransaction",
    data: rpc(1, {
      error: "HostError: Error(Storage, MissingValue)",
      latestLedger: 500001,
      events: [],
      results: [],
    }),
  },
  {
    id: "rpc.simulateTransaction.restore-required",
    source: "rpc",
    description:
      "Simulation response requiring a footprint restoration transaction.",
    tags: ["simulate", "restore", "soroban"],
    endpoint: "rpc:simulateTransaction",
    data: rpc(1, {
      latestLedger: 500001,
      minResourceFee: "100",
      results: [],
      restorePreamble: {
        minResourceFee: "100",
        transactionData: transactionDataXdr(),
      },
    }),
  },
  {
    id: "rpc.getEvents.contract-events",
    source: "rpc",
    description: "Contract event page with a deterministic topic and value.",
    tags: ["events", "contract"],
    endpoint: "rpc:getEvents",
    data: rpc(1, {
      events: [
        {
          type: "contract",
          ledger: 500001,
          ledgerClosedAt: time,
          contractId: CONTRACTS.token,
          id: "000000500001-0000000001",
          pagingToken: "500001-1",
          topic: [valueXdr("transfer")],
          value: scval,
          inSuccessfulContractCall: true,
          txHash: txHash(),
        },
      ],
      latestLedger: 500001,
    }),
  },
  {
    id: "rpc.getEvents.empty",
    source: "rpc",
    description: "Empty contract event page.",
    tags: ["events", "empty"],
    endpoint: "rpc:getEvents",
    data: rpc(1, { events: [], latestLedger: 500001 }),
  },
  {
    id: "rpc.getLedgerEntries.found",
    source: "rpc",
    description: "Ledger entry lookup returning valid ledger entry XDR.",
    tags: ["ledger-entries", "found"],
    endpoint: "rpc:getLedgerEntries",
    data: rpc(1, {
      entries: [
        {
          key: ledgerKeyXdr(),
          xdr: ledgerXdr(),
          lastModifiedLedgerSeq: 500001,
          liveUntilLedgerSeq: 500100,
        },
      ],
      latestLedger: 500001,
    }),
  },
  {
    id: "rpc.getLedgerEntries.empty",
    source: "rpc",
    description: "Ledger entry lookup with no matching entries.",
    tags: ["ledger-entries", "empty"],
    endpoint: "rpc:getLedgerEntries",
    data: rpc(1, { entries: [], latestLedger: 500001 }),
  },
  {
    id: "rpc.error.invalid-request",
    source: "rpc",
    description: "JSON-RPC invalid request error response.",
    tags: ["error", "invalid-request"],
    endpoint: "JSON-RPC",
    data: rpcError(1, -32600, "Invalid Request"),
  },
  {
    id: "rpc.error.method-not-found",
    source: "rpc",
    description: "JSON-RPC method not found error response.",
    tags: ["error", "method-not-found"],
    endpoint: "JSON-RPC",
    data: rpcError(1, -32601, "Method not found"),
  },
];

const issuerMap: Record<string, string> = {
  USD_ISSUER: ISSUERS.usd,
  EUR_ISSUER: ISSUERS.eur,
};
const json = (value: unknown) =>
  JSON.parse(
    JSON.stringify(value).replace(/"USD_ISSUER"|"EUR_ISSUER"/g, (key) =>
      JSON.stringify(issuerMap[key.slice(1, -1)]),
    ),
  ) as JsonRecord;

for (const fixture of definitions) {
  const category = fixture.source;
  const filename =
    fixture.id.slice(category.length + 1).replaceAll(".", "-") + ".json";
  const directory = new URL(`../src/fixtures/${category}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFormatted(
    new URL(filename, directory),
    `${JSON.stringify(json(fixture.data), null, 2)}\n`,
    "json",
  );
}

const imports = definitions
  .map((fixture, index) => {
    const category = fixture.source;
    const filename = fixture.id.slice(category.length + 1).replaceAll(".", "-");
    const variable = `fixture${index}`;
    return `import ${variable} from "./fixtures/${category}/${filename}.json";`;
  })
  .join("\n");
const entries = definitions
  .map((fixture, index) => {
    const variable = `fixture${index}`;
    const meta = {
      id: fixture.id,
      source: fixture.source,
      description: fixture.description,
      tags: fixture.tags,
      endpoint: fixture.endpoint,
    };
    return `  { meta: ${JSON.stringify(meta)}, data: ${variable} },`;
  })
  .join("\n");
const registry = `${imports}\nimport type { FixtureMeta } from "./types.js";\n\nexport const registry: { meta: FixtureMeta; data: unknown }[] = [\n${entries}\n];\n`;
await writeFormatted(
  new URL("../src/registry.ts", import.meta.url),
  registry,
  "typescript",
);
for (const source of ["horizon", "rpc"] as const) {
  const sourceDefinitions = definitions.filter(
    (fixture) => fixture.source === source,
  );
  const sourceImports = sourceDefinitions
    .map((fixture, index) => {
      const filename = fixture.id.slice(source.length + 1).replaceAll(".", "-");
      return `import fixture${index} from "../fixtures/${source}/${filename}.json";`;
    })
    .join("\n");
  const sourceEntries = sourceDefinitions
    .map((fixture, index) => {
      const meta = {
        id: fixture.id,
        source: fixture.source,
        description: fixture.description,
        tags: fixture.tags,
        endpoint: fixture.endpoint,
      };
      return `  { meta: ${JSON.stringify(meta)}, data: fixture${index} },`;
    })
    .join("\n");
  const sourceRegistry = `${sourceImports}\nimport type { FixtureMeta } from "../types.js";\n\nexport const registry: { meta: FixtureMeta; data: unknown }[] = [\n${sourceEntries}\n];\n`;
  await writeFormatted(
    new URL(`../src/${source}/registry.ts`, import.meta.url),
    sourceRegistry,
    "typescript",
  );
}
const ids = definitions.map(({ id }) => `  ${JSON.stringify(id)},`).join("\n");
await writeFormatted(
  new URL("../src/fixture-ids.ts", import.meta.url),
  `export const fixtureIds = [\n${ids}\n] as const;\n`,
  "typescript",
);
const table = [
  "# Fixture catalog",
  "",
  "All fixture payloads are deterministic JSON files under `src/fixtures/`.",
  "",
  "| ID | Endpoint | Description | Tags |",
  "| --- | --- | --- | --- |",
  ...definitions.map(
    (fixture) =>
      `| \`${fixture.id}\` | \`${fixture.endpoint}\` | ${fixture.description} | ${fixture.tags.map((tag) => `\`${tag}\``).join(", ")} |`,
  ),
  "",
];
await mkdir(new URL("../docs/", import.meta.url), { recursive: true });
await writeFormatted(
  new URL("../docs/FIXTURES.md", import.meta.url),
  `${table.join("\n")}`,
  "markdown",
);

console.log(
  `Generated ${definitions.length} JSON fixtures and registry entries.`,
);
