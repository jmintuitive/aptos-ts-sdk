import {
  AptosConfig,
  Network,
  Aptos,
  Deserializer,
  U64,
  SigningSchemeInput,
  AccountAuthenticator,
  AccountAuthenticatorEd25519,
  AccountAuthenticatorSingleKey,
  Signer,
} from "../../../src";
import { longTestTimeout } from "../../unit/helper";
import { fundAccounts, publishTransferPackage, singleSignerScriptBytecode } from "./helper";

const config = new AptosConfig({ network: Network.LOCAL });
const aptos = new Aptos(config);

describe("sign transaction", () => {
  const contractPublisherAccount = Signer.generate();
  const singleSignerED25519SenderAccount = Signer.generate({ scheme: SigningSchemeInput.Ed25519, legacy: false });
  const legacyED25519SenderAccount = Signer.generate();
  const receiverAccounts = [Signer.generate(), Signer.generate()];
  const singleSignerSecp256k1Account = Signer.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa });
  const secondarySignerAccount = Signer.generate();
  const feePayerAccount = Signer.generate();
  beforeAll(async () => {
    await fundAccounts(aptos, [
      contractPublisherAccount,
      singleSignerED25519SenderAccount,
      legacyED25519SenderAccount,
      singleSignerSecp256k1Account,
      ...receiverAccounts,
      secondarySignerAccount,
      feePayerAccount,
    ]);
    await publishTransferPackage(aptos, contractPublisherAccount);
  }, longTestTimeout);

  describe("it returns the current account authenticator", () => {
    describe("Single Sender ED25519", () => {
      test("it signs a script transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerED25519SenderAccount.accountAddress,
          data: {
            bytecode: singleSignerScriptBytecode,
            functionArguments: [new U64(1), receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
      test("it signs an entry function transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerED25519SenderAccount.accountAddress,
          data: {
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
      test("it signs a multi sig transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerED25519SenderAccount.accountAddress,
          data: {
            multisigAddress: secondarySignerAccount.accountAddress,
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
    });
    describe("Single Sender Secp256k1", () => {
      test("it signs a script transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerSecp256k1Account.accountAddress,
          data: {
            bytecode: singleSignerScriptBytecode,
            functionArguments: [new U64(1), receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerSecp256k1Account,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
      test("it signs an entry function transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerSecp256k1Account.accountAddress,
          data: {
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerSecp256k1Account,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
      test("it signs a multi sig transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: singleSignerSecp256k1Account.accountAddress,
          data: {
            multisigAddress: secondarySignerAccount.accountAddress,
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: singleSignerED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorSingleKey).toBeTruthy();
      });
    });
    describe("Legacy ED25519", () => {
      test("it signs a script transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: legacyED25519SenderAccount.accountAddress,
          data: {
            bytecode: singleSignerScriptBytecode,
            functionArguments: [new U64(1), receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: legacyED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorEd25519).toBeTruthy();
      });
      test("it signs an entry function transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: legacyED25519SenderAccount.accountAddress,
          data: {
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: legacyED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorEd25519).toBeTruthy();
      });
      test("it signs a multi sig transaction", async () => {
        const rawTxn = await aptos.transaction.build.simple({
          sender: legacyED25519SenderAccount.accountAddress,
          data: {
            multisigAddress: secondarySignerAccount.accountAddress,
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        const accountAuthenticator = aptos.transaction.sign({
          signer: legacyED25519SenderAccount,
          transaction: rawTxn,
        });
        expect(accountAuthenticator instanceof AccountAuthenticator).toBeTruthy();
        const deserializer = new Deserializer(accountAuthenticator.bcsToBytes());
        const authenticator = AccountAuthenticator.deserialize(deserializer);
        expect(authenticator instanceof AccountAuthenticatorEd25519).toBeTruthy();
      });
    });
    describe("validate fee payer data on sign transaction", () => {
      test("it fails to sign transaction as fee payer if transaction is not a fee payer transaction", async () => {
        const transaction = await aptos.transaction.build.simple({
          sender: legacyED25519SenderAccount.accountAddress,
          data: {
            function: `${contractPublisherAccount.accountAddress}::transfer::transfer`,
            functionArguments: [1, receiverAccounts[0].accountAddress],
          },
        });
        expect(() =>
          aptos.transaction.signAsFeePayer({
            transaction,
            signer: legacyED25519SenderAccount,
          }),
        ).toThrow();
      });
    });
  });
});
