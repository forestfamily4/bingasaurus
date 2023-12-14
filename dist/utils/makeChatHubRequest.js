"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChatHubRequest = void 0;
const ChatHubError_1 = require("../errors/ChatHubError");
const types_1 = require("../types");
const SYDNEY_CHAT_URL = "wss://sydney.bing.com/sydney/ChatHub";
const TERMINAL_CHAR = "";
function makeChatHubRequest(query, secAccessToken, options = {}) {
    return new Promise((resolve, reject) => {
        const { onUpdateStatus, onMessage, onRawMessage } = options;
        let requestStatus = types_1.ChatHubStatus.PENDING;
        let responseText = "";
        if (onUpdateStatus) {
            onUpdateStatus({ text: responseText, status: requestStatus });
        }
        const ws = new WebSocket(`${SYDNEY_CHAT_URL}?sec_access_token=${encodeURIComponent(secAccessToken)}`);
        let pingInterval;
        const handleOpen = () => {
            ws.send(`{"protocol":"json","version":1}${TERMINAL_CHAR}`);
            requestStatus = types_1.ChatHubStatus.SENDING;
            if (onUpdateStatus) {
                onUpdateStatus({ text: "", status: requestStatus });
            }
            ws.send(`{"type":6}${TERMINAL_CHAR}`);
            pingInterval = setInterval(() => {
                try {
                    ws.send(`{"type":6}${TERMINAL_CHAR}`);
                }
                catch {
                    /*(err)*/
                    // I'm not sure why occasionally this is happening now, but just ignoring the error keeps things in check
                    // console.error(err);
                }
            }, 1000 * 15);
            ws.send(`${JSON.stringify(query)}${TERMINAL_CHAR}`);
        };
        const handleMessage = (msg) => {
            if (onRawMessage)
                onRawMessage(msg);
            const sydneyMsgs = formatRawMessage(msg);
            const formatted = sydneyMsgs.map((m) => {
                if (onMessage)
                    onMessage(m);
                return handleSydneyMessage(m, requestStatus);
            });
            for (const { status, raw, text, shouldBreak } of formatted) {
                responseText =
                    status !== types_1.ChatHubStatus.FAILED && !!text ? text : responseText; // keep any partial response
                if (shouldBreak) {
                    break;
                }
                if (onUpdateStatus)
                    onUpdateStatus({ text, status });
                if (status !== requestStatus) {
                    requestStatus = status;
                }
                if (status === types_1.ChatHubStatus.FINISHED) {
                    ws.close(1000, types_1.ChatHubStatus.FINISHED);
                    resolve({ raw: raw, text });
                    break;
                }
                if (status === types_1.ChatHubStatus.FAILED) {
                    ws.close(1000, types_1.ChatHubStatus.FAILED);
                    reject(new ChatHubError_1.ChatHubError(text, responseText));
                    break;
                }
            }
        };
        const handleError = (event) => {
            console.error(`Websocket error ${event.message}`);
            reject(new ChatHubError_1.ChatHubError(event.message, responseText));
        };
        const handleClose = (event) => {
            pingInterval && clearTimeout(pingInterval);
            ws.removeEventListener("open", handleOpen);
            ws.removeEventListener("message", handleMessage);
            ws.removeEventListener("error", handleError);
            ws.removeEventListener("close", handleClose);
            const closeEvent = event;
            if (event.code !== 1000) {
                reject(new ChatHubError_1.ChatHubError(`Websocket closed with a ${closeEvent.code} becuase of ${closeEvent.reason}`, responseText));
            }
        };
        ws.addEventListener("open", handleOpen);
        ws.addEventListener("error", handleError);
        ws.addEventListener("message", handleMessage);
        ws.addEventListener("close", handleClose);
    });
}
exports.makeChatHubRequest = makeChatHubRequest;
const formatRawMessage = (message) => {
    const rawJSON = message.data
        .toString()
        .split(TERMINAL_CHAR)
        .filter(Boolean);
    const rawMessages = rawJSON
        .map((str) => JSON.parse(str))
        .filter((m) => Boolean(m) && Object.keys(m).length !== 0);
    return rawMessages;
};
const handleSydneyMessage = (message, currentStatus) => {
    const stripped = {
        status: currentStatus,
        raw: message,
        text: "",
        shouldBreak: false,
    };
    switch (message.type) {
        case 1: {
            const msg1 = message;
            if (msg1.arguments[0].requestId && !msg1.arguments[0].messages) {
                stripped.status = types_1.ChatHubStatus.DELIVERED;
                stripped.text = "";
                break;
            }
            const m = msg1.arguments[0].messages[0];
            if (m?.messageType) {
                const botM = m;
                stripped.status = types_1.ChatHubStatus.SEARCHING;
                stripped.text = botM.text || "";
                break;
            }
            const isCursor = msg1.arguments[0].cursor;
            if (isCursor) {
                stripped.status = types_1.ChatHubStatus.WRITING;
                stripped.text = "";
                break;
            }
            stripped.status = types_1.ChatHubStatus.WRITING;
            stripped.text = msg1.arguments[0].messages[0].text;
            break;
        }
        case 2: {
            const response = message;
            if (response.item.result.value === "Success") {
                const lastMsgWithContent = response.item.messages
                    .filter((m) => !m.messageType)
                    .at(-1);
                if (lastMsgWithContent.hiddenText &&
                    lastMsgWithContent.contentOrigin === "Apology") {
                    stripped.status = types_1.ChatHubStatus.FAILED;
                    stripped.text = lastMsgWithContent.hiddenText;
                    break;
                }
                stripped.status = types_1.ChatHubStatus.FINISHED;
                stripped.text = lastMsgWithContent.text;
                break;
            }
            else {
                stripped.text = response.item.result.message;
                stripped.status = types_1.ChatHubStatus.FAILED;
            }
            break;
        }
        case 6: {
            stripped.shouldBreak = true;
            break;
        }
        case 7: {
            const msg = message;
            stripped.status = types_1.ChatHubStatus.FAILED;
            stripped.text = msg.error;
            break;
        }
        default: {
            // Do nothing
        }
    }
    return stripped;
};
