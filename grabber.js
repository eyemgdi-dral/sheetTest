function constants() {
    this.LASTSHEET = "LASTSHEET";
}
const Constants = new constants();
function init() {
    var cvGrabber = new Vue({
        el: "#cvGrabber",
        data: {
            isSignedIn: false,
            gapiLoaded: false,
            grabberToggler: false,
            spreadSheetId: "1EoFWoJTkEbck7NukWQtp5lihvf2FYuqLlhX3g3iLZj0",
            clientId:
                "428363328956-0skn45p7meq4ej3uene2cs07n6i3f5gf.apps.googleusercontent.com",
            apiKey: "AIzaSyByXqwdoW29kRtIFrZSJzxhbuVxaVL-NZY",
            discoveryDocs: [
                "https://sheets.googleapis.com/$discovery/rest?version=v4",
            ],
            scopes: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets",
            range: "Sheet1!A1:E5",
            getSheet: "Sheet1",
            getRange: "A1:O26",
            currentData: [],
            valueInputOption: "USER_ENTERED", //RAW
            cv: {
                fName: "fName",
                lName: "lName",
                age: "", //it must computed in the SHEET,
                birth: "birth",
                cPositon: "cPositon",
                cCompany: "cCompany",
                exp: "exp",
                prefSal: "prefSal",
                tel: "tel",
            },
            lastRowIdx: "",
        },
        computed: {
            getSheetRange: function () {
                return `${this.getSheet}!${this.getRange}`;
            },
            lastRowRange: function () {
                return `${this.getSheet}!B${this.lastRowIdx}:O${this.lastRowIdx}`;
            },
            cellBirth: function () {
                return "=YEAR(TODAY()) - E" + this.lastRowIdx;
            },
            updateData: function () {
                return [
                    [
                        this.cv.fName,
                        this.cv.lName,
                        this.cellBirth,
                        this.cv.birth,
                        this.cv.cPositon,
                        this.cv.cCompany,
                        this.cv.exp,
                        this.cv.prefSal,
                        this.cv.tel,
                    ],
                ];
            },
        },
        methods: {
            toggleGrabber: function () {
                this.grabberToggler = !this.grabberToggler;
                if (this.grabberToggler) {
                    $(".cv-grabber-con").addClass("hider");
                } else {
                    $(".cv-grabber-con").removeClass("hider");
                }
            },
            //auth func
            checkGapi: function () {
                if (gapi) {
                    this.gapiLoaded = true;
                    this.handleClientLoad();
                } else {
                    alert("no gapi");
                }
            },
            handleClientLoad: function () {
                gapi.load("client:auth2", this.initClient);
            },
            updateSigninStatus: function (isSignedIn) {
                if (isSignedIn) {
                    this.isSignedIn = isSignedIn;
                    this.getSheetData();
                    this.grabCV();
                    // listMajors();
                } else {
                }
            },
            initClient: function () {
                gapi.client
                    .init({
                        apiKey: this.apiKey,
                        clientId: this.clientId,
                        discoveryDocs: this.discoveryDocs,
                        scope: this.scopes,
                    })
                    .then(
                        function () {
                            // Listen for sign-in state changes.
                            gapi.auth2
                                .getAuthInstance()
                                .isSignedIn.listen(
                                    cvGrabber.updateSigninStatus
                                );
                            // Handle the initial sign-in state.
                            cvGrabber.updateSigninStatus(
                                gapi.auth2.getAuthInstance().isSignedIn.get()
                            );
                        },
                        function (error) {
                            appendPre(JSON.stringify(error, null, 2));
                        }
                    );
            },
            signout: function () {
                gapi.auth2.getAuthInstance().signOut();
            },
            signin: function () {
                gapi.auth2.getAuthInstance().signIn();
            },
            //sheet func
            getSheetData: function () {
                gapi.client.sheets.spreadsheets.values
                    .get({
                        spreadsheetId: this.spreadSheetId,
                        range: this.getSheetRange,
                    })
                    .then((response) => {
                        console.log(response);
                        var result = response.result;
                        this.currentData = result.values;
                        var numRows = result.values ? result.values.length : 0;
                        console.log(`${numRows} rows retrieved.`);
                        this.getLastEmptyRow();
                    });
            },
            updateSheet: function () {
                var body = {
                    values: this.updateData,
                };

                gapi.client.sheets.spreadsheets.values
                    .update({
                        spreadsheetId: this.spreadSheetId,
                        range: this.lastRowRange,
                        valueInputOption: this.valueInputOption,
                        resource: body,
                    })
                    .then((response) => {
                        var result = response.result;
                        console.log(`${result.updatedCells} cells updated.`);
                        this.getSheetData();
                    });
            },
            getLastEmptyRow: function () {
                this.currentData.length;
                for (let i = 0; i < this.currentData.length; i++) {
                    const row = this.currentData[i];
                    if (!row[1]) {
                        this.lastRowIdx = row[0] * 1 + 1;
                        break;
                    }
                    // console.log("lastRowIdx", this.lastRowIdx);
                }
            },
            grabCV: function () {
                //Mobile
                this.cv.tel = $(".mobile").length
                    ? $($(".mobile")[0]).text()
                    : 0;
                // fName, lName, birth
                $(".val").each((idx, el) => {
                    $el = $(el);
                    var type = $el.prev("div").find("b");

                    console.log($(type).text());
                    console.log($el.text());

                    if ($(type).text() == "Эцэг/эхийн нэр") {
                        this.cv.lName = $el.text();
                    }
                    if ($(type).text() == "Нэр") {
                        this.cv.fName = $el.text();
                    }
                    if ($(type).text() == "Төрсөн огноо") {
                        this.cv.birth = $el.text().split("-")[0];
                    }
                });

                // cPositon, cCompany
                if ($("#experience").length) {
                    var $elem = $($("#experience .item .data")[0]);
                    $($elem.find("strong")).remove();
                    this.cv.cPositon = $($elem.find("em")).text();
                    this.cv.cCompany = $(
                        $("#experience .item .data>span")[0]
                    ).text();
                } else {
                    this.cv.cPositon = "";
                    this.cv.cCompany = "";
                }
                // prefSal
                if ($("#main-jobmore").length) {
                    var salStr = $("#main-jobmore div:first-child b").text();
                    salStr = salStr.split(" - ");
                    salStr =
                        salStr[0].substr(0, 3) + "-" + salStr[1].substr(0, 3);
                    this.cv.prefSal = salStr;
                } else {
                    this.cv.prefSal = "-";
                }
            },
            getLastSheet: function () {
                if (localStorage.getItem(Constants.LASTSHEET)) {
                    this.getSheet = localStorage.getItem(Constants.LASTSHEET);
                }
            },
        },
        created: function () {
            this.getLastSheet();
            this.checkGapi();
        },
        watch: {
            getSheet: function (val) {
                localStorage.setItem(Constants.LASTSHEET, val);
            },
        },
    });
}

var startIn = 3000;
// var started = false;
var intervalId;

intervalId = setInterval(() => {
    console.log("checking gapi...");
    checkGapiInit();
}, 1000);

function checkGapiInit() {
    if (gapi) {
        console.log("gapi ready...");
        clearInterval(intervalId);
        init();
    }
}
checkGapiInit();
