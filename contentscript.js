var srcVue = "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js";
var srcApi = "https://apis.google.com/js/api.js";
var srcGrabber = "http://localhost/grabber.js";
var srcGrabberCss = "http://localhost/style.css";
var grabberHtmlDebugg = `<button id="initBtn" onclick="init()">init</button><div id="cvGrabber">
<button v-if="!gapiLoaded" @click="checkGapi()">checkGapi</button>
<template v-else>
    <template v-if="isSignedIn">
        <div>
            <button v-if="isSignedIn" @click="signout()">
            Sign Out
            </button>
            <button @click="updateSheet()">updateSheet</button>
            <button @click="getSheetData()">getSheetData</button>
            <input v-model="getSheet" type="text" />
            <button @click="getLastEmptyRow()">getLastEmptyRow</button>
            <button @click="grabCV()">grabCV</button>
        </div>
        <div>selectedSheetRow:{{lastRowRange}}</div>
        <div>currentCV:{{cv}}</div>
    </template>
    <template v-else>
        <button @click="signin()">Authorize</button>
    </template>
</template>
</div>`;

var grabberHtml = `<div id="cvGrabber">
<button v-if="!gapiLoaded" @click="checkGapi()">checkGapi</button>
<template v-else>
    <template v-if="isSignedIn">
        <div>
            <input v-model="getSheet" type="text" />
            <button @click="getSheetData()">selectSheet</button>
            <button @click="updateSheet()">Grab this CV</button>
        </div>
        <div>selectedSheetRow:<h3>{{lastRowRange}}</h3></div>
        <div>currentCV:<table>
        <tr>
            <td>Овог</td>
            <td><h3>{{cv.lName}}</h3></td>
            <td>Нэр / (Он)</td>
            <td><h3>{{cv.fName}} / ({{cv.birth}})</h3></td>
            <td>Албан тушаал</td>
            <td><h3>{{cv.cPositon}}</h3></td>
        </tr>
        <tr>
            <td>Утас</td>
            <td><h3>{{cv.tel}}</h3></td>
            <td>Цалин</td>
            <td><h3>{{cv.prefSal}}</h3></td>
            <td>Ажлын газар</td>
            <td><h3>{{cv.cCompany}}</h3></td>
        </tr>        
        </table></div>
    </template>
    <template v-else>
        <button @click="signin()">Authorize</button>
    </template>
</template>
</div>`;
// https://docs.google.com/
var blackList = ["docs.google.com", "localhost"];
var extensionOrigin = "chrome-extension://" + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var injectingDiv = document.createElement("div");
    injectingDiv.className = "cv-grabber-con";
    injectingDiv.innerHTML = grabberHtml;

    var shouldAppend = true;
    for (let i = 0; i < blackList.length; i++) {
        const blackLink = blackList[i];
        if (window.location.host.includes(blackLink)) {
            shouldAppend = false;
            console.log("homeLink");
        }
    }

    if (shouldAppend) {
        addCss(srcGrabberCss);
        addScript(srcVue);
        addScript(srcApi);
        document.body.appendChild(injectingDiv);
        addScript(srcGrabber);
    }
}

function addScript(src) {
    var s = document.createElement("script");
    s.setAttribute("src", src);
    document.body.appendChild(s);
}

function addCss(src) {
    var link = document.createElement("link");
    link.setAttribute("href", src);
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    document.body.appendChild(link);
}
