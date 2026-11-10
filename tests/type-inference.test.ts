import { describe, expect, it } from "vitest";
import {
  getFixture,
  withOverrides,
  type FixtureDataMap,
} from "../src/index.js";
import {
  getFixture as getHorizonFixture,
  withOverrides as overrideHorizonFixture,
  type HorizonFixtureDataMap,
} from "../src/horizon/index.js";
import {
  getFixture as getRpcFixture,
  withOverrides as overrideRpcFixture,
  type RpcFixtureDataMap,
} from "../src/rpc/index.js";

describe("type inference and catalog mapping", () => {
  it("infers exact fixture payload shapes without type arguments", () => {
    // 1. Horizon account fixture infers account shape
    const account = getFixture("horizon.account.basic");
    expect(account.account_id).toBeDefined();
    expect(account.sequence).toBeDefined();
    expect(account.balances[0].asset_type).toBe("native");
    const _typeCheckAccount: FixtureDataMap["horizon.account.basic"] = account;
    expect(_typeCheckAccount.subentry_count).toBe(0);

    // 2. RPC getHealth fixture infers JSON-RPC envelope
    const health = getFixture("rpc.getHealth.healthy");
    expect(health.jsonrpc).toBe("2.0");
    expect(health.result.status).toBe("healthy");
    const _typeCheckHealth: FixtureDataMap["rpc.getHealth.healthy"] = health;
    expect(_typeCheckHealth.result.status).toBe("healthy");

    // 3. Horizon subpath getFixture infers HorizonFixtureDataMap
    const horizonAccount = getHorizonFixture("horizon.account.basic");
    const _typeCheckHorizon: HorizonFixtureDataMap["horizon.account.basic"] =
      horizonAccount;
    expect(_typeCheckHorizon.paging_token).toBe("500001");

    // 4. RPC subpath getFixture infers RpcFixtureDataMap
    const rpcHealth = getRpcFixture("rpc.getHealth.healthy");
    const _typeCheckRpc: RpcFixtureDataMap["rpc.getHealth.healthy"] = rpcHealth;
    expect(_typeCheckRpc.jsonrpc).toBe("2.0");
  });

  it("infers overrides and produces inferred return types", () => {
    // Valid partial overrides produce inferred return type
    const customSeq = withOverrides("horizon.account.basic", {
      sequence: "999999",
      flags: { auth_required: true },
    });
    expect(customSeq.sequence).toBe("999999");
    expect(customSeq.flags.auth_required).toBe(true);
    const _typeCheckOverridden: FixtureDataMap["horizon.account.basic"] =
      customSeq;
    expect(_typeCheckOverridden.sequence).toBe("999999");

    const customHealth = withOverrides("rpc.getHealth.healthy", {
      id: 42,
    });
    expect(customHealth.id).toBe(42);

    const customHorizon = overrideHorizonFixture("horizon.account.basic", {
      subentry_count: 5,
    });
    expect(customHorizon.subentry_count).toBe(5);

    const customRpc = overrideRpcFixture("rpc.getHealth.healthy", {
      id: 99,
    });
    expect(customRpc.id).toBe(99);
  });

  it("preserves explicit caller-supplied generic escape hatch", () => {
    interface CustomAccountView {
      account_id: string;
      custom_client_flag?: boolean;
    }

    const explicit = getFixture<CustomAccountView>("horizon.account.basic");
    expect(explicit.account_id).toBeDefined();

    const explicitOverride = withOverrides<CustomAccountView>(
      "horizon.account.basic",
      { custom_client_flag: true },
    );
    expect(explicitOverride.custom_client_flag).toBe(true);

    const explicitHorizon = getHorizonFixture<CustomAccountView>(
      "horizon.account.basic",
    );
    expect(explicitHorizon.account_id).toBeDefined();

    const explicitHorizonOverride = overrideHorizonFixture<CustomAccountView>(
      "horizon.account.basic",
      { custom_client_flag: true },
    );
    expect(explicitHorizonOverride.custom_client_flag).toBe(true);

    interface CustomRpc {
      version: string;
    }

    const explicitRpc = getRpcFixture<CustomRpc>("rpc.getHealth.healthy");
    expect(explicitRpc.version).toBeUndefined();

    const explicitRpcOverride = overrideRpcFixture<CustomRpc>(
      "rpc.getHealth.healthy",
      { version: "v2" },
    );
    expect(explicitRpcOverride.version).toBe("v2");
  });

  it("rejects invalid fields and cross-source fixture IDs at compile time", () => {
    // Negative type tests verified by tsc via @ts-expect-error directives:

    // @ts-expect-error Invalid property rejected on withOverrides
    withOverrides("horizon.account.basic", { nonExistentProperty: "bad" });

    // @ts-expect-error Invalid nested property rejected on withOverrides
    withOverrides("horizon.account.basic", { flags: { invalidFlag: true } });

    // @ts-expect-error Invalid property rejected on overrideHorizonFixture
    overrideHorizonFixture("horizon.account.basic", { unknownProp: 123 });

    // @ts-expect-error Invalid property rejected on overrideRpcFixture
    overrideRpcFixture("rpc.getHealth.healthy", { invalidStatus: 123 });

    // @ts-expect-error RPC ID rejected by Horizon getFixture
    expect(() => getHorizonFixture("rpc.getHealth.healthy")).toThrow(
      RangeError,
    );

    // @ts-expect-error Horizon ID rejected by RPC getFixture
    expect(() => getRpcFixture("horizon.account.basic")).toThrow(RangeError);

    // @ts-expect-error RPC ID rejected by Horizon withOverrides
    expect(() => overrideHorizonFixture("rpc.getHealth.healthy", {})).toThrow(
      RangeError,
    );

    // @ts-expect-error Horizon ID rejected by RPC withOverrides
    expect(() => overrideRpcFixture("horizon.account.basic", {})).toThrow(
      RangeError,
    );
  });

  it("preserves deep-clone isolation on inferred and overridden fixtures", () => {
    const acc1 = getFixture("horizon.account.basic");
    const acc2 = getFixture("horizon.account.basic");
    expect(acc1).not.toBe(acc2);
    expect(acc1.balances).not.toBe(acc2.balances);

    const overridden = withOverrides("horizon.account.basic", {
      sequence: "modified-seq",
    });
    const fresh = getFixture("horizon.account.basic");
    expect(overridden.sequence).toBe("modified-seq");
    expect(fresh.sequence).toBe("1000000000000001");
  });
});
