import { BingResponseErrorOptions } from "../types";
export declare class BingResponseError extends Error {
    partialResponse: string;
    clientId?: string;
    conversationId?: string;
    conversationSignature?: string;
    constructor(message: string, partialResponse: string, options?: BingResponseErrorOptions);
}
//# sourceMappingURL=BingChatError.d.ts.map