"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQuery = void 0;
const genHexStr_1 = require("./genHexStr");
const pickArg_1 = require("./pickArg");
function formatQuery(prompt, options) {
    const { invocationId = 1, locale = "en-US", market = "en-US", region = "US", location, messageType = options.messageType
        ? options.messageType
        : (0, pickArg_1.pickArg)("Chat", "SearchQuery"), variant = "h3imaginative", conversationId, clientId, conversationSignature, isStartOfSession = true, } = options;
    const optionsSets = [
        "nlu_direct_response_filter",
        "deepleo",
        "disable_emoji_spoken_text",
        "responsible_ai_policy_235",
        "enablemm",
        // "rai273", // 271, 272
        "intmvgnd",
        "dv3sugg",
        // "autosave",
        "gencontentv3", // v1, v2, v3
        // "dv3latencyv2", // v1, v2, v3
        "weanow",
        "iyxapbing",
        "iycapbing",
        "fluxsrtrunc",
        "fluxtrunc",
        "fluxv1",
        "rai273",
        "replaceurl",
    ];
    optionsSets.push(variant);
    if (variant !== "galileo") {
        optionsSets.push("clgalileo"); // looks like you need to add this when it's galileo
    }
    const queryMessage = {
        locale,
        market,
        region,
        location: location
            ? `lat:${location.lat};long:${location.lng};re=${location.re || "1000m"};`
            : undefined,
        author: "user",
        inputMethod: "Keyboard",
        messageType,
        text: prompt,
        timestamp: new Date().toISOString(),
    };
    const queryArgument = {
        source: "cib",
        optionsSets,
        allowedMessageTypes: [
            "ActionRequest",
            "Chat",
            "Context",
            "InternalSearchQuery",
            "InternalSearchResult",
            "Disengaged",
            "InternalLoaderMessage",
            "Progress",
            "RenderCardRequest",
            "AdsQuery",
            "SemanticSerp",
            "GenerateContentQuery",
            "SearchQuery",
        ],
        sliceIds: [],
        traceId: (0, genHexStr_1.genHexStr)(32),
        verbosity: "verbose",
        isStartOfSession,
        message: queryMessage,
        conversationSignature,
        participant: { id: clientId },
        conversationId,
    };
    return {
        arguments: [queryArgument],
        tone: "Creative",
        invocationId: String(invocationId),
        target: "chat",
        type: 4,
    };
}
exports.formatQuery = formatQuery;
