console.log("Injecting script...");

var s = document.createElement('script');
// Le script doit être listé dans `web_accessible_resources` dans `manifest.json`
s.src = chrome.runtime.getURL('injected.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener('LoadContent', function(evt) {
    chrome.storage.local.get(["friendList","SIZE_MAP","COEF_SHRINK","OFFST_X","OFFST_Y","MARGIN_MAP","BALL_SIZE_COEF"]).then(result=>{
        const event = new CustomEvent("updateConstantes",JSON.parse(JSON.stringify({"detail":result})))
        window.dispatchEvent(event)
    }
)})

var macroEvent = document.createElement('script');
// Le script doit être listé dans `web_accessible_resources` dans `manifest.json`
macroEvent.src = chrome.runtime.getURL('./scripts/macroScript.js');
macroEvent.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(macroEvent);
