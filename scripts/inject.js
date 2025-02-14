console.log("Injecting div...");
var s = document.createElement('script');
// must be listed in web_accessible_resources in manifest.json

s.src = chrome.runtime.getURL('injected.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

console.log("Injecting div...");

let div = document.createElement("div");
div.id = "custom-absolute-div";
div.innerText = "Injected Absolute Div";

// Style the div
div.style.position = "absolute";
div.style.top = "50px";   // Adjust Y position
div.style.left = "50px";  // Adjust X position
div.style.background = "rgba(0,0,0,0.8)";
div.style.color = "white";
div.style.padding = "10px";
div.style.borderRadius = "5px";
div.style.zIndex = "9999";
div.style.fontFamily = "Arial, sans-serif";
div.style.fontSize = "14px";

// Add it to the body
document.body.appendChild(div);