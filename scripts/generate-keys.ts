import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Keypair, StrKey } from "@stellar/stellar-base";
import { format } from "prettier";

const publicKey = (seed: string) =>
  Keypair.fromRawEd25519Seed(
    createHash("sha256").update(seed).digest(),
  ).publicKey();
const contractId = (seed: string) =>
  StrKey.encodeContract(createHash("sha256").update(seed).digest());

const constants = {
  ACCOUNTS: {
    primary: publicKey("stellar-fixtures synthetic primary account v1"),
    secondary: publicKey("stellar-fixtures synthetic secondary account v1"),
    recipient: publicKey("stellar-fixtures synthetic recipient account v1"),
  },
  ISSUERS: {
    usd: publicKey("stellar-fixtures synthetic USD issuer v1"),
    eur: publicKey("stellar-fixtures synthetic EUR issuer v1"),
  },
  CONTRACTS: {
    token: contractId("stellar-fixtures synthetic token contract v1"),
    counter: contractId("stellar-fixtures synthetic counter contract v1"),
  },
};

const body = Object.entries(constants)
  .map(([group, entries]) => {
    const values = Object.entries(entries)
      .map(([name, value]) => `    ${name}: ${JSON.stringify(value)},`)
      .join("\n");
    return `export const ${group} = {\n${values}\n} as const;`;
  })
  .join("\n\n");

const output = new URL("../src/constants.ts", import.meta.url);
await writeFile(
  output,
  await format(`${body}\n`, { filepath: fileURLToPath(output) }),
  "utf8",
);
