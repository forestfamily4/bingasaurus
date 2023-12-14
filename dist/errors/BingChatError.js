"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingResponseError = void 0;
class BingResponseError extends Error {
    partialResponse;
    clientId;
    conversationId;
    conversationSignature;
    constructor(message, partialResponse, options = {}) {
        super(message);
        const { conversationId, conversationSignature, clientId } = options;
        this.partialResponse = partialResponse;
        if (clientId)
            this.clientId = clientId;
        if (conversationId)
            this.conversationId = conversationId;
        if (conversationSignature) {
            this.conversationSignature = conversationSignature;
        }
    }
}
exports.BingResponseError = BingResponseError;
