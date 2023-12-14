import { BingConversationOptions, BingMessageOptions, BingMessageResponse, Chat } from "../types";
export declare class BingConversation {
    #private;
    cookie: string;
    otherHeaders?: HeadersInit;
    constructor(opts: BingConversationOptions);
    get clientId(): string | undefined;
    get conversationId(): string | undefined;
    get conversationSignature(): string | undefined;
    get messages(): Chat[];
    get history(): BingMessageResponse[];
    sendMessage(prompt: string, options?: BingMessageOptions): Promise<BingMessageResponse>;
}
//# sourceMappingURL=BingConversation.d.ts.map