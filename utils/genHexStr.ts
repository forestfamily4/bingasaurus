import { randomFillSync } from "crypto";
export function genHexStr(stringLength: number) {
  if (stringLength % 2 == 1) {
    throw new Error("hex string needs to be an even number");
  }

  const uint8 = new Uint8Array(stringLength / 2);
  randomFillSync(uint8);
  const bytes = Array.from(uint8);
  const toString = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return toString;
}
