import { describe, expect, it } from "vitest";
import { fixtureResponse } from "../src/index.js";

describe("fixtureResponse", () => {
  it("returns JSON with a default status and content type", async () => {
    const response = fixtureResponse("rpc.getHealth.healthy");
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(await response.json()).toMatchObject({
      jsonrpc: "2.0",
      result: { status: "healthy" },
    });
  });

  it("supports custom status and headers", async () => {
    const response = fixtureResponse("horizon.account.not-found", {
      status: 404,
      headers: {
        "x-fixture": "test",
        "content-type": "application/vnd.api+json",
      },
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("x-fixture")).toBe("test");
    expect(response.headers.get("content-type")).toBe(
      "application/vnd.api+json",
    );
    expect(await response.json()).toHaveProperty("status", 404);
  });
});
