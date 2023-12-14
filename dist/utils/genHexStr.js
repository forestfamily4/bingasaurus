"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genHexStr = void 0;
function genHexStr(stringLength) {
    if (stringLength % 2 == 1) {
        throw new Error("hex string needs to be an even number");
    }
    const uint8 = new Uint8Array(stringLength / 2);
    crypto.getRandomValues(uint8);
    const bytes = Array.from(uint8);
    const toString = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
    return toString;
}
exports.genHexStr = genHexStr;