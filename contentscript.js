// Avoid recursive frame insertion...
var extensionOrigin = "chrome-extension://" + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement("iframe");
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL("frame.html");

    // Some styles for a fancy sidebar
    iframe.style.cssText =
        "position: fixed; bottom: 0px; display: block; width: 100%; z-index: 9999;";
    document.body.appendChild(iframe);
}
