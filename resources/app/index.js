

// Determine the operating system:
var osObject = require('os');
var platform = osObject.platform();

// Initialize 'path' object:
var pathObject;
if (platform !== "win32") {
    pathObject = require('path').posix;
} else {
    pathObject = require('path').win32;
}

// Get the full path of the directory where Electron or NW.js binary is located:
var binaryPath = process.execPath;
var binaryDirectory = pathObject.dirname(binaryPath);

// Get the full path of the application root directory:
var applicationDirectory = pathObject.join(binaryDirectory, "resources", "app");


// Perl scripts handling function:
function startPerlVersionScript() {
    var scriptFullPath = pathObject
        .join(applicationDirectory, "perl", "version.pl");
    camelHarness(scriptFullPath, "versionScriptStdout",
        null, null, null, null, null);
}


function versionScriptStdout(stdout) {
    document.getElementById("version-script").innerHTML = stdout;
}


function startLongRunningPerlScriptOne() {
    var scriptFullPath = pathObject
        .join(applicationDirectory, "perl", "counter.pl");
    camelHarness(scriptFullPath, "longRunningPerlScriptOneStdout",
        null, null, null, null, null);
}


function longRunningPerlScriptOneStdout(stdout) {
    document.getElementById("long-running-script-one").innerHTML = stdout;
}


function startLongRunningPerlScriptTwo() {
    var scriptFullPath = pathObject
        .join(applicationDirectory, "perl", "counter.pl");
    camelHarness(scriptFullPath, "longRunningPerlScriptTwoStdout",
        null, null, null, null, null);
}


function longRunningPerlScriptTwoStdout(stdout) {
    document.getElementById("long-running-script-two").innerHTML = stdout;
}
