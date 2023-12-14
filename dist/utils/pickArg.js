"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickArg = void 0;
function pickArg(...args) {
    return args[Math.floor(Math.random() * args.length)];
}
exports.pickArg = pickArg;
