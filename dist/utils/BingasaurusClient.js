"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingasaurusClient = void 0;
const BingConversation_1 = require("./BingConversation");
class BingasaurusClient {
    userToken;
    otherHeaders;
    conversations;
    constructor(options) {
        this.userToken = options._U_token;
        this.otherHeaders = options.otherHeaders || {};
        this.conversations = [];
    }
    createConversation(options = {}) {
        const convo = new BingConversation_1.BingConversation({
            userToken: this.userToken,
            otherHeaders: this.otherHeaders,
            ...options,
        });
        this.conversations.push(convo);
        return convo;
    }
}
exports.BingasaurusClient = BingasaurusClient;
