"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = void 0;
const CREATE_CHAT_URL = "https://www.bing.com/turing/conversation/create";
async function createConversation(cookie, otherHeaders) {
    const fetchOptions = {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            cookie,
            ...otherHeaders,
        },
        referrer: "https://www.bing.com/search",
        referrerPolicy: "origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
    };
    const creationResp = await fetch(CREATE_CHAT_URL, fetchOptions);
    if (creationResp.ok) {
        const data = await creationResp.json();
        const encryptedConversationSignature = creationResp.headers.get("x-sydney-encryptedconversationsignature") ?? "";
        return { ...data, encryptedConversationSignature };
    }
    throw new Error(`unexpected HTTP error #createConversation ${creationResp.status}: ${creationResp.statusText}`);
}
exports.createConversation = createConversation;
