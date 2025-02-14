chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("emupedia.net")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/injected.js"]
        });
    }
});