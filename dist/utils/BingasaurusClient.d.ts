import { BingConversation } from "./BingConversation";
import * as Types from "../types";
export declare class BingasaurusClient {
    userToken: string;
    otherHeaders: HeadersInit;
    conversations: BingConversation[];
    constructor(options: Types.BingChatClientOptions);
    createConversation(options?: Partial<Types.BingConversationOptions>): BingConversation;
}
//# sourceMappingURL=BingasaurusClient.d.ts.map