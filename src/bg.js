// background.js
let popupOpen = false;

if (localStorage.getItem("state") === null) {
    localStorage.setItem("state", true);
    localStorage.setItem("input_gain", 1.0);
    localStorage.setItem("output_gain", 1.0);
    localStorage.setItem("threshold", -30);
    localStorage.setItem("knee", 12);
    localStorage.setItem("ratio", 8);
    localStorage.setItem("attack", 0);
    localStorage.setItem("release", 0.25);
}

// ポップアップが開かれた時
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "popupOpened") {
        popupOpen = true;
    }
});

// ポップアップが閉じられた時
browser.runtime.onConnect.addListener((port) => {
    port.onDisconnect.addListener(() => {
        if (popupOpen) {
            popupOpen = false;
            // アクティブなタブにメッセージを送信
            browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "popupClosed", message: "Popup was closed"});
            });
        }
    });
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "require_params") {
        if (localStorage.getItem("state") === null) {
            localStorage.setItem("state", true);
            localStorage.setItem("input_gain", 1.0);
            localStorage.setItem("output_gain", 1.0);
            localStorage.setItem("threshold", -30);
            localStorage.setItem("knee", 12);
            localStorage.setItem("ratio", 8);
            localStorage.setItem("attack", 0);
            localStorage.setItem("release", 0.25);
        }
        sendResponse({
            input_gain: localStorage.getItem("input_gain"),
            output_gain: localStorage.getItem("output_gain"),
            threshold: localStorage.getItem("threshold"),
            knee: localStorage.getItem("knee"),
            ratio: localStorage.getItem("ratio"),
            attack: localStorage.getItem("attack"),
            release: localStorage.getItem("release"),
            state: localStorage.getItem("state")
        });
    }
});