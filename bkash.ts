/**
 * bKash gateway helper.
 *
 * In production this would call the real bKash Tokenized Checkout API:
 *   - https://checkout.pay.bka.sh/v1.2.0-beta/checkout/token/grant
 *   - https://checkout.pay.bka.sh/v1.2.0-beta/checkout/create
 *   - https://checkout.pay.bka.sh/v1.2.0-beta/checkout/execute
 *
 * For this demo we simulate the entire flow locally so the UI can be
 * exercised end-to-end without live credentials. Swap the function
 * bodies for real HTTP calls when you have a merchant account.
 */

import { generateId } from "./utils";

type BkashCreds = {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  baseURL: string;
};

function readCreds(): BkashCreds {
  return {
    appKey: process.env.BKASH_APP_KEY ?? "sandbox-app-key",
    appSecret: process.env.BKASH_APP_SECRET ?? "sandbox-app-secret",
    username: process.env.BKASH_USERNAME ?? "sandboxUser",
    password: process.env.BKASH_PASSWORD ?? "sandboxPass",
    baseURL:
      process.env.BKASH_BASE_URL ??
      "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
  };
}

function hasLiveCreds(): boolean {
  return Boolean(
    process.env.BKASH_APP_KEY &&
      process.env.BKASH_APP_SECRET &&
      process.env.BKASH_USERNAME &&
      process.env.BKASH_PASSWORD,
  );
}

export type BkashCreateResponse = {
  paymentID: string;
  bkashURL: string;
  invoice: string;
  amount: number;
  mode: "live" | "sandbox";
};

export type BkashExecuteResponse = {
  paymentID: string;
  trxID: string;
  status: "success" | "failed";
  amount: number;
  invoice: string;
};

async function tokenGrant(creds: BkashCreds): Promise<string> {
  const res = await fetch(`${creds.baseURL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: creds.username,
      password: creds.password,
    },
    body: JSON.stringify({
      app_key: creds.appKey,
      app_secret: creds.appSecret,
    }),
  });
  if (!res.ok) throw new Error(`bkash token grant failed: ${res.status}`);
  const data = (await res.json()) as { id_token: string };
  return data.id_token;
}

async function createPaymentLive(
  creds: BkashCreds,
  token: string,
  amount: number,
  invoice: string,
  callback: string,
): Promise<BkashCreateResponse> {
  const res = await fetch(
    `${creds.baseURL}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        "x-app-key": creds.appKey,
      },
      body: JSON.stringify({
        mode: "pay",
        amount,
        currency: "BDT",
        intent: "sale",
        payerReference: invoice,
        callbackURL: callback,
        merchantInvoice: invoice,
      }),
    },
  );
  if (!res.ok) throw new Error(`bkash create failed: ${res.status}`);
  const data = (await res.json()) as {
    paymentID: string;
    bkashURL: string;
  };
  return {
    paymentID: data.paymentID,
    bkashURL: data.bkashURL,
    invoice,
    amount,
    mode: "live",
  };
}

export async function createPayment(
  amount: number,
  invoice: string,
  callbackUrl: string,
): Promise<BkashCreateResponse> {
  if (hasLiveCreds()) {
    const creds = readCreds();
    const token = await tokenGrant(creds);
    return createPaymentLive(creds, token, amount, invoice, callbackUrl);
  }
  // Simulated sandbox flow
  const paymentID = generateId("bkp");
  return {
    paymentID,
    bkashURL: `/api/payment/bkash/verify?paymentID=${paymentID}`,
    invoice,
    amount,
    mode: "sandbox",
  };
}

export async function executePayment(
  paymentID: string,
  amount: number,
  invoice: string,
): Promise<BkashExecuteResponse> {
  if (hasLiveCreds()) {
    const creds = readCreds();
    const token = await tokenGrant(creds);
    const res = await fetch(
      `${creds.baseURL}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
          "x-app-key": creds.appKey,
        },
        body: JSON.stringify({ paymentID }),
      },
    );
    if (!res.ok) throw new Error(`bkash execute failed: ${res.status}`);
    const data = (await res.json()) as {
      trxID: string;
      transactionStatus: string;
    };
    return {
      paymentID,
      trxID: data.trxID,
      status: data.transactionStatus === "Completed" ? "success" : "failed",
      amount,
      invoice,
    };
  }
  // Simulated sandbox – 95% success rate
  const ok = Math.random() < 0.95;
  const trxID = `SBX${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  return {
    paymentID,
    trxID,
    status: ok ? "success" : "failed",
    amount,
    invoice,
  };
}
