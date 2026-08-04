import { randomBytes } from "crypto";

export function generateId(prefix = "id"): string {
  const hex = randomBytes(8).toString("hex");
  return `${prefix}_${hex}`;
}

export function generateInvoice(): string {
  const num = Math.floor(Math.random() * 9_000_000) + 1_000_000;
  return `INV-${num}`;
}
