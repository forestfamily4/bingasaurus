"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHubError = void 0;
class ChatHubError extends Error {
    partialResponse;
    constructor(message, partialResponse) {
        super(message);
        this.partialResponse = partialResponse;
    }
}
exports.ChatHubError = ChatHubError;
