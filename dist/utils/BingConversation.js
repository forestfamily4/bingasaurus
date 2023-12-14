"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingConversation = void 0;
const createConversation_1 = require("./createConversation");
const formatQuery_1 = require("./formatQuery");
const makeChatHubRequest_1 = require("./makeChatHubRequest");
class BingConversation {
    cookie;
    otherHeaders;
    #clientId;
    #conversationId;
    #conversationSignature;
    #encryptedConversationSignature;
    #isSessionStarted;
    #messages;
    #history;
    constructor(opts) {
        const { userToken, conversationId, conversationSignature, clientId, otherHeaders, } = opts;
        if (!userToken) {
            throw new Error("_U token is required");
        }
        this.cookie = `_U=${userToken};`;
        this.otherHeaders = otherHeaders || {};
        this.#isSessionStarted = false;
        this.#messages = [];
        this.#history = [];
        if (conversationId && conversationSignature && clientId) {
            this.#isSessionStarted = true;
            this.#clientId = clientId;
            this.#conversationId = conversationId;
            this.#conversationSignature = conversationSignature;
        }
        else if ([conversationId, conversationSignature, clientId].some(Boolean)) {
            throw new Error(`conversationId, conversationSignature, and clientId must be used together.`);
        }
    }
    get clientId() {
        return this.#clientId;
    }
    get conversationId() {
        return this.#conversationId;
    }
    get conversationSignature() {
        return this.#conversationSignature;
    }
    get messages() {
        return this.#messages;
    }
    get history() {
        return this.#history;
    }
    async sendMessage(prompt, options = {}) {
        let isStartOfSession = true;
        if (this.#isSessionStarted) {
            isStartOfSession = false;
        }
        else {
            const { clientId, conversationId, conversationSignature, encryptedConversationSignature, } = await (0, createConversation_1.createConversation)(this.cookie, this.otherHeaders);
            this.#conversationId = conversationId;
            this.#clientId = clientId;
            this.#conversationSignature = conversationSignature;
            this.#encryptedConversationSignature = encryptedConversationSignature;
        }
        const conversationId = this.#conversationId;
        const clientId = this.#clientId;
        const conversationSignature = this.#conversationSignature;
        const encryptedConversationSignature = this
            .#encryptedConversationSignature;
        const query = (0, formatQuery_1.formatQuery)(prompt, {
            ...options,
            conversationId,
            clientId,
            conversationSignature,
            isStartOfSession,
        });
        this.#isSessionStarted = true;
        this.messages.push({ prompt });
        const response = await (0, makeChatHubRequest_1.makeChatHubRequest)(query, encryptedConversationSignature, options);
        this.messages[this.messages.length - 1].response = response.text;
        this.history.push(response);
        return response;
    }
}
exports.BingConversation = BingConversation;
