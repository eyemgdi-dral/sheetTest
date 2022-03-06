document.addEventListener(
    "DOMContentLoaded",
    function () {
        setTimeout(function () {
            //testInit();
        }, 2000);
    },
    false
);

function testInit() {
    var checkGapiBtn = document.getElementById("checkGapiBtn");
    var authorizeButton = document.getElementById("authorize_button");
    var signoutButton = document.getElementById("signout_button");
    var createSheetBtn = document.getElementById("createSheet");
    var updateSheetBtn = document.getElementById("updateSheet");

    checkGapiBtn.onclick = checkGapi;

    // var checkPageButton = document.getElementById("checkPage");
    // checkPageButton.addEventListener("click", function () {}, false);

    // Client ID and API key from the Developer Console
    var CLIENT_ID =
        "428363328956-0skn45p7meq4ej3uene2cs07n6i3f5gf.apps.googleusercontent.com";
    var API_KEY = "AIzaSyByXqwdoW29kRtIFrZSJzxhbuVxaVL-NZY";

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
    ];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    function checkGapi() {
        console.log(gapi);
        if (gapi) {
            handleClientLoad();
        } else {
            alert("no gapi");
        }
    }

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    // document.onload = handleClientLoad();
    function handleClientLoad() {
        gapi.load("client:auth2", initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                function () {
                    // Listen for sign-in state changes.
                    gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(
                        gapi.auth2.getAuthInstance().isSignedIn.get()
                    );
                    authorizeButton.onclick = handleAuthClick;
                    signoutButton.onclick = handleSignoutClick;
                },
                function (error) {
                    appendPre(JSON.stringify(error, null, 2));
                }
            );
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = "none";
            signoutButton.style.display = "block";
            listMajors();
        } else {
            authorizeButton.style.display = "block";
            signoutButton.style.display = "none";
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
        var pre = document.getElementById("content");
        var textContent = document.createTextNode(message + "\n");
        pre.appendChild(textContent);
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    function listMajors() {
        gapi.client.sheets.spreadsheets.values
            .get({
                spreadsheetId: "1e89vgtnxoTmZIA1n-Y_zpSiFSdmVGWaXCIzVM_RUk8M",
                range: "Class Data!A2:E",
            })
            .then(
                function (response) {
                    console.log("response", response);
                },
                function (response) {
                    appendPre("Error: " + response.result.error.message);
                }
            );
    }

    var spreadsheetId = "1e89vgtnxoTmZIA1n-Y_zpSiFSdmVGWaXCIzVM_RUk8M";

    function createSheet() {
        var title = "newSheet";
        gapi.client.sheets.spreadsheets
            .create({
                properties: {
                    title: title,
                },
            })
            .then((response) => {});
    }
}