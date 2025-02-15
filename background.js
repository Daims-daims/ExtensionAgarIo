chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("emupedia.net")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/injected.js"]
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_STORAGE") {
      chrome.storage.local.get(["friendsList", "SIZE_MAP", "COEF_SHRINK", "OFFST_X", "OFFST_Y", "MARGIN_MAP"], (result) => {
        sendResponse(result);
      });
      return true; // Required for async `sendResponse`
    }
  });