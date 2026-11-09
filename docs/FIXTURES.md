# Fixture catalog

All fixture payloads are deterministic JSON files under `src/fixtures/`.

| ID                                            | Endpoint                                | Description                                                          | Tags                                    |
| --------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------- | --------------------------------------- |
| `horizon.account.basic`                       | `GET /accounts/{account_id}`            | Account with a native balance only.                                  | `account`, `success`                    |
| `horizon.account.with-trustlines`             | `GET /accounts/{account_id}`            | Account with native, USD, and EUR balances and trustline flags.      | `account`, `trustline`                  |
| `horizon.account.low-balance`                 | `GET /accounts/{account_id}`            | Account with a balance near the minimum reserve.                     | `account`, `balance`                    |
| `horizon.account.not-found`                   | `GET /accounts/{account_id}`            | Standard Horizon 404 account response body.                          | `account`, `error`, `not-found`         |
| `horizon.transaction.payment.success`         | `GET /transactions/{hash}`              | Successful single native payment transaction.                        | `transaction`, `payment`, `success`     |
| `horizon.transaction.multi-op.success`        | `GET /transactions/{hash}`              | Successful transaction containing two payment operations.            | `transaction`, `success`, `multi-op`    |
| `horizon.transaction.failed.bad-seq`          | `GET /transactions/{hash}`              | Transaction rejected because its sequence number is invalid.         | `transaction`, `failure`, `bad-seq`     |
| `horizon.transaction.failed.op-underfunded`   | `GET /transactions/{hash}`              | Failed transaction with an underfunded operation result.             | `transaction`, `failure`, `underfunded` |
| `horizon.transaction.failed.op-no-trust`      | `GET /transactions/{hash}`              | Failed transaction with a missing trustline operation result.        | `transaction`, `failure`, `trustline`   |
| `horizon.transaction.failed.insufficient-fee` | `GET /transactions/{hash}`              | Transaction rejected for insufficient fee.                           | `transaction`, `failure`, `fee`         |
| `horizon.payment.native`                      | `GET /payments/{id}`                    | Native XLM payment operation.                                        | `payment`, `native`                     |
| `horizon.payment.credit-asset`                | `GET /payments/{id}`                    | USD credit asset payment operation.                                  | `payment`, `credit-asset`               |
| `horizon.path-payment.strict-receive`         | `GET /operations/{id}`                  | Strict-receive path payment with one intermediate asset.             | `payment`, `path-payment`               |
| `horizon.operations.list`                     | `GET /accounts/{account_id}/operations` | Paged operation collection containing a payment.                     | `operations`, `list`, `paging`          |
| `horizon.effects.list`                        | `GET /accounts/{account_id}/effects`    | Paged effects collection with an account credited effect.            | `effects`, `list`, `paging`             |
| `horizon.offers.list`                         | `GET /accounts/{account_id}/offers`     | Paged offers collection with one open sell offer.                    | `offers`, `list`, `paging`              |
| `horizon.orderbook.basic`                     | `GET /order_book`                       | Order book for native XLM against USD.                               | `orderbook`, `offers`                   |
| `horizon.ledger.latest`                       | `GET /ledgers/{sequence}`               | Latest closed ledger resource.                                       | `ledger`, `latest`                      |
| `horizon.fee-stats.basic`                     | `GET /fee_stats`                        | Fee inclusion statistics for recent ledgers.                         | `fee`, `stats`                          |
| `horizon.paging.empty-page`                   | `GET /transactions`                     | Empty Horizon collection page with standard links.                   | `paging`, `empty`                       |
| `horizon.paging.next-page`                    | `GET /transactions`                     | Collection page with a deterministic next-page cursor.               | `paging`, `cursor`                      |
| `horizon.root.info`                           | `GET /`                                 | Horizon root info for the Stellar Test Network.                      | `root`, `network`, `info`               |
| `rpc.getHealth.healthy`                       | `rpc:getHealth`                         | Healthy Stellar RPC service response.                                | `health`, `success`                     |
| `rpc.getLatestLedger.basic`                   | `rpc:getLatestLedger`                   | Latest ledger sequence and close time.                               | `ledger`, `latest`                      |
| `rpc.getNetwork.testnet`                      | `rpc:getNetwork`                        | Network identity for Stellar Test Network.                           | `network`, `testnet`                    |
| `rpc.getTransaction.success`                  | `rpc:getTransaction`                    | Successful transaction lookup with valid XDR fields.                 | `transaction`, `success`                |
| `rpc.getTransaction.failed`                   | `rpc:getTransaction`                    | Failed transaction lookup with valid failure result XDR.             | `transaction`, `failure`                |
| `rpc.getTransaction.not-found`                | `rpc:getTransaction`                    | Transaction lookup response for an unavailable hash.                 | `transaction`, `not-found`              |
| `rpc.sendTransaction.pending`                 | `rpc:sendTransaction`                   | Transaction accepted for processing.                                 | `send-transaction`, `pending`           |
| `rpc.sendTransaction.error`                   | `rpc:sendTransaction`                   | Transaction submission returned an XDR error result.                 | `send-transaction`, `error`             |
| `rpc.sendTransaction.duplicate`               | `rpc:sendTransaction`                   | Transaction submission reports an already-known transaction.         | `send-transaction`, `duplicate`         |
| `rpc.sendTransaction.try-again-later`         | `rpc:sendTransaction`                   | Transaction submission should be retried later.                      | `send-transaction`, `retry`             |
| `rpc.simulateTransaction.success`             | `rpc:simulateTransaction`               | Successful simulation with resource fee, cost, and return-value XDR. | `simulate`, `success`, `soroban`        |
| `rpc.simulateTransaction.error`               | `rpc:simulateTransaction`               | Simulation response containing an execution error.                   | `simulate`, `error`, `soroban`          |
| `rpc.simulateTransaction.restore-required`    | `rpc:simulateTransaction`               | Simulation response requiring a footprint restoration transaction.   | `simulate`, `restore`, `soroban`        |
| `rpc.getEvents.contract-events`               | `rpc:getEvents`                         | Contract event page with a deterministic topic and value.            | `events`, `contract`                    |
| `rpc.getEvents.empty`                         | `rpc:getEvents`                         | Empty contract event page.                                           | `events`, `empty`                       |
| `rpc.getLedgerEntries.found`                  | `rpc:getLedgerEntries`                  | Ledger entry lookup returning valid ledger entry XDR.                | `ledger-entries`, `found`               |
| `rpc.getLedgerEntries.empty`                  | `rpc:getLedgerEntries`                  | Ledger entry lookup with no matching entries.                        | `ledger-entries`, `empty`               |
| `rpc.error.invalid-request`                   | `JSON-RPC`                              | JSON-RPC invalid request error response.                             | `error`, `invalid-request`              |
| `rpc.error.method-not-found`                  | `JSON-RPC`                              | JSON-RPC method not found error response.                            | `error`, `method-not-found`             |
